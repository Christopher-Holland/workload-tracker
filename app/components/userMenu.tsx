"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/app/lib/currentUser";
import { getInitials } from "@/app/lib/currentUser";

type MenuItem = {
  label: string;
  href?: string;
  onClick?: () => void;
  destructive?: boolean;
};

export default function UserMenu({ user }: { user: User | undefined }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const initials = user ? getInitials(user.name) : "??";

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  function closeAndNavigate(href: string) {
    setOpen(false);
    router.push(href);
  }

  const menuItems: MenuItem[] = [
    { label: "Timeclock", href: "/timeclock" },
    { label: "My Workload", href: "/workload" },
    { label: "Profile", href: "/profile" },
    { label: "Settings", href: "/settings" },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="h-11 w-11 rounded-2xl bg-accent flex items-center justify-center font-semibold shadow-lg shadow-accent-shadow/30 hover:bg-accent-hover transition"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={user ? `Account menu for ${user.name}` : "Account menu"}
      >
        {initials}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-60 rounded-2xl border border-border bg-panel shadow-lg overflow-hidden z-50"
        >
          <div className="px-4 py-3 border-b border-border">
            <p className="font-semibold text-foreground truncate">
              {user?.name ?? "Unknown user"}
            </p>
            {user && (
              <>
                <p className="text-xs text-muted truncate mt-0.5">{user.email}</p>
                <p className="text-xs text-faint capitalize mt-1">{user.title}</p>
              </>
            )}
          </div>

          <div className="py-1">
            {menuItems.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={() => item.href && closeAndNavigate(item.href)}
                className="w-full text-left px-4 py-2.5 text-sm text-subtle hover:bg-hover hover:text-foreground transition"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="border-t border-border py-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="w-full text-left px-4 py-2.5 text-sm text-subtle hover:bg-hover hover:text-foreground transition"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
