import projects from "@/app/data/projects.json";
import users from "@/app/data/users.json";
import type { User } from "@/app/lib/currentUser";

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

export function getProjectById(projectId: number): Project | undefined {
  return projects.find((project) => project.id === projectId);
}

export function isProjectAssignedToUser(project: Project, user: User): boolean {
  if (user.role === "Drafter") return project.drafterId === user.id;
  if (user.role === "Engineer") return project.engineerId === user.id;
  return false;
}
