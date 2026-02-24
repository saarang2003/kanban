import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
  useCallback,
} from "react";
import { mockProjects, DEFAULT_STATES } from "../apiData/mockProjects";
import type { Project, Projects } from "../types";

// Shape of the context
interface ProjectContextType {
  projects: Project[];
  addProject: (projectData: Omit<Project, "id" | "workflowStates">) => void;
  removeProject: (id: string) => void;
  updateProject: (id: string, updatedValue: Partial<Project>) => void;
}

// Create context with proper type
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Provider props
interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  children,
}) => {
  const [projects, setProjects] = useState<Projects>(() => {
    const saved = localStorage.getItem("projects");
    return saved ? JSON.parse(saved) : mockProjects;
  });

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const addProject = useCallback(
    (projectData: Omit<Project, "id" | "workflowStates">) => {
      const newProject: Project = {
        id: crypto.randomUUID(),
        workflowStates: DEFAULT_STATES,
        ...projectData,
      };

      console.log("adding project", newProject);

      setProjects((prev) => [...prev, newProject]);
    },
    [],
  );

  const removeProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
  }, []);

  const updateProject = useCallback(
    (id: string, updatedValue: Partial<Project>) => {
      setProjects((prev) =>
        prev.map((project) =>
          project.id === id ? { ...project, ...updatedValue } : project,
        ),
      );
    },
    [],
  );

  const value = useMemo(
    () => ({ projects, addProject, removeProject, updateProject }),
    [projects, addProject, removeProject, updateProject],
  );

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

// Custom hook for consuming the context
// eslint-disable-next-line react-refresh/only-export-components
export const useProjects = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
};
