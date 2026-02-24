import type { Project, WorkflowState } from "../types";

export const DEFAULT_STATES: WorkflowState[] = [
  "Backlog",
  "In Progress",
  "Testing",
  "Completed",
];

export const mockProjects: Project[] = [
  {
    id: "proj-101",
    name: "Alpha Website Redesign",
    description:
      "Modernizing the legacy website using React and improving performance.",
    users: ["user-1", "user-3", "user-5"],
    workflowStates: DEFAULT_STATES,
  },
  {
    id: "proj-102",
    name: "Mobile App v2",
    description:
      "Adding biometric authentication and performance optimizations.",
    users: ["user-2", "user-4", "user-5"],
    workflowStates: DEFAULT_STATES,
  },
  {
    id: "proj-103",
    name: "Internal Admin Dashboard",
    description:
      "Building an analytics dashboard for internal reporting and monitoring.",
    users: ["user-1", "user-2", "user-4"],
    workflowStates: DEFAULT_STATES,
  },
];
