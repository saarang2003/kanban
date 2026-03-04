import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import type { Project } from "../features/projects/types";
import ProjectCard from "../features/projects/components/ProjectCard";
import { useApp } from "../shared/context/useApp";

const DashboardPage: React.FC = () => {
  const { projects, removeProject, currentUser } = useApp();

  //filter project based on roles
  const visibleProjects = useMemo(() => {
    if (!currentUser) return [];

    if (currentUser.role === "Admin") return projects;

    return projects.filter(
      (project) =>
        project.users.includes(currentUser.id) || // assigned to user
        project.createdBy === currentUser.id, // projects they created
    );
  }, [currentUser, projects]);

  return (
    <Box sx={{ padding: "1rem" }}>
      <Typography variant="h5" fontWeight={"bold"} sx={{ mt: "1rem" }}>
        Project List
      </Typography>
      {/* Render your project cards */}
      {visibleProjects.map((project: Project) => (
        <ProjectCard
          key={project.id}
          id={project.id}
          name={project.name}
          removeProject={removeProject}
          description={project.description}
          users={project.users}
        />
      ))}
    </Box>
  );
};

export default DashboardPage;
