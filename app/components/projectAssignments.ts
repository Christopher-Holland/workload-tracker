import drafters from "@/app/data/drafters.json";
import engineers from "@/app/data/engineers.json";

export function drafterForProject(projectId: number): string {
  return drafters[(projectId - 1) % drafters.length];
}

export function engineerForProject(projectId: number): string {
  return engineers[(projectId - 1) % engineers.length];
}
