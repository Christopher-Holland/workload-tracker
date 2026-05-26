"use client";

import { useEffect, useMemo, useState } from "react";
import projectsData from "@/app/data/projects.json";

type Project = (typeof projectsData)[number];

export default function WorkloadPage() {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        setProjects(projectsData);
    }, []);

    return (
        <div className="min-h-screen bg-[#0b1117] text-white p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <h1 className="text-3xl font-bold tracking-tight">Workload</h1>
            </div>
        </div>
    );
}
