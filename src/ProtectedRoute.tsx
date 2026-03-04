import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useApp } from "./shared/context/useApp";

interface Props {
  children?: ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { currentUser } = useApp();

  // If NOT logged in then goes to login page
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
