import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import type React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { useProjects } from "../context/ProjectContext";
import { useStories } from "../../stories/context/StoryContext";
import { useUsers } from "../../users/context/UserContext";

export const ProjectInfoSkeleton: React.FC = () => (
  <Container
    maxWidth="lg"
    sx={{ mt: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}
  >
    {/* Project Header Skeleton */}
    <Paper sx={{ p: "2rem", borderRadius: "1rem" }}>
      <Skeleton variant="text" width="40%" height={40} sx={{ mb: "1.5rem" }} />
      <Skeleton
        variant="rectangular"
        width={120}
        height={32}
        sx={{ mb: "2rem", borderRadius: 1 }}
      />

      <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="80%" height={24} sx={{ mb: 2 }} />

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
        {[...Array(4)].map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            width={80}
            height={32}
            sx={{ borderRadius: 1 }}
          />
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          bgcolor: "grey.100",
          p: 2,
          borderRadius: 1,
        }}
      >
        <Skeleton variant="text" width={60} />
        <Skeleton variant="text" width={60} />
        <Skeleton variant="text" width={100} />
      </Box>

      <Skeleton
        variant="rectangular"
        width={140}
        height={36}
        sx={{ mt: 3, borderRadius: 1 }}
      />
    </Paper>

    {/* Project Members Skeleton */}
    <Paper sx={{ p: "2rem", borderRadius: "1rem" }}>
      <Skeleton variant="text" width="30%" height={32} sx={{ mb: "1.5rem" }} />

      <Grid container spacing={3}>
        {[...Array(4)].map((_, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 2 }} key={i}>
            <Paper
              sx={{
                p: "1.5rem",
                borderRadius: "1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Skeleton variant="circular" width={64} height={64} />
              <Skeleton variant="text" width={100} height={24} />
              <Skeleton
                variant="rectangular"
                width={80}
                height={32}
                sx={{ borderRadius: 1 }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  </Container>
);

const ProjectInfo: React.FC = () => {
  const projects = useProjects((state) => state.projects);
  const stories = useStories((state) => state.stories);
  const users = useUsers((state) => state.users);
  const currentUser = useUsers((state) => state.currentUser);
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  //current project data
  const projectData = useMemo(() => {
    return projects.find((p) => p.id === projectId);
  }, [projects, projectId]);

  //get project users

  const projectUsers = useMemo(() => {
    if (!projectData) return [];
    return users.filter((u) => projectData.users.includes(u.id));
  }, [users, projectData]);

  //get project owner info
  const projectOwner = useMemo(() => {
    if (!projectData) return undefined;
    return users.find((u) => u.id === projectData.createdBy);
  }, [users, projectData]);

  // stories of that project
  const projectStories = useMemo(() => {
    return stories.filter((s) => s.projectId === projectId);
  }, [stories, projectId]);

  return (
    <Container
      maxWidth={false}
      sx={{
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        mt: "2rem",
      }}
    >
      <Paper sx={{ p: "2rem", borderRadius: "1rem" }}>
        {/* Header */}
        <Box sx={{ mb: "1.5rem" }}>
          <Typography variant="h5" fontWeight={600}>
            {projectData?.name}
          </Typography>

          <Chip
            label={`Created by ${projectOwner?.name}`}
            sx={{ mt: "0.75rem" }}
            color="primary"
          />
        </Box>

        {/* Description */}
        <Typography variant="body1" sx={{ mb: "1rem" }}>
          {projectData?.description}
        </Typography>

        {/* Project ID */}
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ mb: "1rem" }}
        >
          Project ID: {projectData?.id}
        </Typography>

        {/* Workflow States */}
        <Box
          sx={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            mb: "1.5rem",
          }}
        >
          {projectData?.workflowStates.map((state) => (
            <Chip key={state} label={state} variant="outlined" />
          ))}
        </Box>

        {/* Stats Row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            p: "1.25rem",
            bgcolor: "grey.100",
            borderRadius: "0.75rem",
          }}
        >
          <Typography>
            Stories: <strong>{projectStories.length}</strong>
          </Typography>

          <Typography>
            Members: <strong>{projectUsers.length}</strong>
          </Typography>

          <Typography>
            Your Role: <strong>{currentUser?.role}</strong>
          </Typography>
        </Box>

        <Button
          onClick={() => navigate(`/project/${projectId}`)}
          variant="contained"
          sx={{ mt: "1rem " }}
        >
          View Stories
        </Button>
      </Paper>

      <Paper sx={{ p: "2rem", borderRadius: "1rem" }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: "1.5rem" }}>
          Project Members
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(14rem, 1fr))",
            gap: "1.5rem",
          }}
        >
          {projectUsers.map((user) => (
            <Paper
              key={user.id}
              elevation={2}
              sx={{
                p: "1.5rem",
                borderRadius: "1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <Avatar
                sx={{
                  width: "4rem",
                  height: "4rem",
                  bgcolor: user.avatarColor,
                  fontSize: "1.5rem",
                  fontWeight: 600,
                }}
              >
                {user.name[0]}
              </Avatar>

              <Typography fontWeight={600}>{user.name}</Typography>

              <Chip
                label={user.role}
                sx={{
                  bgcolor: user.avatarColor,
                  color: "#fff",
                  fontWeight: 500,
                }}
              />
            </Paper>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default ProjectInfo;
