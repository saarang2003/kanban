import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import Header from "./shared/components/Header";
import Sidebar from "./shared/components/Sidebar";
import StoryModalContainer from "./features/stories/components/StoryModalContainer";
import ProtectedRoute from "./ProtectedRoute";
import "./App.css";
import { ErrorBoundary } from "./shared/components/ErrorBoundary";
import { FallBackUI } from "./shared/components/FallbackUI";
import { lazy, Suspense } from "react";
import { ProjectPageSkeleton } from "./page/ProjectPage";
import { ProjectInfoSkeleton } from "./features/projects/components/ProjectInfo";
const DashboardPage = lazy(() => import("./page/DashboardPage"));
const ProjectPage = lazy(() => import("./page/ProjectPage"));
const ProjectInfo = lazy(
  () => import("./features/projects/components/ProjectInfo"),
);
const UserDashboardPage = lazy(() => import("./page/UserDashboardPage"));
const RegisterPage = lazy(() => import("./page/RegisterPage"));
const LoginPage = lazy(() => import("./page/LoginPage"));

// Layout component for your authenticated view
const MainLayout = () => (
  <>
    <Box sx={{ mb: "3rem" }}>
      <Header />
    </Box>
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, padding: "1.5rem" }}>
        {/* This is where the child routes will render */}
        <ErrorBoundary
          fallback={(error: Error) => <FallBackUI error={error} />}
        >
          <Suspense
            fallback={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "10rem",
                }}
              >
                <CircularProgress />
              </Box>
            }
          >
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </Box>
    </Box>
  </>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes with Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/userDashboard/:id" element={<UserDashboardPage />} />

            {/* Project Info  */}
            <Route
              path="/project/:id/info"
              element={
                <Suspense fallback={<ProjectInfoSkeleton />}>
                  <ProjectInfo />
                </Suspense>
              }
            />

            <Route
              path="/project/:id"
              element={
                <Suspense fallback={<ProjectPageSkeleton />}>
                  <ProjectPage />
                </Suspense>
              }
            >
              <Route path="story/:storyId" element={<StoryModalContainer />} />
            </Route>
          </Route>
        </Route>

        <Route
          path="*"
          element={
            <ErrorBoundary fallback={(error) => <FallBackUI error={error} />}>
              <Box sx={{ p: 3 }}>
                {/* Fake Error for 404 */}
                <FallBackUI error={new Error("404 - Page Not Found")} />
              </Box>
            </ErrorBoundary>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
