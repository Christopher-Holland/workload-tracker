import type { User } from "@/app/lib/currentUser";

export type UserRole = User["role"];

export const USER_ROLES: readonly UserRole[] = [
  "Administrator",
  "Design Coordinator",
  "Engineer",
  "Drafter",
] as const;

export type NavItem = {
  href: string;
  label: string;
  /** Roles that can see this link. Narrow per item when access rules are defined. */
  roles: readonly UserRole[];
};

/** All roles — use until per-route access is configured. */
const ALL_ROLES = USER_ROLES;

export const MAIN_NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", roles: ALL_ROLES },
  { href: "/projects", label: "Projects", roles: ALL_ROLES },
  { href: "/workload", label: "Workload", roles: ["Administrator", "Design Coordinator", "Drafter"] },
  { href: "/qa-review", label: "QA Review", roles: ["Administrator", "Design Coordinator", "Engineer"] },
  { href: "/reports", label: "Reports", roles: ["Administrator", "Design Coordinator", "Engineer"] },
  { href: "/calander", label: "Calander", roles: ALL_ROLES },
];

export const ACTION_NAV_ITEMS: NavItem[] = [
  { href: "/alerts", label: "Alerts", roles: ALL_ROLES },
  { href: "/new-project", label: "+ New Project", roles: ["Administrator", "Design Coordinator"] },
];

export function canAccessNavItem(
  role: UserRole | undefined,
  item: NavItem
): boolean {
  if (!role) return false;
  return item.roles.includes(role);
}

export function getNavItemsForRole(
  role: UserRole | undefined,
  items: readonly NavItem[]
): NavItem[] {
  return items.filter((item) => canAccessNavItem(role, item));
}
