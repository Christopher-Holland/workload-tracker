"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import projects from "@/app/data/projects.json";
import { getHoursColor } from "@/app/components/getHoursColor";
import { getHoursPct } from "@/app/components/getHoursPct";
import { getPriorityColor } from "@/app/components/getPriorityColor";
import { getStatusColor } from "@/app/components/getStatusColor";
import {
  drafterForProject,
  engineerForProject,
  isProjectAssignedToUser,
} from "@/app/components/projectAssignments";
import { getCurrentUser } from "@/app/lib/currentUser";
import { formatDueDate } from "@/app/lib/dates";

export default function ProjectsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const user = getCurrentUser();

  const assignedProjects = useMemo(() => {
    if (!user) return [];

    const isManager =
      user.role === "Administrator" || user.role === "Design Coordinator";

    if (isManager) return projects;

    return projects.filter((project) => isProjectAssignedToUser(project, user));
  }, [user]);

  const stats = useMemo(() => {
    const active = assignedProjects.filter((p) => p.status !== "Complete").length;
    const complete = assignedProjects.filter((p) => p.status === "Complete").length;
    const highPriority = assignedProjects.filter((p) => p.priority === "High").length;
    return [
      { title: "My Projects", value: String(assignedProjects.length) },
      { title: "Active", value: String(active) },
      { title: "Complete", value: String(complete) },
      { title: "High Priority", value: String(highPriority) },
    ];
  }, [assignedProjects]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return assignedProjects;

    return assignedProjects.filter((project) => {
      const drafter = drafterForProject(project).toLowerCase();
      const engineer = engineerForProject(project).toLowerCase();
      return (
        project.projectNumber.toLowerCase().includes(query) ||
        project.name.toLowerCase().includes(query) ||
        project.status.toLowerCase().includes(query) ||
        project.priority.toLowerCase().includes(query) ||
        drafter.includes(query) ||
        engineer.includes(query)
      );
    });
  }, [assignedProjects, search]);

  const isManager =
    user?.role === "Administrator" || user?.role === "Design Coordinator";

  return (
    <div className="app-page">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.title} className="app-stat-card">
              <p className="text-muted text-sm">{stat.title}</p>
              <h2 className="text-3xl font-bold mt-2">{stat.value}</h2>
            </div>
          ))}
        </div>

        <div className="app-panel">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div>
              <h2 className="text-2xl font-semibold">
                {isManager ? "All Projects" : "My Projects"}
              </h2>
              <p className="text-sm text-faint mt-1">
                Showing {filteredProjects.length} of {assignedProjects.length}
                {user ? ` for ${user.name}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by number, name, drafter, status..."
                className="app-input w-full sm:w-72"
              />
              <button className="app-btn-primary whitespace-nowrap">
                Filters
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-surface text-muted border-b border-border">
                  <th className="px-4 py-3 font-medium">Project #</th>
                  <th className="px-4 py-3 font-medium">Project Name</th>
                  <th className="px-4 py-3 font-medium">Drafter</th>
                  <th className="px-4 py-3 font-medium">Engineer</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Due Date</th>
                  <th className="px-4 py-3 font-medium">Hours</th>
                </tr>
              </thead>
              <tbody>
                {!user ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-faint">
                      Unable to load user session
                    </td>
                  </tr>
                ) : filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-faint">
                      {search.trim()
                        ? "No assigned projects match your search"
                        : "No projects assigned to you"}
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => {
                    const hoursPct = getHoursPct(
                      project.actualHours,
                      project.budgetHours
                    );

                    return (
                      <tr
                        key={project.id}
                        onClick={() => router.push(`/projects/${project.id}`)}
                        className="border-t border-border hover:bg-surface/60 transition cursor-pointer"
                      >
                        <td className="px-4 py-4 font-semibold text-foreground whitespace-nowrap">
                          {project.projectNumber}
                        </td>
                        <td className="px-4 py-4 font-medium max-w-xs">
                          {project.name}
                        </td>
                        <td className="px-4 py-4 text-subtle whitespace-nowrap">
                          {drafterForProject(project)}
                        </td>
                        <td className="px-4 py-4 text-subtle whitespace-nowrap">
                          {engineerForProject(project)}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs border whitespace-nowrap ${getStatusColor(
                              project.status
                            )}`}
                          >
                            {project.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs border whitespace-nowrap ${getPriorityColor(
                              project.priority
                            )}`}
                          >
                            {project.priority}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-subtle whitespace-nowrap">
                          {formatDueDate(project.dueDate)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-subtle">
                            {project.actualHours} / {project.budgetHours}
                          </span>
                          <span
                            className={`ml-2 text-xs font-medium ${getHoursColor(hoursPct)}`}
                          >
                            ({hoursPct}%)
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
