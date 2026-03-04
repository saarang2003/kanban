import type { WorkflowState } from "../../shared/types/common";

// Project structure
export interface Project {
  id: string;
  name: string;
  description: string;
  users: string[]; // array of user string IDs
  workflowStates: WorkflowState[];
  createdBy: string;
}
