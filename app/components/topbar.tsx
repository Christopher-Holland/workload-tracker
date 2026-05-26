"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser, getInitials } from "@/app/lib/currentUser";

function isActiveRoute(href: string, pathname: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
}

function NavigationButton({
    href,
    children,
}: {
    href: string;
    children: ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const isActive = isActiveRoute(href, pathname);

    return (
        <button
            className={`px-4 py-2 rounded-2xl transition font-medium ${
                isActive
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30"
                    : "bg-[#0d141c] border border-white/5 hover:bg-zinc-800 text-zinc-300"
            }`}
            onClick={() => router.push(href)}
            aria-current={isActive ? "page" : undefined}
        >
            {children}
        </button>
    );
}

export default function Topbar() {
    const user = getCurrentUser();
    const initials = user ? getInitials(user.name) : "??";

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
                    <NavigationButton href="/">Dashboard</NavigationButton>

                    <NavigationButton href="/projects">Projects</NavigationButton>

                    <NavigationButton href="/workload">Workload</NavigationButton>

                    <NavigationButton href="/qa-review">QA Review</NavigationButton>

                    <NavigationButton href="/reports">Reports</NavigationButton>

                    <NavigationButton href="/calander">Calander</NavigationButton>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3 flex-wrap xl:flex-nowrap">
                    <input
                        placeholder="Search projects, numbers, designers..."
                        className="bg-[#0d141c] border border-white/10 rounded-2xl px-4 py-2 text-sm outline-none focus:border-emerald-500 w-full xl:w-72"
                    />

                    <NavigationButton href="/alerts">Alerts</NavigationButton>

                    <NavigationButton href="/new-project">+ New Project</NavigationButton>

                    <div
                        className="h-11 w-11 rounded-2xl bg-emerald-600 flex items-center justify-center font-semibold shadow-lg shadow-emerald-900/30"
                        title={user?.name ?? "Unknown user"}
                        aria-label={
                            user ? `Signed in as ${user.name}` : "Unknown user"
                        }
                    >
                        {initials}
                    </div>
                </div>
            </div>
        </div>
    );
}