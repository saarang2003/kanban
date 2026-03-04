import type { Project } from "../../features/projects/types";
import type { Story } from "../../features/stories/types";
import type { User } from "../../features/users/types";

export interface AppState {
  users: User[];
  projects: Project[];
  stories: Story[];
  currentUser: User | null;
}
