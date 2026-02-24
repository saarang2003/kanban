import React from "react";
import { Box } from "@mui/material";
import ProjectCard from "../component/ProjectCard";
import { useProjects } from "../context/ProjectContext";
import type { Project } from "../types";

const Dashboard: React.FC = () => {
  const { projects, removeProject } = useProjects();

  console.log("projects in dashboard", projects);
  console.log(
    "project users in dashboard",
    projects.map((p) => p.users),
  );

  return (
    <Box sx={{ p: 2 }}>
      <h2>Project List</h2>
      {/* Render your project cards */}
      {projects.map((project: Project) => (
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

export default Dashboard;
