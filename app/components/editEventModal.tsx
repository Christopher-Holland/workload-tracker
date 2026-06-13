"use client";

import { useEffect, useState, type ComponentProps } from "react";
import { Calendar, Clock } from "lucide-react";
import type { CalendarEvent } from "@/app/components/addEventModal";
import projects from "@/app/data/projects.json";
import { Trash2, X } from "lucide-react";

interface EditEventModalProps {
  isOpen: boolean;
  event: CalendarEvent | null;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
  projects: typeof projects;
}

function DateTimeField({
  type,
  className = "",
  ...props
}: ComponentProps<"input"> & { type: "date" | "time" }) {
  const Icon = type === "date" ? Calendar : Clock;

  return (
    <div className={`relative ${className}`}>
      <input
        type={type}
        className="app-input app-datetime-input w-full"
        {...props}
      />
      <Icon
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        aria-hidden
      />
    </div>
  );
}

export default function EditEventModal({
  isOpen,
  event,
  onClose,
  onSave,
  onDelete,
}: EditEventModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [projectId, setProjectId] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!isOpen || !event) return;

    setTitle(event.title);
    setDate(event.date);
    setStartTime(event.startTime);
    setEndTime(event.endTime);
    setProjectId(event.projectId ?? "");
    setNotes(event.notes ?? "");
  }, [isOpen, event]);

  const handleSave = () => {
    if (!event || !title.trim() || !date) return;

    onSave({
      ...event,
      title: title.trim(),
      date,
      startTime,
      endTime,
      projectId: projectId || undefined,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  if (!isOpen || !event) return null;

  const handleDelete = () => {
    if (!event) return;
    onDelete(event.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-event-title"
        className="app-panel w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
            <h2 id="edit-event-title" className="text-xl font-semibold">
                Edit Event
            </h2>
            <button type="button" onClick={onClose} className="app-btn-secondary"><X className="w-4 h-4" /></button>
        </div>
        <input
          className="app-input w-full mb-3"
          placeholder="Event Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <DateTimeField
          type="date"
          className="mb-3"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-2 mb-3">
          <DateTimeField
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            aria-label="Start time"
          />
          <DateTimeField
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            aria-label="End time"
          />
        </div>

        <textarea
          className="app-input w-full mb-4 resize-none"
          rows={4}
          placeholder="Notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleDelete}
            className="app-btn-secondary bg-red-500 text-white hover:bg-red-600"
            aria-label="Delete event"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="app-btn-secondary">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!title.trim() || !date}
              className="app-btn-primary disabled:opacity-40 disabled:pointer-events-none"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
