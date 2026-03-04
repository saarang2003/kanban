import React, { useMemo, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { COLUMNS } from "../features/stories/types";
import { Box, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import ProjectHeader from "../features/projects/components/ProjectHeader";
import StoryCard from "../features/stories/components/StoryCard";
import { useApp } from "../shared/context/useApp";
import { Skeleton } from "@mui/material";
import type { Priority } from "../shared/types/common";

export const ProjectPageSkeleton = () => (
  <Box sx={{ p: "1.5rem", mt: "2.5rem" }}>
    {/* Mirror the ProjectHeader */}
    <Skeleton
      variant="rectangular"
      height="3.75rem"
      sx={{ mb: "2rem", borderRadius: "1rem" }}
    />

    <Grid container columnSpacing="1.5rem" rowSpacing="1.5rem">
      {[1, 2, 3, 4].map((col) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={col}>
          <Paper sx={{ p: "1rem", bgcolor: "#f5f5f5", minHeight: "70vh" }}>
            <Skeleton width="60%" height="1.875rem" sx={{ mb: "1rem" }} />
            <Stack spacing={2}>
              <Skeleton variant="rounded" height="6.25rem" />
              <Skeleton variant="rounded" height="6.25rem" />
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </Box>
);

const ProjectPage: React.FC = () => {
  // Type the route param -> current project id
  const { id } = useParams<{ id: string }>();
  const { stories, addStory, updateStory, removeStory, projects } = useApp();

  // Filters are now tied to projectId

  const [filters, setFilters] = useState<{
    projectId: string | undefined;
    priorityFilter: Priority[];
    user: string;
  }>({
    projectId: id,
    priorityFilter: [], // empty = show all
    user: "all",
  });

  const { priorityFilter, user: userFilter } = filters;

  // Find current project
  const projectData = projects.find((p) => p.id === id);

  // Filter stories for this project
  const projectStories = useMemo(() => {
    if (!id) return [];

    return stories.filter((s) => {
      const matchesProject = s.projectId === id;

      const matchesPriority =
        priorityFilter.length === 0 || priorityFilter.includes(s.priority); // If no status filter, show all. Otherwise, check if story's status is in the filter.

      const matchesUser =
        userFilter === "all" || s.assignedUserId === userFilter; // If no user filter, show all. Otherwise, check if story's assigned user matches the filter.

      const matchesFilter = matchesPriority && matchesUser; // Story must match both filters to be shown.

      return matchesProject && matchesFilter; // First check if story belongs to the project, then apply filters
    });
  }, [stories, id, priorityFilter, userFilter]);

  // Safety check
  if (!projectData) {
    return <Typography sx={{ p: 3 }}>Project not found.</Typography>;
  }

  return (
    <Box
      sx={{
        padding: "1.5rem",
        marginTop: "2.5rem",
        borderRadius: "0.5rem",
        border: "0.0625rem solid #e0e0e0",
        bgcolor: "#ffffff",
      }}
    >
      <ProjectHeader
        id={projectData.id}
        title={projectData.name}
        addStories={addStory}
        users={projectData.users}
        priorityfilter={priorityFilter}
        setPriorityFilter={(priority) =>
          setFilters((prev) => ({ ...prev, priorityFilter: priority }))
        }
        userFilter={userFilter}
        setUserFilter={(userId) =>
          setFilters((prev) => ({ ...prev, user: userId }))
        }
      />

      <Container maxWidth="xl">
        <Box>Something here</Box>
        <Grid container columnSpacing="1.5rem" rowSpacing="1.5rem">
          {COLUMNS.map((status) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={status}>
              <Paper
                elevation={0}
                sx={{
                  p: "1rem",
                  bgcolor: "#ebedf0",
                  borderRadius: "1rem",
                  minHeight: "70vh",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {status}
                </Typography>

                <Stack spacing={2}>
                  {projectStories
                    .filter((s) => s.status === status)
                    .map((story) => (
                      <StoryCard
                        key={story.id}
                        updateStory={updateStory}
                        removeStory={removeStory}
                        id={story.id}
                        // status={story.status}
                        story={story}
                      />
                    ))}
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Outlet />
    </Box>
  );
};

export default ProjectPage;
