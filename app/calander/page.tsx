"use client";

import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { PlusIcon } from "lucide-react";
import AddEventModal, { type CalendarEvent } from "@/app/components/addEventModal";
import projects from "@/app/data/projects.json";
import { calendarThemeVars, applyCalendarDarkTheme } from "@/app/lib/calendarTheme";

type FullCalendarEvent = {
  id: string;
  title: string;
  start: string;
  end?: string;
  extendedProps?: Record<string, string | undefined>;
};

const initialEvents: FullCalendarEvent[] = [
  {
    id: "1",
    title: "Chris PTO",
    start: "2026-06-03",
    end: "2026-06-06",
    extendedProps: {
      type: "pto",
      person: "Chris",
    },
  },
  {
    id: "2",
    title: "WGL Permit Review",
    start: "2026-06-04T10:00:00",
    extendedProps: {
      type: "project",
      status: "In Review",
    },
  },
];

function toFullCalendarEvent(event: CalendarEvent): FullCalendarEvent {
  const start = event.startTime
    ? `${event.date}T${event.startTime}`
    : event.date;
  const end = event.endTime ? `${event.date}T${event.endTime}` : undefined;

  return {
    id: event.id,
    title: event.title,
    start,
    ...(end && { end }),
    extendedProps: {
      projectId: event.projectId,
      notes: event.notes,
    },
  };
}

export default function Calendar() {
  const [events, setEvents] = useState<FullCalendarEvent[]>(initialEvents);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = calendarRef.current;
    if (!container) return;

    applyCalendarDarkTheme(container);

    const observer = new MutationObserver(() => {
      applyCalendarDarkTheme(container);
    });

    observer.observe(container, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      document.getElementById("fc-dark-theme-overrides")?.remove();
    };
  }, []);

  function handleSaveEvent(calendarEvent: CalendarEvent) {
    setEvents((prev) => [...prev, toFullCalendarEvent(calendarEvent)]);
  }

  return (
    <main className="app-page">
      <div className="app-panel">
        <h1 className="mb-4 text-2xl font-bold">Team Calendar</h1>

        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={() => setIsAddEventModalOpen(true)}
            className="app-btn-primary flex items-center gap-2 px-4 py-1"
          >
            <PlusIcon className="w-4 h-4" />
            Add Event
          </button>
        </div>

        <div
          ref={calendarRef}
          className="app-calendar"
          style={calendarThemeVars}
        >
          <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          height="auto"
          selectable
          eventClick={(info) => {
            alert(`Clicked: ${info.event.title}`);
          }}
          dateClick={(info) => {
            alert(`Selected date: ${info.dateStr}`);
          }}
          />
        </div>
      </div>

      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        onSave={handleSaveEvent}
        projects={projects}
      />
    </main>
  );
}
