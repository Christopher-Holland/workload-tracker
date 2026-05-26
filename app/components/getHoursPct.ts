export function getHoursPct(actualHours: number, budgetHours: number): number {
  return Math.round((actualHours / budgetHours) * 100);
}
