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

export function isProjectAssignedToUser(project: Project, user: User): boolean {
  if (user.role === "Drafter") return project.drafterId === user.id;
  if (user.role === "Engineer") return project.engineerId === user.id;
  return false;
}

/** Role-based hour edit permissions for a project. */
export function getHoursEditPermissions(
  user: User | undefined,
  project: Project
): { canEditDrafterHours: boolean; canEditEngineerHours: boolean } {
  if (!user) {
    return { canEditDrafterHours: false, canEditEngineerHours: false };
  }

  const isManager =
    user.role === "Administrator" || user.role === "Design Coordinator";

  if (isManager) {
    return { canEditDrafterHours: true, canEditEngineerHours: true };
  }

  if (user.role === "Drafter") {
    return {
      canEditDrafterHours: project.drafterId === user.id,
      canEditEngineerHours: false,
    };
  }

  if (user.role === "Engineer") {
    return {
      canEditDrafterHours: false,
      canEditEngineerHours: project.engineerId === user.id,
    };
  }

  return { canEditDrafterHours: false, canEditEngineerHours: false };
}
