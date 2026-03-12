import { createContext, useContextSelector } from "use-context-selector";
import type { User } from "../types";

type UserContextType = {
  users: User[];
  register: (user: User) => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  deleteUser: (id: string) => void;
  currentUser: User | null;
};

export const UserContext = createContext<UserContextType | null>(null);

export function useUsers<T>(selector: (ctx: UserContextType) => T): T {
  const selected = useContextSelector(UserContext, (ctx) => {
    if (!ctx) {
      throw new Error("useUsers must be used within AppProvider");
    }
    return selector(ctx);
  });

  return selected;
}
