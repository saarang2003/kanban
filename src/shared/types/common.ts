export const WorkflowState = {
  Backlog: "Backlog",
  InProgress: "In Progress",
  Testing: "Testing",
  Completed: "Completed",
} as const;

export type WorkflowState = (typeof WorkflowState)[keyof typeof WorkflowState];

export const Priority = {
  High: "High",
  Medium: "Medium",
  Low: "Low",
} as const;

export type Priority = (typeof Priority)[keyof typeof Priority];

export const PRIORITY_OPTIONS: Priority[] = [
  Priority.High,
  Priority.Medium,
  Priority.Low,
];
