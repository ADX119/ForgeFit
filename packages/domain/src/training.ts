import type { RecordType, SetType, TrackingType, UnitSystem } from "./types";

const KG_PER_LB = 0.45359237;

/** Estimated reps beyond this are too unreliable to predict a one-rep max from. */
export const MAX_REPS_FOR_ESTIMATE = 12;

const oneDecimal = (value: number) => Math.round(value * 10) / 10;

/** Epley estimate of the heaviest single rep. One rep returns the weight itself. */
export function estimateOneRepMax(weightKg: number, reps: number): number {
  if (weightKg <= 0 || reps <= 0) return 0;
  if (reps === 1) return oneDecimal(weightKg);
  return oneDecimal(weightKg * (1 + reps / 30));
}

export function kgToDisplay(kg: number, unitSystem: UnitSystem): number {
  return unitSystem === "IMPERIAL" ? oneDecimal(kg / KG_PER_LB) : oneDecimal(kg);
}

/** Converts a weight typed in the user's unit to kilograms, the unit everything is stored in. */
export function displayToKg(value: number, unitSystem: UnitSystem): number {
  return unitSystem === "IMPERIAL" ? Math.round(value * KG_PER_LB * 100) / 100 : value;
}

export function weightUnit(unitSystem: UnitSystem): "kg" | "lb" {
  return unitSystem === "IMPERIAL" ? "lb" : "kg";
}

export interface LoggedSet {
  id: string;
  exerciseId: string;
  trackingType: TrackingType;
  setType: SetType;
  weightKg: number | null;
  reps: number | null;
  durationSeconds: number | null;
  completed: boolean;
}

/** Sets that count towards volume and records: completed and not warm-ups. */
export function isWorkingSet(set: LoggedSet): boolean {
  return set.completed && set.setType !== "WARMUP";
}

/**
 * Kilograms moved in one set. For bodyweight movements only added weight counts, because
 * ForgeFit doesn't know the lifter's bodyweight at the moment of the set.
 */
export function setVolumeKg(set: LoggedSet): number {
  if (!isWorkingSet(set) || !set.weightKg || !set.reps) return 0;
  if (set.trackingType !== "WEIGHT_REPS" && set.trackingType !== "REPS_ADDED_WEIGHT") return 0;
  return set.weightKg * set.reps;
}

export function sessionVolumeKg(sets: LoggedSet[]): number {
  return oneDecimal(sets.reduce((total, set) => total + setVolumeKg(set), 0));
}

export interface RecordCandidate {
  exerciseId: string;
  recordType: RecordType;
  value: number;
  setId: string | null;
  weightKg: number | null;
  reps: number | null;
  /** The best before this workout; null when this is the first time it was logged. */
  previous: number | null;
}

/** Previous bests keyed by `${exerciseId}:${recordType}`. */
export type PreviousBests = Map<string, number>;

export const recordKey = (exerciseId: string, recordType: RecordType) =>
  `${exerciseId}:${recordType}`;

/**
 * Records set in one workout: for each exercise and record type, the best working set, if it
 * beats the previous best. First-ever values are returned with `previous: null` so the UI can
 * call them a baseline rather than a PR.
 */
export function findRecords(sets: LoggedSet[], previousBests: PreviousBests): RecordCandidate[] {
  const best = new Map<string, RecordCandidate>();
  const consider = (candidate: Omit<RecordCandidate, "previous">) => {
    if (candidate.value <= 0) return;
    const key = recordKey(candidate.exerciseId, candidate.recordType);
    const current = best.get(key);
    if (!current || candidate.value > current.value)
      best.set(key, { ...candidate, previous: previousBests.get(key) ?? null });
  };

  const volumeByExercise = new Map<string, number>();
  for (const set of sets.filter(isWorkingSet)) {
    const base = {
      exerciseId: set.exerciseId,
      setId: set.id,
      weightKg: set.weightKg,
      reps: set.reps,
    };
    const weighted = set.trackingType === "WEIGHT_REPS" || set.trackingType === "REPS_ADDED_WEIGHT";
    if (weighted && set.weightKg && set.reps) {
      consider({ ...base, recordType: "MAX_WEIGHT", value: set.weightKg });
      if (set.reps <= MAX_REPS_FOR_ESTIMATE)
        consider({
          ...base,
          recordType: "EST_1RM",
          value: estimateOneRepMax(set.weightKg, set.reps),
        });
    }
    if ((set.trackingType === "REPS" || set.trackingType === "REPS_ADDED_WEIGHT") && set.reps)
      consider({ ...base, recordType: "MAX_REPS", value: set.reps });
    if (set.trackingType === "DURATION" && set.durationSeconds)
      consider({ ...base, recordType: "MAX_DURATION", value: set.durationSeconds });
    volumeByExercise.set(
      set.exerciseId,
      (volumeByExercise.get(set.exerciseId) ?? 0) + setVolumeKg(set),
    );
  }
  for (const [exerciseId, volume] of volumeByExercise)
    consider({
      exerciseId,
      recordType: "MAX_SESSION_VOLUME",
      value: oneDecimal(volume),
      setId: null,
      weightKg: null,
      reps: null,
    });

  return [...best.values()].filter(
    (record) => record.previous === null || record.value > record.previous,
  );
}
