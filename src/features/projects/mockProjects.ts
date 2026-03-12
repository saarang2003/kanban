import type { WorkflowState } from "../../shared/types/common";
import type { Project } from "./types";

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
    users: ["user-1", "user-3", "user-5"], // assigned users
    workflowStates: DEFAULT_STATES,
    createdBy: "user-5", // user who created the project
  },
  {
    id: "proj-102",
    name: "Mobile App v2",
    description:
      "Adding biometric authentication and performance optimizations.",
    users: ["user-2", "user-4", "user-5"],
    workflowStates: DEFAULT_STATES,
    createdBy: "user-2",
  },
  {
    id: "proj-103",
    name: "Internal Admin Dashboard",
    description:
      "Building an analytics dashboard for internal reporting and monitoring.",
    users: ["user-1", "user-2", "user-4"],
    workflowStates: DEFAULT_STATES,
    createdBy: "user-1",
  },
  {
    id: "proj-104",
    name: "Payment Gateway Integration",
    description:
      "Integrating Stripe and PayPal for seamless international transactions and recurring billing.",
    users: ["user-2", "user-3"],
    workflowStates: DEFAULT_STATES,
    createdBy: "user-3",
  },
  {
    id: "proj-105",
    name: "Infrastructure Security Audit",
    description:
      "Comprehensive penetration testing and updating cloud security protocols for the production environment.",
    users: ["user-1", "user-4", "user-5"],
    workflowStates: DEFAULT_STATES,
    createdBy: "user-4",
  },
];
