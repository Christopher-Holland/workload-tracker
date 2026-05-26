import drafters from "@/app/data/drafters.json";
import engineers from "@/app/data/engineers.json";

export function drafterForProject(projectId: number): string {
  return drafters[(projectId - 1) % drafters.length];
}

export function engineerForProject(projectId: number): string {
  return engineers[(projectId - 1) % engineers.length];
}

export function isProjectAssignedToUser(
  projectId: number,
  user: { name: string; role: string }
): boolean {
  const drafter = drafterForProject(projectId);
  const engineer = engineerForProject(projectId);

  if (user.role === "drafter") return drafter === user.name;
  if (user.role === "engineer") return engineer === user.name;

  return drafter === user.name || engineer === user.name;
}
