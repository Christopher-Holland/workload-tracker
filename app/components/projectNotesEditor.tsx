"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProjectNotes } from "@/app/lib/projectActions";

type ProjectNotesEditorProps = {
  projectId: number;
  notes: string;
};

export default function ProjectNotesEditor({
  projectId,
  notes: initialNotes,
}: ProjectNotesEditorProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const hasChanges = notes !== initialNotes;

  function handleSave() {
    if (!hasChanges) return;

    startTransition(async () => {
      const result = await updateProjectNotes(projectId, notes);

      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <div className="app-surface-card p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted">Notes</p>
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending || !hasChanges}
          className="app-btn-primary text-sm px-3 py-1.5 disabled:opacity-40 disabled:pointer-events-none"
        >
          {isPending ? "Saving..." : "Save"}
        </button>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={isPending}
        rows={3}
        placeholder="Add a note..."
        className="app-input w-full resize-none disabled:opacity-50"
        aria-label="Project notes"
      />
    </div>
  );
}
