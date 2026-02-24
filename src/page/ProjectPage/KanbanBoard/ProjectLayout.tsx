import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Grid, Paper, Stack, Container } from "@mui/material";
import type { StoryStatus } from "../../../types";
import { useProjects } from "../../../context/ProjectContext";
import { useStories } from "../../../context/StoryContext";
import ProjectHeader from "../ProjectHeader";
import StoryCard from "./StoryCard";

// Strongly typed column statuses
const COLUMNS: StoryStatus[] = [
  "Backlog",
  "In Progress",
  "Testing",
  "Completed",
];

const ProjectLayout: React.FC = () => {
  // Type the route param
  const { id } = useParams<{ id: string }>();

  const { projects } = useProjects();
  const { stories, addStory, updateStory } = useStories();

  // Find current project
  const projectData = projects.find((p) => p.id === id);

  // Filter stories for this project
  const projectStories = useMemo(() => {
    if (!id) return [];
    return stories.filter((s) => s.projectId === id);
  }, [stories, id]);

  // Safety check
  if (!projectData) {
    return <Typography sx={{ p: 3 }}>Project not found.</Typography>;
  }

  return (
    <Box
      sx={{
        p: 3,
        mt: 5,
        borderRadius: 2,
        border: "1px solid #e0e0e0",
        bgcolor: "#ffffff",
      }}
    >
      <ProjectHeader
        id={projectData.id}
        title={projectData.name}
        addStories={addStory}
        users={projectData.users}
      />

      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {COLUMNS.map((status) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={status}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: "#ebedf0",
                  borderRadius: 2,
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
    </Box>
  );
};

export default ProjectLayout;
