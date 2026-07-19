"use server";

import { revalidatePath } from "next/cache";
import {
  getHoursEditPermissions,
  type Project,
} from "@/app/components/projectAssignments";
import { getCurrentUser } from "@/app/lib/currentUser";
import { readProjects, writeProjects } from "@/app/lib/projects";
import {
  isProjectStatus,
  type ProjectStatus,
} from "@/app/lib/projectStatuses";

export async function updateProjectStatus(
  projectId: number,
  status: ProjectStatus
): Promise<{ success: boolean }> {
  if (!isProjectStatus(status)) {
    return { success: false };
  }

  const projects = readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return { success: false };
  }

  const current = projects[index];

  if (current.status === status) {
    return { success: true };
  }

  const updatedAt = new Date().toISOString();
  const historyEntry = { status, updatedAt };
  const existingHistory = current.statusHistory ?? [
    {
      status: current.status,
      updatedAt: current.statusUpdatedAt ?? updatedAt,
    },
  ];

  const updated: Project = {
    ...current,
    status,
    statusUpdatedAt: updatedAt,
    statusHistory: [...existingHistory, historyEntry],
  };

  projects[index] = updated;
  writeProjects(projects);

  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/workload");
  revalidatePath("/");

  return { success: true };
}

type UpdateProjectHoursInput = {
  actualHours?: number;
  engineerActualHours?: number;
};

export async function updateProjectHours(
  projectId: number,
  hours: UpdateProjectHoursInput
): Promise<{ success: boolean; error?: string }> {
  const user = getCurrentUser();

  if (!user) {
    return { success: false, error: "You must be signed in to update hours." };
  }

  const projects = readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return { success: false, error: "Project not found." };
  }

  const current = projects[index];
  const { canEditDrafterHours, canEditEngineerHours } =
    getHoursEditPermissions(user, current);

  if (hours.actualHours !== undefined && !canEditDrafterHours) {
    return {
      success: false,
      error: "Drafters can only update the drafter hours section.",
    };
  }

  if (hours.engineerActualHours !== undefined && !canEditEngineerHours) {
    return {
      success: false,
      error: "Engineers can only update the engineer hours section.",
    };
  }

  if (
    hours.actualHours === undefined &&
    hours.engineerActualHours === undefined
  ) {
    return { success: false, error: "No hour fields were provided." };
  }

  const nextActualHours =
    hours.actualHours !== undefined && canEditDrafterHours
      ? hours.actualHours
      : current.actualHours;
  const nextEngineerActualHours =
    hours.engineerActualHours !== undefined && canEditEngineerHours
      ? hours.engineerActualHours
      : current.engineerActualHours;

  if (
    !Number.isFinite(nextActualHours) ||
    nextActualHours < 0 ||
    !Number.isFinite(nextEngineerActualHours) ||
    nextEngineerActualHours < 0
  ) {
    return {
      success: false,
      error: "Hours must be numbers that are 0 or greater.",
    };
  }

  if (
    nextActualHours === current.actualHours &&
    nextEngineerActualHours === current.engineerActualHours
  ) {
    return { success: true };
  }

  const updated: Project = {
    ...current,
    actualHours: nextActualHours,
    engineerActualHours: nextEngineerActualHours,
  };

  projects[index] = updated;
  writeProjects(projects);

  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/workload");
  revalidatePath("/");

  return { success: true };
}
