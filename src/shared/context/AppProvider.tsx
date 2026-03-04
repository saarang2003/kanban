import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

import { AppContext } from "./AppContext";
import type { AppState } from "./types";
import { mockUsers } from "../../features/users/mockUsers";
import {
  DEFAULT_STATES,
  mockProjects,
} from "../../features/projects/mockProjects";
import { mockStories } from "../../features/stories/mockStories";
import type { User } from "../../features/users/types";
import type { Project } from "../../features/projects/types";
import type { Story } from "../../features/stories/types";

interface Props {
  children: ReactNode;
}

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem("appState");
      return saved
        ? JSON.parse(saved)
        : {
            users: mockUsers,
            projects: mockProjects,
            stories: mockStories,
            currentUser: null,
          };
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
      return;
    }
  });

  useEffect(() => {
    localStorage.setItem("appState", JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const syncTab = (e: StorageEvent) => {
      if (e.key === "appState" && e.newValue) {
        try {
          const newData = JSON.parse(e.newValue);
          setState((prev) => ({ ...prev, ...newData }));
        } catch (error) {
          console.warn("Ignored invalid stories from other tab", error);
        }
      }
    };

    window.addEventListener("storage", syncTab);

    return () => window.removeEventListener("storage", syncTab);
  }, []);

  // user state management
  const register = useCallback((user: User) => {
    setState((prev) => ({
      ...prev,
      users: [...prev.users, user],
      currentUser: user,
    }));
  }, []);

  const login = useCallback((username: string, password: string) => {
    let found = null;

    setState((prev) => {
      found =
        prev.users.find(
          (u) => u.name === username && u.password === password,
        ) || null;

      return { ...prev, currentUser: found };
    });

    return !!found;
  }, []);

  const logout = useCallback(() => {
    setState((prev) => ({ ...prev, currentUser: null }));
  }, []);

  const deleteUser = useCallback((userId: string) => {
    setState((prev) => ({
      // Remove user from users state
      users: prev.users.filter((u) => u.id !== userId),

      // removing all stories aassigne to user
      stories: prev.stories.filter(
        (s) =>
          s.assignedUserId !== userId && // Remove stories assigned TO the user
          !prev.projects // projectowner projcts
            .filter((p) => p.createdBy === userId)
            .map((p) => p.id)
            .includes(s.projectId), // Remove stories belonging to DELETED projects
      ),

      // then remove user from all project
      projects: prev.projects
        .filter((p) => p.createdBy !== userId) // delete owned projects
        .map((project) => ({
          ...project,
          users: project.users.filter((id) => id !== userId), // rmove from shared projects
        })),

      // if current User is deleted go to login page
      currentUser: prev.currentUser?.id === userId ? null : prev.currentUser,
    }));
  }, []);

  // project state managemec

  const addProject = useCallback(
    (projectData: Omit<Project, "id" | "workflowStates" | "createdBy">) => {
      if (!state.currentUser) return;

      const newProject: Project = {
        id: crypto.randomUUID(),
        workflowStates: DEFAULT_STATES,
        createdBy: state.currentUser.id,
        ...projectData,
      };

      setState((prev) => ({
        ...prev,
        projects: [...prev.projects, newProject],
      }));
    },
    [state.currentUser],
  );

  const removeProject = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
      stories: prev.stories.filter((s) => s.projectId !== id),
    }));
  }, []);

  const updateProject = useCallback(
    (id: string, updatedValue: Partial<Project>) => {
      setState((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === id ? { ...p, ...updatedValue } : p,
        ),
      }));
    },
    [],
  );

  // story management

  const addStory = useCallback(
    (storyData: Omit<Story, "id" | "status" | "createdDate">) => {
      const newStory: Story = {
        id: crypto.randomUUID(),
        status: DEFAULT_STATES[0],
        createdDate: new Date().toISOString(),
        ...storyData,
      };

      setState((prev) => ({
        ...prev,
        stories: [...prev.stories, newStory],
      }));
    },
    [],
  );

  const removeStory = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      stories: prev.stories.filter((s) => s.id !== id),
    }));
  }, []);

  const updateStory = useCallback(
    (id: string, updatedData: Partial<Omit<Story, "id">>) => {
      setState((prev) => ({
        ...prev,
        stories: prev.stories.map((story) =>
          story.id === id ? { ...story, ...updatedData } : story,
        ),
      }));
    },
    [],
  );

  const value = useMemo(
    () => ({
      ...state,
      register,
      login,
      logout,
      deleteUser,
      addProject,
      removeProject,
      updateProject,
      addStory,
      removeStory,
      updateStory,
    }),
    [
      addProject,
      addStory,
      deleteUser,
      login,
      logout,
      register,
      removeProject,
      removeStory,
      state,
      updateProject,
      updateStory,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
