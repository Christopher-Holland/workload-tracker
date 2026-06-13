"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import UserMenu from "@/app/components/userMenu";
import { getCurrentUser } from "@/app/lib/currentUser";

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
                    ? "bg-accent text-foreground shadow-lg shadow-accent-shadow/30"
                    : "bg-surface border border-border hover:bg-hover text-subtle"
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

    return (
        <div className="sticky top-0 z-50 border border-border bg-panel/95 backdrop-blur shadow-lg">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 px-6 py-5">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        UtilityOps
                    </h1>
                    <p className="text-muted mt-1 text-sm">
                        {user?.role} Workflow Dashboard
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <NavigationButton href="/">Dashboard</NavigationButton>
                    <NavigationButton href="/projects">Projects</NavigationButton>
                    <NavigationButton href="/workload">Workload</NavigationButton>
                    <NavigationButton href="/qa-review">QA Review</NavigationButton>
                    <NavigationButton href="/reports">Reports</NavigationButton>
                    <NavigationButton href="/calander">Calander</NavigationButton>
                </div>

                <div className="flex items-center gap-3 flex-wrap xl:flex-nowrap">
                    <input
                        placeholder="Search projects, numbers, designers..."
                        className="app-input rounded-2xl w-full xl:w-72"
                    />

                    <NavigationButton href="/alerts">Alerts</NavigationButton>
                    <NavigationButton href="/new-project">+ New Project</NavigationButton>

                    <UserMenu user={user} />
                </div>
            </div>
        </div>
    );
}
