import fs from "fs";
import path from "path";
import projectsData from "@/app/data/projects.json";
import type { Project } from "@/app/components/projectAssignments";

const projectsPath = path.join(process.cwd(), "app/data/projects.json");

export function readProjects(): Project[] {
  try {
    return JSON.parse(fs.readFileSync(projectsPath, "utf8")) as Project[];
  } catch {
    return projectsData as Project[];
  }
}

export function writeProjects(projects: Project[]): void {
  fs.writeFileSync(projectsPath, `${JSON.stringify(projects, null, 2)}\n`);
}

export function getProjectById(projectId: number): Project | undefined {
  return readProjects().find((project) => project.id === projectId);
}
