export const DEFAULT_TIME_ZONE = "Asia/Kolkata";

const weekdayIndex: Record<string, number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

export function isValidTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

export interface ZonedDay {
  /** Calendar date in the time zone, formatted YYYY-MM-DD. */
  date: string;
  /** ISO weekday: 1 = Monday … 7 = Sunday. */
  dayOfWeek: number;
  /** Short English weekday name, e.g. "Tue". */
  weekday: string;
}

export function zonedDay(timeZone: string, now: Date = new Date()): ZonedDay {
  const zone = isValidTimeZone(timeZone) ? timeZone : DEFAULT_TIME_ZONE;
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const weekday = new Intl.DateTimeFormat("en-US", { timeZone: zone, weekday: "short" }).format(
    now,
  );
  return { date, dayOfWeek: weekdayIndex[weekday] ?? 1, weekday };
}

function addDays(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const value = new Date(Date.UTC(year!, month! - 1, day! + days));
  return value.toISOString().slice(0, 10);
}

/** Dates (YYYY-MM-DD) of Monday through Sunday of the current week in the time zone. */
export function zonedWeekDates(timeZone: string, now: Date = new Date()): string[] {
  const today = zonedDay(timeZone, now);
  const monday = addDays(today.date, 1 - today.dayOfWeek);
  return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
}
