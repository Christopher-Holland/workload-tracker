import type { CSSProperties } from "react";

export const calendarThemeVars: CSSProperties = {
  "--fc-border-color": "rgb(255 255 255 / 0.1)",
  "--fc-page-bg-color": "#131b24",
  "--fc-neutral-bg-color": "#0d141c",
  "--fc-neutral-text-color": "#a1a1aa",
  "--fc-button-text-color": "#ffffff",
  "--fc-button-bg-color": "#0d141c",
  "--fc-button-border-color": "rgb(255 255 255 / 0.1)",
  "--fc-button-hover-bg-color": "#27272a",
  "--fc-button-hover-border-color": "rgb(255 255 255 / 0.1)",
  "--fc-button-active-bg-color": "#059669",
  "--fc-button-active-border-color": "#059669",
  "--fc-button-active-text-color": "#ffffff",
  "--fc-today-bg-color": "rgb(5 150 105 / 0.12)",
  "--fc-event-bg-color": "#059669",
  "--fc-event-border-color": "#064e3b",
  "--fc-event-text-color": "#ffffff",
  "--fc-now-indicator-color": "#34d399",
} as CSSProperties;

export const calendarDarkThemeCss = `
.app-calendar .fc {
  color: #ffffff !important;
}

.app-calendar .fc .fc-scrollgrid-section-sticky > *,
.app-calendar .fc .fc-col-header,
.app-calendar .fc .fc-col-header-cell,
.app-calendar .fc .fc-scrollgrid-section-header td,
.app-calendar .fc .fc-scrollgrid-section-header th {
  background-color: #0d141c !important;
}

.app-calendar .fc .fc-col-header-cell-cushion,
.app-calendar .fc .fc-col-header-cell a,
.app-calendar .fc .fc-col-header-cell-cushion:link,
.app-calendar .fc .fc-col-header-cell-cushion:visited {
  color: #a1a1aa !important;
}

.app-calendar .fc .fc-daygrid-day,
.app-calendar .fc .fc-daygrid-day-frame {
  background-color: #131b24 !important;
}

.app-calendar .fc .fc-daygrid-day-number,
.app-calendar .fc .fc-daygrid-day-top a {
  color: #d4d4d8 !important;
}

.app-calendar .fc .fc-toolbar-title {
  color: #ffffff !important;
}

.app-calendar .fc .fc-scrollgrid,
.app-calendar .fc .fc-scrollgrid td,
.app-calendar .fc .fc-scrollgrid th {
  border-color: rgb(255 255 255 / 0.1) !important;
}

.app-calendar .fc .fc-day-today {
  background-color: rgb(5 150 105 / 0.12) !important;
}

.app-calendar .fc .fc-day-today .fc-daygrid-day-number {
  color: #34d399 !important;
}

.app-calendar .fc .fc-button-primary {
  color: #ffffff !important;
}

.app-calendar .fc .fc-button-primary:not(:disabled).fc-button-active,
.app-calendar .fc .fc-button-primary:not(:disabled):active {
  background-color: #059669 !important;
  border-color: #059669 !important;
}
`;

const STYLE_ID = "fc-dark-theme-overrides";

export function applyCalendarDarkTheme(container?: HTMLElement | null) {
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;

  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }

  style.textContent = calendarDarkThemeCss;

  if (!container) return;

  const headerCells = container.querySelectorAll<HTMLElement>(
    ".fc-col-header-cell, .fc-scrollgrid-section-header td, .fc-scrollgrid-section-header th, .fc-scrollgrid-section-sticky > *"
  );

  headerCells.forEach((cell) => {
    cell.style.setProperty("background-color", "#0d141c", "important");
  });

  container.querySelectorAll<HTMLElement>(".fc-col-header-cell-cushion").forEach((link) => {
    link.style.setProperty("color", "#a1a1aa", "important");
  });
}
