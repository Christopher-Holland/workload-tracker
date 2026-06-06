"use client";

import { useEffect, useMemo, useState } from "react";
import activity from "@/app/data/activity.json";
import drafters from "@/app/data/drafters.json";
import projects from "@/app/data/projects.json";
import { getPriorityColor } from "@/app/components/getPriorityColor";
import { getStatusColor } from "@/app/components/getStatusColor";
import {
  drafterForProject,
  engineerForProject,
} from "@/app/components/projectAssignments";
import { formatDueDate, parseDueDate } from "@/app/lib/dates";

type Project = (typeof projects)[number];
type PageSize = 5 | 10;

const PRIORITY_ORDER: Project["priority"][] = ["High", "Medium", "Low"];

function sortByDueDate(projectsList: Project[]) {
  return [...projectsList].sort(
    (a, b) => parseDueDate(a.dueDate).getTime() - parseDueDate(b.dueDate).getTime()
  );
}

/** High tier first, then Medium, then Low — each tier sorted by due date. */
function buildPriorityQueue(activeProjects: Project[]) {
  return PRIORITY_ORDER.flatMap((priority) =>
    sortByDueDate(activeProjects.filter((p) => p.priority === priority))
  );
}

function buildStats(projectList: Project[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeProjects = projectList.filter((p) => p.status !== "Complete").length;
  const projectsWaitingQa = projectList.filter((p) => p.status === "QA Review").length;
  const overdueTasks = projectList.filter((p) => {
    const due = parseDueDate(p.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }).length;

  const inProgressDrafters = new Set(
    projectList
      .filter((p) => p.status === "In Progress")
      .map((p) => drafterForProject(p))
  );
  const availableDesigners = drafters.filter((d) => !inProgressDrafters.has(d)).length;

  return [
    { title: "Active Projects", value: String(activeProjects) },
    { title: "Projects Waiting QA", value: String(projectsWaitingQa) },
    { title: "Overdue Tasks", value: String(overdueTasks) },
    { title: "Available Designers", value: String(availableDesigners) },
  ];
}

export default function UtilityProjectManagerPrototype() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(5);
  const [search, setSearch] = useState("");

  const stats = buildStats(projects);

  const activeProjects = useMemo(
    () => projects.filter((p) => p.status !== "Complete"),
    []
  );

  const priorityQueue = useMemo(
    () => buildPriorityQueue(activeProjects),
    [activeProjects]
  );

  const filteredPriorityQueue = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return priorityQueue;

    return priorityQueue.filter((project) => {
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
  }, [priorityQueue, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredPriorityQueue.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const displayedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPriorityQueue.slice(start, start + pageSize);
  }, [filteredPriorityQueue, currentPage, pageSize]);

  const rangeStart =
    filteredPriorityQueue.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, filteredPriorityQueue.length);

  function goToPage(nextPage: number) {
    setPage(Math.max(1, Math.min(nextPage, totalPages)));
  }

  function changePageSize(size: PageSize) {
    setPageSize(size);
    setPage(1);
  }

  return (
    <div className="app-page">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="app-stat-card"
            >
              <p className="text-muted text-sm">{stat.title}</p>
              <h2 className="text-3xl font-bold mt-2">{stat.value}</h2>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Project Table */}
          <div className="xl:col-span-2 app-panel">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <div>
                <h2 className="text-2xl font-semibold">Priority Queue</h2>
                <p className="text-sm text-faint mt-1">
                  {filteredPriorityQueue.length === 0
                    ? search.trim()
                      ? "No projects match your search"
                      : "No active projects"
                    : `Showing ${rangeStart}–${rangeEnd} of ${filteredPriorityQueue.length}${
                        search.trim() ? ` (${priorityQueue.length} total in queue)` : ""
                      }`}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by number, name, drafter, status..."
                  className="app-input w-56 sm:w-72"
                />
                <button className="app-btn-primary">
                  Filters
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredPriorityQueue.length === 0 ? (
                <p className="text-faint text-sm py-12 text-center">
                  {search.trim()
                    ? "No projects match your search"
                    : "No active projects"}
                </p>
              ) : (
                displayedProjects.map((project) => (
                <div
                  key={project.id}
                  className="app-surface-card p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-accent-hover/30 transition"
                >
                  <div>
                    <p className="text-2xl font-bold tracking-tight">
                      Project # {project.projectNumber}
                    </p>
                    <p className="text-lg font-semibold">{project.name}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs border ${getPriorityColor(
                          project.priority
                        )}`}
                      >
                        {project.priority} Priority
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-8 text-sm">
                    <div>
                      <p className="text-faint">Assigned</p>
                      <p className="font-medium mt-1">{drafterForProject(project)}</p>
                    </div>
                    <div>
                      <p className="text-faint">Engineer</p>
                      <p className="font-medium mt-1">{engineerForProject(project)}</p>
                    </div>
                    <div>
                      <p className="text-faint">Budget Hours</p>
                      <p className="font-medium mt-1">{project.budgetHours}</p>
                    </div>
                    <div>
                      <p className="text-faint">Actual Hours</p>
                      <p className="font-medium mt-1">{project.actualHours}</p>
                    </div>
                    <div>
                      <p className="text-faint">Due Date</p>
                      <p className="font-medium mt-1">{formatDueDate(project.dueDate)}</p>
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>

            {filteredPriorityQueue.length > pageSize && (
              <div className="flex items-center justify-between mt-6 pt-5 border-t border-border">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="app-btn-secondary"
                >
                  Previous
                </button>

                <p className="text-sm text-muted">
                  Page {currentPage} of {totalPages}
                </p>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="app-btn-secondary"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div className="app-panel">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-semibold">Team Activity</h2>
              <span className="text-xs text-accent-light">LIVE</span>
            </div>

            <div className="space-y-4 text-sm">
              {activity.map((item) => (
                <div
                  key={item.id}
                  className="app-surface-card p-4"
                >
                  <p>{item.message}</p>
                  <p className="text-faint mt-2">{item.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
