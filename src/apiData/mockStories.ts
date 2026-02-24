import type { Story } from "../types";

export const mockStories: Story[] = [
  {
    id: "story-001",
    projectId: "proj-101",
    title: "Create Login Component",
    description: "Build a reusable login form with validation.",
    priority: "High",
    storyPoints: 5,
    assignedUserId: "user-1",
    status: "In Progress",
    createdDate: "2024-05-15T10:30:00Z",
  },
  {
    id: "story-002",
    projectId: "proj-101",
    title: "Unit Test Auth Logic",
    description: "Ensure JWT tokens are stored securely.",
    priority: "Medium",
    storyPoints: 3,
    assignedUserId: "user-2",
    status: "Backlog",
    createdDate: "2024-05-16T09:15:00Z",
  },
];
