import { describe, expect, it } from "vitest";
import {
  displayToKg,
  estimateOneRepMax,
  findRecords,
  kgToDisplay,
  recordKey,
  sessionVolumeKg,
  type LoggedSet,
} from "./training";

const set = (overrides: Partial<LoggedSet>): LoggedSet => ({
  id: "s1",
  exerciseId: "bench",
  trackingType: "WEIGHT_REPS",
  setType: "NORMAL",
  weightKg: 60,
  reps: 8,
  durationSeconds: null,
  completed: true,
  ...overrides,
});

describe("estimateOneRepMax", () => {
  it("uses the Epley formula and returns the weight for a single", () => {
    expect(estimateOneRepMax(60, 10)).toBe(80);
    expect(estimateOneRepMax(100, 1)).toBe(100);
    expect(estimateOneRepMax(0, 5)).toBe(0);
  });
});

describe("units", () => {
  it("converts between kilograms and pounds", () => {
    expect(kgToDisplay(100, "IMPERIAL")).toBe(220.5);
    expect(kgToDisplay(62.5, "METRIC")).toBe(62.5);
    expect(displayToKg(225, "IMPERIAL")).toBe(102.06);
    expect(displayToKg(60, "METRIC")).toBe(60);
  });
});

describe("sessionVolumeKg", () => {
  it("counts completed working sets and ignores warm-ups and bodyweight-only sets", () => {
    const sets = [
      set({ id: "1", weightKg: 60, reps: 10 }),
      set({ id: "2", weightKg: 40, reps: 10, setType: "WARMUP" }),
      set({ id: "3", weightKg: 60, reps: 8, completed: false }),
      set({ id: "4", trackingType: "REPS", weightKg: null, reps: 20 }),
      set({ id: "5", trackingType: "REPS_ADDED_WEIGHT", weightKg: 10, reps: 8 }),
    ];
    expect(sessionVolumeKg(sets)).toBe(680);
  });
});

describe("findRecords", () => {
  it("reports first-ever values as baselines", () => {
    const records = findRecords([set({ weightKg: 60, reps: 8 })], new Map());
    const maxWeight = records.find((r) => r.recordType === "MAX_WEIGHT");
    expect(maxWeight).toMatchObject({ value: 60, previous: null });
  });

  it("keeps only records that beat the previous best, using the best set", () => {
    const previous = new Map([
      [recordKey("bench", "MAX_WEIGHT"), 60],
      [recordKey("bench", "EST_1RM"), 80],
      [recordKey("bench", "MAX_SESSION_VOLUME"), 2000],
    ]);
    const records = findRecords(
      [set({ id: "a", weightKg: 60, reps: 10 }), set({ id: "b", weightKg: 62.5, reps: 6 })],
      previous,
    );
    const byType = Object.fromEntries(records.map((r) => [r.recordType, r]));
    expect(byType.MAX_WEIGHT).toMatchObject({ value: 62.5, setId: "b", previous: 60 });
    // 60 x 10 = 80 (not above 80); 62.5 x 6 = 75: no estimated-max record
    expect(byType.EST_1RM).toBeUndefined();
    // 600 + 375 = 975 is below 2000
    expect(byType.MAX_SESSION_VOLUME).toBeUndefined();
  });

  it("ignores warm-ups, unfinished sets and high-rep sets for the estimate", () => {
    const records = findRecords(
      [
        set({ id: "w", weightKg: 100, reps: 1, setType: "WARMUP" }),
        set({ id: "u", weightKg: 90, reps: 1, completed: false }),
        set({ id: "h", weightKg: 40, reps: 20 }),
      ],
      new Map(),
    );
    const byType = Object.fromEntries(records.map((r) => [r.recordType, r]));
    expect(byType.MAX_WEIGHT).toMatchObject({ value: 40, setId: "h" });
    expect(byType.EST_1RM).toBeUndefined();
  });

  it("tracks reps and hold time for bodyweight and timed exercises", () => {
    const records = findRecords(
      [
        set({
          id: "p",
          exerciseId: "pullup",
          trackingType: "REPS_ADDED_WEIGHT",
          weightKg: null,
          reps: 12,
        }),
        set({
          id: "k",
          exerciseId: "plank",
          trackingType: "DURATION",
          weightKg: null,
          reps: null,
          durationSeconds: 75,
        }),
      ],
      new Map([[recordKey("pullup", "MAX_REPS"), 10]]),
    );
    expect(records).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          exerciseId: "pullup",
          recordType: "MAX_REPS",
          value: 12,
          previous: 10,
        }),
        expect.objectContaining({
          exerciseId: "plank",
          recordType: "MAX_DURATION",
          value: 75,
          previous: null,
        }),
      ]),
    );
  });
});
