import type { DatePrecision } from "@/lib/types";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Formats a normalized visited_on date (always stored as YYYY-MM-DD, with
 * the day/month zeroed out when precision is coarser) for display,
 * respecting how much of it the user actually specified.
 */
export function formatVisitedDate(visitedOn: string, precision: DatePrecision): string {
  const [year, month, day] = visitedOn.split("-").map(Number);
  if (precision === "year") return String(year);
  if (precision === "month") return `${MONTH_NAMES[month - 1]} ${year}`;
  return `${MONTH_NAMES[month - 1]} ${day}, ${year}`;
}
