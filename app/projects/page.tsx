"use client";

import { useMemo, useState } from "react";
import drafters from "@/app/data/drafters.json";
import engineers from "@/app/data/engineers.json";
import projects from "@/app/data/projects.json";
import { formatDueDate } from "@/app/lib/dates";

type Project = (typeof projects)[number];

function drafterForProject(projectId: number) {
    return drafters[(projectId - 1) % drafters.length];
}

function engineerForProject(projectId: number) {
    return engineers[(projectId - 1) % engineers.length];
}

function getStatusColor(status: string) {
    switch (status) {
        case "In Progress":
            return "bg-blue-500/20 text-blue-300 border-blue-500/30";
        case "QA Review":
            return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
        case "Pending Field Data":
            return "bg-red-500/20 text-red-300 border-red-500/30";
        case "Complete":
            return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
        case "Drafting":
            return "bg-violet-500/20 text-violet-300 border-violet-500/30";
        case "Pending Approval":
            return "bg-amber-500/20 text-amber-300 border-amber-500/30";
        default:
            return "bg-zinc-500/20 text-zinc-300 border-zinc-500/30";
    }
}

function getPriorityColor(priority: Project["priority"]) {
    switch (priority) {
        case "High":
            return "bg-red-500/20 text-red-300 border-red-500/30";
        case "Medium":
            return "bg-amber-500/20 text-amber-300 border-amber-500/30";
        case "Low":
            return "bg-zinc-500/20 text-zinc-300 border-zinc-500/30";
    }
}

function getHoursPct(actualHours: number, budgetHours: number) {
    return Math.round((actualHours / budgetHours) * 100);
}

function getHoursColor(hoursPct: number) {
    if (hoursPct >= 100) return "text-red-400";
    if (hoursPct >= 80) return "text-yellow-400";
    if (hoursPct >= 60) return "text-amber-400";
    if (hoursPct === 0) return "text-blue-400";
    return "text-green-400";
}

export default function ProjectsPage() {
    const [search, setSearch] = useState("");

    const stats = useMemo(() => {
        const active = projects.filter((p) => p.status !== "Complete").length;
        const complete = projects.filter((p) => p.status === "Complete").length;
        const highPriority = projects.filter((p) => p.priority === "High").length;
        return [
            { title: "Total Projects", value: String(projects.length) },
            { title: "Active", value: String(active) },
            { title: "Complete", value: String(complete) },
            { title: "High Priority", value: String(highPriority) },
        ];
    }, []);

    const filteredProjects = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return projects;

        return projects.filter((project) => {
            const drafter = drafterForProject(project.id).toLowerCase();
            const engineer = engineerForProject(project.id).toLowerCase();
            return (
                project.projectNumber.toLowerCase().includes(query) ||
                project.name.toLowerCase().includes(query) ||
                project.status.toLowerCase().includes(query) ||
                project.priority.toLowerCase().includes(query) ||
                drafter.includes(query) ||
                engineer.includes(query)
            );
        });
    }, [search]);

    return (
        <div className="min-h-screen bg-[#0b1117] text-white p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.title}
                            className="bg-[#131b24] border border-white/5 rounded-3xl p-5 shadow-lg"
                        >
                            <p className="text-zinc-400 text-sm">{stat.title}</p>
                            <h2 className="text-3xl font-bold mt-2">{stat.value}</h2>
                        </div>
                    ))}
                </div>

                <div className="bg-[#131b24] border border-white/5 rounded-3xl p-6 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                        <div>
                            <h2 className="text-2xl font-semibold">All Projects</h2>
                            <p className="text-sm text-zinc-500 mt-1">
                                Showing {filteredProjects.length} of {projects.length}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by number, name, drafter, status..."
                                className="bg-[#0b1117] border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-emerald-500 w-full sm:w-72"
                            />
                            <button className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 transition font-medium whitespace-nowrap">
                                Filters
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-white/5">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="bg-[#0d141c] text-zinc-400 border-b border-white/5">
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
                                {filteredProjects.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-12 text-center text-zinc-500">
                                            No projects match your search
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
                                                className="border-t border-white/5 hover:bg-[#0d141c]/60 transition"
                                            >
                                                <td className="px-4 py-4 font-semibold text-white whitespace-nowrap">
                                                    {project.projectNumber}
                                                </td>
                                                <td className="px-4 py-4 font-medium max-w-xs">
                                                    {project.name}
                                                </td>
                                                <td className="px-4 py-4 text-zinc-300 whitespace-nowrap">
                                                    {drafterForProject(project.id)}
                                                </td>
                                                <td className="px-4 py-4 text-zinc-300 whitespace-nowrap">
                                                    {engineerForProject(project.id)}
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
                                                <td className="px-4 py-4 text-zinc-300 whitespace-nowrap">
                                                    {formatDueDate(project.dueDate)}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <span className="text-zinc-300">
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
