/** Parse YYYY-MM-DD or MM-DD-YYYY due date strings. */
export function parseDueDate(dateStr: string): Date {
  const iso = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  }

  const us = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (us) {
    return new Date(Number(us[3]), Number(us[1]) - 1, Number(us[2]));
  }

  return new Date(dateStr);
}

/** Format a due date string as MM-DD-YYYY. */
export function formatDueDate(dateStr: string): string {
  const date = parseDueDate(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
}
