import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUsers } from "./features/users/context/UserContext";

interface Props {
  children?: ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const currentUser = useUsers((state) => state.currentUser);

  // If NOT logged in then goes to login page
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
