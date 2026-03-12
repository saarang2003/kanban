import React, { useMemo, useState } from "react";
import { Box, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import { COLUMNS, type Story } from "../features/stories/types";
import StoryCard from "../features/stories/components/StoryCard";
import UserHeader from "../features/users/components/UserHeader";
import type { Priority } from "../shared/types/common";
import { useParams } from "react-router-dom";
import { useStories } from "../features/stories/context/StoryContext";
import { useUsers } from "../features/users/context/UserContext";

const UserDashboardPage: React.FC = () => {
  const { id: UserId } = useParams();
  const stories = useStories((state) => state.stories);
  const currentUser = useUsers((state) => state.currentUser);

  // filter stories assigned to users
  const userStories = useMemo(() => {
    if (!UserId) return [];
    return stories.filter((story: Story) => story.assignedUserId === UserId);
  }, [stories, UserId]);

  // State for filters
  const [filters, setFilters] = useState<{
    priorityFilter: Priority[];
    searchTerm: string;
  }>({
    priorityFilter: [],
    searchTerm: "",
  });

  // Filter stories by priority and search term
  const filteredStories = useMemo(() => {
    return userStories.filter((s: Story) => {
      const matchesPriority =
        filters.priorityFilter.length === 0 ||
        filters.priorityFilter.includes(s.priority);

      const matchesSearch = s.title
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());

      return matchesPriority && matchesSearch;
    });
  }, [userStories, filters]);

  if (!UserId) {
    return null;
  }

  return (
    <>
      <Box
        sx={{
          padding: "1.5rem",
          marginTop: "2.5rem",
          borderRadius: "0.5rem",
          border: "0.0625rem solid #e0e0e0",
          bgcolor: "#ffffff",
        }}
      >
        <UserHeader
          id={UserId}
          name={currentUser?.name || "User"}
          priorityfilter={filters.priorityFilter}
          setPriorityFilter={(p) =>
            setFilters((prev) => ({ ...prev, priorityFilter: p }))
          }
          searchTerm={filters.searchTerm}
          setSearchTerm={(term) =>
            setFilters((prev) => ({ ...prev, searchTerm: term }))
          }
        />

        <Container maxWidth={false} sx={{ width: "100%" }}>
          <Grid container columnSpacing="1.5rem" rowSpacing="1.5rem">
            {COLUMNS.map((status) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={status}>
                <Paper
                  elevation={0}
                  sx={{
                    padding: "1rem",
                    bgcolor: "#ebedf0",
                    borderRadius: "0.5rem",
                    minHeight: "70vh",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {status}
                  </Typography>

                  <Stack spacing="1rem">
                    {filteredStories
                      .filter((s: Story) => s.status === status)
                      .map((story: Story) => (
                        <StoryCard key={story.id} id={story.id} story={story} />
                      ))}
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default UserDashboardPage;
