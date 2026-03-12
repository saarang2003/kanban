import { useCallback, useMemo, type ReactNode } from "react";
import {
  DEFAULT_STATES,
  mockProjects,
} from "../../features/projects/mockProjects";
import { UserContext } from "../../features/users/context/UserContext";
import { ProjectContext } from "../../features/projects/context/ProjectContext";
import { StoryContext } from "../../features/stories/context/StoryContext";
import { type Story } from "../../features/stories/types";
import { type Project } from "../../features/projects/types";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { User } from "../../features/users/types";
import { mockUsers } from "../../features/users/mockUsers";
import { mockStories } from "../../features/stories/mockStories";

interface Props {
  children: ReactNode;
}

interface AppState {
  users: User[];
  projects: Project[];
  stories: Story[];
  currentUser: User | null;
}

const initialState: AppState = {
  users: mockUsers,
  projects: mockProjects,
  stories: mockStories,
  currentUser: null,
};

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [state, setState] = useLocalStorage<AppState>("appState", initialState);

  // user state management
  const register = useCallback(
    (user: User) => {
      setState((prev) => ({
        ...prev,
        users: [...prev.users, user],
        currentUser: user,
      }));
    },
    [setState],
  );

  const login = useCallback(
    (username: string, password: string) => {
      let found = null;

      setState((prev) => {
        found =
          prev.users.find(
            (u) => u.name === username && u.password === password,
          ) || null;

        return { ...prev, currentUser: found };
      });

      return !!found;
    },
    [setState],
  );

  const logout = useCallback(() => {
    setState((prev) => ({ ...prev, currentUser: null }));
  }, [setState]);

  const deleteUser = useCallback(
    (userId: string) => {
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
    },
    [setState],
  );

  // project state management

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
    [state.currentUser, setState],
  );

  const removeProject = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== id),
        stories: prev.stories.filter((s) => s.projectId !== id),
      }));
    },
    [setState],
  );

  const updateProject = useCallback(
    (id: string, updatedValue: Partial<Project>) => {
      setState((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === id ? { ...p, ...updatedValue } : p,
        ),
      }));
    },
    [setState],
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
    [setState],
  );

  const removeStory = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        stories: prev.stories.filter((s) => s.id !== id),
      }));
    },
    [setState],
  );

  const updateStory = useCallback(
    (id: string, updatedData: Partial<Omit<Story, "id">>) => {
      setState((prev) => ({
        ...prev,
        stories: prev.stories.map((story) =>
          story.id === id ? { ...story, ...updatedData } : story,
        ),
      }));
    },
    [setState],
  );

  const userValue = useMemo(
    () => ({
      users: state.users,
      register,
      login,
      logout,
      deleteUser,
      currentUser: state.currentUser,
    }),
    [state.users, register, login, logout, deleteUser, state.currentUser],
  );

  const projectValue = useMemo(
    () => ({
      projects: state.projects,
      addProject,
      removeProject,
      updateProject,
    }),
    [state.projects, addProject, removeProject, updateProject],
  );

  const storyValue = useMemo(
    () => ({
      stories: state.stories,
      addStory,
      removeStory,
      updateStory,
    }),
    [state.stories, addStory, removeStory, updateStory],
  );

  return (
    <UserContext.Provider value={userValue}>
      <ProjectContext.Provider value={projectValue}>
        <StoryContext.Provider value={storyValue}>
          {children}
        </StoryContext.Provider>
      </ProjectContext.Provider>
    </UserContext.Provider>
  );
};
