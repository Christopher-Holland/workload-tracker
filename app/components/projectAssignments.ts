import projects from "@/app/data/projects.json";
import users from "@/app/data/users.json";

export type Project = (typeof projects)[number];

function getUserName(userId: number): string {
  return users.find((u) => u.id === userId)?.name ?? "Unassigned";
}

export function drafterForProject(project: Project): string {
  return getUserName(project.drafterId);
}

export function engineerForProject(project: Project): string {
  return getUserName(project.engineerId);
}

export function isProjectAssignedToUser(
  project: Project,
  user: { id: number; role: string }
): boolean {
  if (user.role === "drafter") return project.drafterId === user.id;
  if (user.role === "engineer") return project.engineerId === user.id;
  return false;
}
