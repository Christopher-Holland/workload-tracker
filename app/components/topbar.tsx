"use client";

import { useRouter } from "next/navigation";

export default function Topbar() {
    const router = useRouter();

    return (
        <div className="sticky top-0 z-50  border border-white/5 bg-[#131b24]/95 backdrop-blur shadow-lg">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 px-6 py-5">
                {/* Left Side */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        UtilityOps
                    </h1>
                    <p className="text-zinc-400 mt-1 text-sm">
                        Coordinator Workflow Dashboard
                    </p>
                </div>

                {/* Navigation */}
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        className="px-4 py-2 rounded-2xl bg-emerald-600 text-white font-medium shadow-lg shadow-emerald-900/30"
                        onClick={() => router.push("/")}
                    >
                        Dashboard
                    </button>

                    <button
                        className="px-4 py-2 rounded-2xl bg-[#0d141c] border border-white/5 hover:bg-zinc-800 transition text-zinc-300"
                        onClick={() => router.push("/projects")}
                    >
                        Projects
                    </button>

                    <button
                        className="px-4 py-2 rounded-2xl bg-[#0d141c] border border-white/5 hover:bg-zinc-800 transition text-zinc-300"
                        onClick={() => router.push("/workload")}
                    >
                        Workload
                    </button>

                    <button className="px-4 py-2 rounded-2xl bg-[#0d141c] border border-white/5 hover:bg-zinc-800 transition text-zinc-300">
                        QA Review
                    </button>

                    <button className="px-4 py-2 rounded-2xl bg-[#0d141c] border border-white/5 hover:bg-zinc-800 transition text-zinc-300">
                        Reports
                    </button>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3 flex-wrap xl:flex-nowrap">
                    <input
                        placeholder="Search projects, numbers, designers..."
                        className="bg-[#0d141c] border border-white/10 rounded-2xl px-4 py-2 text-sm outline-none focus:border-emerald-500 w-full xl:w-72"
                    />

                    <button className="px-4 py-2 rounded-2xl bg-[#0d141c] border border-white/5 hover:bg-zinc-800 transition whitespace-nowrap">
                        Alerts
                    </button>

                    <button className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 transition font-medium whitespace-nowrap">
                        + New Project
                    </button>

                    <div className="h-11 w-11 rounded-2xl bg-emerald-600 flex items-center justify-center font-semibold shadow-lg shadow-emerald-900/30">
                        CH
                    </div>
                </div>
            </div>
        </div>
    );
}