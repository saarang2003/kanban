export type UserRole =
  | "Frontend Developer"
  | "Backend Developer"
  | "UI/UX Designer"
  | "QA Engineer"
  | "Admin";

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
export const RoleList: UserRole[] = [
  "Frontend Developer",
  "Backend Developer",
  "UI/UX Designer",
  "QA Engineer",
  "Admin",
];
