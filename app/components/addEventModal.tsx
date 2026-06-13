"use client";

import { useEffect, useState, type ComponentProps } from "react";
import { Calendar, Clock } from "lucide-react";
import projects from "@/app/data/projects.json";
import { X } from "lucide-react";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  projectId?: string;
  notes?: string;
}

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  projects: typeof projects;
}

const emptyForm = {
  title: "",
  date: "",
  startTime: "",
  endTime: "",
  projectId: "",
  notes: "",
};

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

export default function AddEventModal({
  isOpen,
  onClose,
  onSave,
  projects: projectList,
}: AddEventModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [projectId, setProjectId] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setTitle(emptyForm.title);
      setDate(emptyForm.date);
      setStartTime(emptyForm.startTime);
      setEndTime(emptyForm.endTime);
      setProjectId(emptyForm.projectId);
      setNotes(emptyForm.notes);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!title.trim() || !date) return;

    onSave({
      id: crypto.randomUUID(),
      title: title.trim(),
      date,
      startTime,
      endTime,
      projectId: projectId || undefined,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-event-title"
        className="app-panel w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
            <h2 id="add-event-title" className="text-xl font-semibold">
                Add Event
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

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="app-btn-secondary">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!title.trim() || !date}
            className="app-btn-primary disabled:opacity-40 disabled:pointer-events-none"
          >
            Save Event
          </button>
        </div>
      </div>
    </div>
  );
}
