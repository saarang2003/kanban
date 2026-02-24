import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { type User, type Users } from "../types"; // adjust path as needed
import { mockUsers } from "../apiData/mockUsers";

// Define the context value type
interface UserContextType {
  users: Users;
  addUser: (user: User) => void;
  removeUser: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Props type for provider
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [users, setUsers] = useState<Users>(() => {
    const saved = localStorage.getItem("users");
    return saved ? JSON.parse(saved) : mockUsers;
  });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const addUser = useCallback((user: User) => {
    setUsers((prev) => [...prev, user]);
  }, []);

  const removeUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      users,
      addUser,
      removeUser,
    }),
    [users, addUser, removeUser],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return context;
};
