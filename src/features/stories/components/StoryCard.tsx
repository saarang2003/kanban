import React from "react";
import { STATUS_COLORS, type Story } from "../types";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import EditSquareIcon from "@mui/icons-material/EditSquare";

interface StoryCardProps {
  story: Story;
  id: string;
  updateStory: (id: string, updatedData: Partial<Story>) => void;
  removeStory: (id: string) => void;
}

const StoryCard: React.FC<StoryCardProps> = React.memo(({ story }) => {
  const navigate = useNavigate();
  const handleOpen = () => {
    navigate(`/project/${story.projectId}/story/${story.id}`);
  };

  return (
    <Card
      elevation={3}
      key={story.id}
      variant="outlined"
      sx={{ borderRadius: "0.5rem", mb: "1rem" }}
    >
      <CardContent
        sx={{
          p: "1rem",
          borderRadius: "0.25rem",
          bgcolor: STATUS_COLORS[story.status] || "#fff",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            {story.title}
          </Typography>
          <Tooltip title="edit">
            <IconButton
              size="small"
              sx={{ color: "text.secondary" }}
              onClick={handleOpen}
            >
              <EditSquareIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
});

export default StoryCard;
