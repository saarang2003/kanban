import type { Priority, WorkflowState } from "../../shared/types/common";

// Reuse WorkflowState from projects for status
export type StoryStatus = WorkflowState;

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

export const COLUMNS: StoryStatus[] = [
  "Backlog",
  "In Progress",
  "Testing",
  "Completed",
];

export const STATUS_COLORS: Record<string, string> = {
  Backlog: "#ffcece", // light gray
  "In Progress": "#ffeaa7", // light yellow
  Testing: "#74b9ff", // light blue
  Completed: "#55efc4", // light green
};
