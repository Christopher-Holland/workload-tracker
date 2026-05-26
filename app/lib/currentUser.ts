import users from "@/app/data/users.json";

/** Logged-in user id (prototype — replace with auth/session later). */
export const CURRENT_USER_ID = 1;

export type User = (typeof users)[number];

export function getCurrentUser(userId: number = CURRENT_USER_ID): User | undefined {
  return users.find((u) => u.id === userId);
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const first = parts[0][0] ?? "";
  const last = parts[parts.length - 1][0] ?? "";
  return `${first}${last}`.toUpperCase();
}
