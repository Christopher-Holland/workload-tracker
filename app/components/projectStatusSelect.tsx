"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
//import { getStatusColor } from "@/app/components/getStatusColor";
import type { Project } from "@/app/components/projectAssignments";
import {
  PROJECT_STATUSES,
  type ProjectStatus,
  isProjectStatus,
} from "@/app/lib/projectStatuses";
import { updateProjectStatus } from "@/app/lib/projectActions";

type ProjectStatusSelectProps = {
  projectId: number;
  status: ProjectStatus;
  className?: string;
};

export default function ProjectStatusSelect({
  projectId,
  status: initialStatus,
  className = "",
}: ProjectStatusSelectProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextStatus = event.target.value;
    if (!isProjectStatus(nextStatus)) return;

    const previousStatus = status;

    setStatus(nextStatus);

    startTransition(async () => {
      const result = await updateProjectStatus(projectId, nextStatus);

      if (!result.success) {
        setStatus(previousStatus);
        return;
      }

      router.refresh();
    });
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={isPending}
      aria-label="Project status"
      className={`app-input text-sm disabled:opacity-60 w-full  ${className}`}
    >
      {PROJECT_STATUSES.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
