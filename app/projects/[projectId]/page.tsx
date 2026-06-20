import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { getHoursColor } from "@/app/components/getHoursColor";
import { getHoursPct } from "@/app/components/getHoursPct";
import { getPriorityColor } from "@/app/components/getPriorityColor";
import { getStatusColor } from "@/app/components/getStatusColor";
import {
  drafterForProject,
  engineerForProject,
  getProjectById,
} from "@/app/components/projectAssignments";
import { formatDueDate } from "@/app/lib/dates";

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

  const hoursPct = getHoursPct(project.actualHours, project.budgetHours);
  const remainingHours = Math.max(project.budgetHours - project.actualHours, 0);

  return (
    <div className="app-page">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Projects
        </Link>

        <div>
          <p className="text-sm text-muted">{project.projectNumber}</p>
          <h1 className="text-3xl font-bold tracking-tight mt-1">
            {project.name}
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs border ${getStatusColor(
              project.status
            )}`}
          >
            {project.status}
          </span>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs border ${getPriorityColor(
              project.priority
            )}`}
          >
            {project.priority}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="app-stat-card">
            <p className="text-muted text-sm">Due Date</p>
            <h2 className="text-2xl font-bold mt-2">
              {formatDueDate(project.dueDate)}
            </h2>
          </div>
          <div className="app-stat-card">
            <p className="text-muted text-sm">Budget Hours</p>
            <h2 className="text-2xl font-bold mt-2">{project.budgetHours}</h2>
          </div>
          <div className="app-stat-card">
            <p className="text-muted text-sm">Actual Hours</p>
            <h2 className="text-2xl font-bold mt-2">{project.actualHours}</h2>
          </div>
          <div className="app-stat-card">
            <p className="text-muted text-sm">Hours Used</p>
            <h2 className={`text-2xl font-bold mt-2 ${getHoursColor(hoursPct)}`}>
              {hoursPct}%
            </h2>
          </div>
        </div>

        <div className="app-panel space-y-5">
          <h2 className="text-2xl font-semibold">Project Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailField label="Drafter">
              {drafterForProject(project)}
            </DetailField>
            <DetailField label="Engineer">
              {engineerForProject(project)}
            </DetailField>
            <DetailField label="Status">{project.status}</DetailField>
            <DetailField label="Priority">{project.priority}</DetailField>
            <DetailField label="Due Date">
              {formatDueDate(project.dueDate)}
            </DetailField>
            <DetailField label="Remaining Hours">{remainingHours}</DetailField>
          </div>

          <div className="app-surface-card p-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted">Hours Progress</span>
              <span className={`font-medium ${getHoursColor(hoursPct)}`}>
                {project.actualHours} / {project.budgetHours} ({hoursPct}%)
              </span>
            </div>
            <div className="h-2 rounded-full bg-page overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  hoursPct >= 100
                    ? "bg-red-500"
                    : hoursPct >= 85
                      ? "bg-amber-500"
                      : "bg-accent"
                }`}
                style={{ width: `${Math.min(hoursPct, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
