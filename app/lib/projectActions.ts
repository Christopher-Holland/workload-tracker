"use server";

import { revalidatePath } from "next/cache";
import type { Project } from "@/app/components/projectAssignments";
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
