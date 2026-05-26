import projects from "@/app/data/projects.json";

export type ProjectPriority = (typeof projects)[number]["priority"];

export function getPriorityColor(priority: ProjectPriority): string {
  switch (priority) {
    case "High":
      return "bg-red-500/20 text-red-300 border-red-500/30";
    case "Medium":
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    case "Low":
      return "bg-zinc-500/20 text-zinc-300 border-zinc-500/30";
  }
}
