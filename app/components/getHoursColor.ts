export function getHoursColor(hoursPct: number): string {
  if (hoursPct >= 100) return "text-red-400";
  if (hoursPct >= 80) return "text-yellow-400";
  if (hoursPct >= 60) return "text-amber-400";
  if (hoursPct === 0) return "text-blue-400";
  return "text-green-400";
}
