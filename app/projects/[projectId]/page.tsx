import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { getHoursColor } from "@/app/components/getHoursColor";
import { getHoursPct } from "@/app/components/getHoursPct";
import { getPriorityColor } from "@/app/components/getPriorityColor";
import {
  drafterForProject,
  engineerForProject,
  getHoursEditPermissions,
} from "@/app/components/projectAssignments";
import ProjectHoursEditor from "@/app/components/projectHoursEditor";
import ProjectNotesEditor from "@/app/components/projectNotesEditor";
import ProjectStatusSelect from "@/app/components/projectStatusSelect";
import { getStatusColor } from "@/app/components/getStatusColor";
import { getCurrentUser } from "@/app/lib/currentUser";
import { formatDueDate, formatTimestamp } from "@/app/lib/dates";
import { getProjectById } from "@/app/lib/projects";
import type { ProjectStatus } from "@/app/lib/projectStatuses";

function DetailField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="app-surface-card p-4">
      <p className="text-sm text-muted mb-1">{label}</p>
      <div className="font-medium text-foreground">{children}</div>
    </div>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const id = Number(projectId);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  const user = getCurrentUser();
  const { canEditDrafterHours, canEditEngineerHours } =
    getHoursEditPermissions(user, project);

  const hoursPct = getHoursPct(project.actualHours, project.budgetHours);
  const remainingHours = Math.max(project.budgetHours - project.actualHours, 0);
  const remainingEngineerHours = Math.max(
    project.engineerBudgetHours - project.engineerActualHours,
    0
  );
  const statusHistory = [...(project.statusHistory ?? [])].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="app-page">
      <div className="max-w-7xl mx-auto space-y-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Projects
        </Link>

        <div>
          <p className="text-sm text-muted">{project.name}</p>
          <h1 className="text-3xl font-bold tracking-tight mt-1">
            {project.projectNumber}
          </h1>
        </div>

        

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="app-stat-card">
            <p className="text-muted text-sm">Due Date</p>
            <h2 className="text-2xl font-bold mt-2">
              {formatDueDate(project.dueDate)}
            </h2>
          </div>
          <div className="app-stat-card">
            <p className="text-muted text-sm">Drafter Hours</p>
            <h2 className="text-2xl font-bold mt-2">
              {project.actualHours} / {project.budgetHours}
            </h2>
          </div>
          <div className="app-stat-card">
            <p className="text-muted text-sm">Engineer Hours</p>
            <h2 className="text-2xl font-bold mt-2">
              {project.engineerActualHours} / {project.engineerBudgetHours}
            </h2>
          </div>
          <div className="app-stat-card">
            <p className="text-muted text-sm">Drafter Hours Used</p>
            <h2 className={`text-2xl font-bold mt-2 ${getHoursColor(hoursPct)}`}>
              {hoursPct}%
            </h2>
          </div>
        </div>

        <div className="app-panel space-y-5">
          <h2 className="text-2xl font-semibold">Project Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DetailField label="Drafter">
              {drafterForProject(project)}
            </DetailField>
            <DetailField label="Engineer">
              {engineerForProject(project)}
            </DetailField>
            <DetailField label="Due Date">
              {formatDueDate(project.dueDate)}
            </DetailField>
            <DetailField label="Priority">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs border ${getPriorityColor(
                  project.priority
                )}`}
              >
                {project.priority}
              </span>
            </DetailField>
            <DetailField label="Status">
              <ProjectStatusSelect
                key={project.statusUpdatedAt}
                projectId={project.id}
                status={project.status as ProjectStatus}
                className="w-full sm:w-auto min-w-[12rem]"
              />
            </DetailField>
            <DetailField label="Status Updated">
              {project.statusUpdatedAt
                ? formatTimestamp(project.statusUpdatedAt)
                : "—"}
            </DetailField>
            <DetailField label="Drafter Remaining Hours">
              {remainingHours}
            </DetailField>
            <DetailField label="Engineer Remaining Hours">
              {remainingEngineerHours}
            </DetailField>
          </div>

          {statusHistory.length > 0 && (
            <div className="app-surface-card p-4">
              <p className="text-sm text-muted mb-3">Status History</p>
              <ul className="space-y-2">
                {statusHistory.map((entry, index) => (
                  <li
                    key={`${entry.status}-${entry.updatedAt}-${index}`}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-sm border-b border-border pb-2 last:border-0 last:pb-0"
                  >
                    <span
                      className={`inline-block w-fit px-3 py-1 rounded-full text-xs border ${getStatusColor(
                        entry.status
                      )}`}
                    >
                      {entry.status}
                    </span>
                    <span className="text-muted">
                      {formatTimestamp(entry.updatedAt)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <ProjectNotesEditor
            key={project.notes ?? ""}
            projectId={project.id}
            notes={project.notes ?? ""}
          />

          <ProjectHoursEditor
            key={`${project.actualHours}-${project.engineerActualHours}`}
            projectId={project.id}
            actualHours={project.actualHours}
            budgetHours={project.budgetHours}
            engineerActualHours={project.engineerActualHours}
            engineerBudgetHours={project.engineerBudgetHours}
            canEditDrafterHours={canEditDrafterHours}
            canEditEngineerHours={canEditEngineerHours}
          />
        </div>
      </div>
    </div>
  );
}
