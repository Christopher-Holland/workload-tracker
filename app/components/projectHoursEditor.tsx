"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getHoursColor } from "@/app/components/getHoursColor";
import { getHoursPct } from "@/app/components/getHoursPct";
import { updateProjectHours } from "@/app/lib/projectActions";

type ProjectHoursEditorProps = {
  projectId: number;
  actualHours: number;
  budgetHours: number;
  engineerActualHours: number;
  engineerBudgetHours: number;
  canEditDrafterHours: boolean;
  canEditEngineerHours: boolean;
};

export default function ProjectHoursEditor({
  projectId,
  actualHours: initialActualHours,
  budgetHours,
  engineerActualHours: initialEngineerActualHours,
  engineerBudgetHours,
  canEditDrafterHours,
  canEditEngineerHours,
}: ProjectHoursEditorProps) {
  const [drafterHours, setDrafterHours] = useState(String(initialActualHours));
  const [engineerHours, setEngineerHours] = useState(
    String(initialEngineerActualHours)
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const parsedDrafter = Number(drafterHours);
  const parsedEngineer = Number(engineerHours);
  const drafterPct = getHoursPct(
    Number.isFinite(parsedDrafter) ? parsedDrafter : 0,
    budgetHours
  );
  const engineerPct = getHoursPct(
    Number.isFinite(parsedEngineer) ? parsedEngineer : 0,
    engineerBudgetHours
  );

  const drafterDirty =
    canEditDrafterHours && parsedDrafter !== initialActualHours;
  const engineerDirty =
    canEditEngineerHours && parsedEngineer !== initialEngineerActualHours;
  const hasChanges = drafterDirty || engineerDirty;

  function handleSave() {
    setError(null);

    if (canEditDrafterHours && (!Number.isFinite(parsedDrafter) || parsedDrafter < 0)) {
      setError("Drafter hours must be a number 0 or greater.");
      return;
    }

    if (
      canEditEngineerHours &&
      (!Number.isFinite(parsedEngineer) || parsedEngineer < 0)
    ) {
      setError("Engineer hours must be a number 0 or greater.");
      return;
    }

    startTransition(async () => {
      const result = await updateProjectHours(projectId, {
        ...(canEditDrafterHours && { actualHours: parsedDrafter }),
        ...(canEditEngineerHours && { engineerActualHours: parsedEngineer }),
      });

      if (!result.success) {
        setError(result.error ?? "Unable to save hours.");
        return;
      }

      router.refresh();
    });
  }

  function handleReset() {
    setDrafterHours(String(initialActualHours));
    setEngineerHours(String(initialEngineerActualHours));
    setError(null);
  }

  return (
    <div className="app-surface-card p-4 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="font-semibold text-foreground">Logged Hours</h3>
          <p className="text-sm text-muted mt-0.5">
            Update hours spent working on this project
          </p>
        </div>
        {(canEditDrafterHours || canEditEngineerHours) && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={isPending || !hasChanges}
              className="app-btn-secondary disabled:opacity-40 disabled:pointer-events-none"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending || !hasChanges}
              className="app-btn-primary disabled:opacity-40 disabled:pointer-events-none"
            >
              {isPending ? "Saving..." : "Save Hours"}
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="drafter-actual-hours"
            className="text-sm text-muted block"
          >
            Drafter Actual Hours
          </label>
          <div className="flex items-center gap-2">
            <input
              id="drafter-actual-hours"
              type="number"
              min={0}
              step={0.5}
              value={drafterHours}
              onChange={(e) => setDrafterHours(e.target.value)}
              disabled={!canEditDrafterHours || isPending}
              className="app-input w-full disabled:opacity-50"
            />
            <span className="text-sm text-faint whitespace-nowrap">
              / {budgetHours}
            </span>
          </div>
          <div className="h-2 rounded-full bg-page overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                drafterPct >= 100
                  ? "bg-red-500"
                  : drafterPct >= 85
                    ? "bg-amber-500"
                    : "bg-accent"
              }`}
              style={{ width: `${Math.min(drafterPct, 100)}%` }}
            />
          </div>
          <p className={`text-xs font-medium ${getHoursColor(drafterPct)}`}>
            {drafterPct}% of budget used
          </p>
          {!canEditDrafterHours && (
            <p className="text-xs text-faint">
              Drafter hours can only be updated by the assigned Drafter
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="engineer-actual-hours"
            className="text-sm text-muted block"
          >
            Engineer Actual Hours
          </label>
          <div className="flex items-center gap-2">
            <input
              id="engineer-actual-hours"
              type="number"
              min={0}
              step={0.5}
              value={engineerHours}
              onChange={(e) => setEngineerHours(e.target.value)}
              disabled={!canEditEngineerHours || isPending}
              className="app-input w-full disabled:opacity-50"
            />
            <span className="text-sm text-faint whitespace-nowrap">
              / {engineerBudgetHours}
            </span>
          </div>
          <div className="h-2 rounded-full bg-page overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                engineerPct >= 100
                  ? "bg-red-500"
                  : engineerPct >= 85
                    ? "bg-amber-500"
                    : "bg-accent"
              }`}
              style={{ width: `${Math.min(engineerPct, 100)}%` }}
            />
          </div>
          <p className={`text-xs font-medium ${getHoursColor(engineerPct)}`}>
            {engineerPct}% of budget used
          </p>
          {!canEditEngineerHours && (
            <p className="text-xs text-faint">
              Engineer hours can only be updated by the assigned Engineer
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
