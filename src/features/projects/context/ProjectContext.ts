import { createContext, useContextSelector } from "use-context-selector";
import type { Project } from "../types";

type ProjectContextType = {
  projects: Project[];
  addProject: (
    data: Omit<Project, "id" | "workflowStates" | "createdBy">,
  ) => void;
  removeProject: (id: string) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
};

export const ProjectContext = createContext<ProjectContextType | null>(null);

export function useProjects<T>(selector: (ctx: ProjectContextType) => T): T {
  const selected = useContextSelector(ProjectContext, (ctx) => {
    if (!ctx) {
      throw new Error("useUsers must be used within AppProvider");
    }
    return selector(ctx);
  });
  return selected;
}
