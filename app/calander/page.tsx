// app/calendar/page.tsx
"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { PlusIcon } from "lucide-react";

const events = [
    {
        title: "Chris PTO",
        start: "2026-06-03",
        end: "2026-06-06",
        extendedProps: {
            type: "pto",
            person: "Chris",
        },
    },
    {
        title: "WGL Permit Review",
        start: "2026-06-04T10:00:00",
        extendedProps: {
            type: "project",
            status: "In Review",
        },
    },
];

export default function Calendar() {
    return (
        <main className="p-6 min-h-screen bg-[#131b24] text-white">
            <div className="rounded-2xl border bg-[#131b24] p-4 shadow-sm">
                <h1 className="mb-4 text-2xl font-bold">Team Calendar</h1>

                <div className="flex justify-end mb-4">
                    <button className="bg-emerald-600 text-white px-4 py-1 rounded-2xl flex items-center gap-2 hover:bg-emerald-700 transition-colors">
                        <PlusIcon className="w-4 h-4" />
                        Add Event
                    </button>
                </div>

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
        </main>
    );
}