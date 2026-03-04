import { createContext } from "react";
import type { Project } from "../../features/projects/types";
import type { Story } from "../../features/stories/types";
import type { User } from "../../features/users/types";
import type { AppState } from "./types";

export interface AppContextType extends AppState {
  // user actions
  register: (user: User) => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  deleteUser: (userId: string) => void;

  // project actions
  addProject: (
    data: Omit<Project, "id" | "workflowStates" | "createdBy">,
  ) => void;
  removeProject: (id: string) => void;
  updateProject: (id: string, data: Partial<Project>) => void;

  // story actions
  addStory: (data: Omit<Story, "id" | "status" | "createdDate">) => void;
  removeStory: (id: string) => void;
  updateStory: (id: string, data: Partial<Story>) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
