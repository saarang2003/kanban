export const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "UI/UX Designer",
  "QA Engineer",
  "Admin",
] as const;

export type UserRole = (typeof ROLES)[number];

// User interface
export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatarColor: string; // hex color code
  password: string;
}

// Array of users
export type Users = User[];

// Export a usable role list
export const RoleList = ROLES;
