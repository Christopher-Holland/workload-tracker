import type { Project } from "@/app/components/projectAssignments";

export const PROJECT_STATUSES = [
  "Not started",
  "Preliminary",
  "Preliminary Complete",
  "1st round close outs",
  "final closeouts",
  "QA Review",
  "Complete",
] as const satisfies readonly Project["status"][];

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export function isProjectStatus(value: string): value is ProjectStatus {
  return (PROJECT_STATUSES as readonly string[]).includes(value);
}
