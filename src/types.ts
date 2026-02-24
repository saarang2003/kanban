export type WorkflowState = "Backlog" | "In Progress" | "Testing" | "Completed";

// Project structure
export interface Project {
  id: string;
  name: string;
  description: string;
  users: string[]; // array of user string IDs
  workflowStates: WorkflowState[];
}

export type Projects = Project[];

// Story priorities
export type Priority = "High" | "Medium" | "Low";

// Reuse WorkflowState from projects for status
export type StoryStatus = "Backlog" | "In Progress" | "Testing" | "Completed";

// Story interface
export interface Story {
  id: string;
  projectId: string;
  title: string;
  description: string;
  priority: Priority;
  storyPoints: number;
  assignedUserId: string;
  status: StoryStatus;
  createdDate: string; // ISO string
}

// Array of stories
export type Stories = Story[];

export type UserRole =
  | "Frontend Developer"
  | "Backend Developer"
  | "UI/UX Designer"
  | "QA Engineer"
  | "Project Manager";

// User interface
export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatarColor: string; // hex color code
}

// Array of users
export type Users = User[];
