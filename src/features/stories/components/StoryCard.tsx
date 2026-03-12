import React, { useState, type SyntheticEvent } from "react";
import { STATUS_COLORS, type Story } from "../types";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
  type SnackbarCloseReason,
} from "@mui/material";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import ShareIcon from "@mui/icons-material/Share";
import { CheckCircleOutline } from "@mui/icons-material";

interface StoryCardProps {
  story: Story;
  id: string;
}

const StoryCard: React.FC<StoryCardProps> = React.memo(({ story }) => {
  const navigate = useNavigate();
  const handleOpen = () => {
    navigate(`/project/${story.projectId}/story/${story.id}`);
  };

  const [toast, setToast] = useState(false);

  const handleCopy = () => {
    if (story) {
      navigator.clipboard.writeText(
        `${window.location.origin}/project/${story.projectId}/story/${story.id}`,
      );
    }
    setToast(true);
  };

  const handleToastClose = (
    _event: SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setToast(false);
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
            gap: "0.25rem",
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            {story.title}
          </Typography>
          <Box sx={{ display: "flex" }}>
            <Tooltip title="edit">
              <IconButton
                size="small"
                sx={{ color: "text.secondary" }}
                onClick={handleOpen}
              >
                <EditSquareIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share Story">
              <IconButton
                size="small"
                onClick={handleCopy}
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  padding: "4px", // Default for 'small' is 5px+, reduce to 2px-4px
                  width: "28px", // Force a smaller container
                  height: "28px",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                <ShareIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Snackbar
              open={toast}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              autoHideDuration={2000}
              onClose={handleToastClose}
            >
              <Alert
                onClose={handleToastClose}
                severity="info"
                variant="filled"
                icon={<CheckCircleOutline fontSize="inherit" />}
                sx={{ width: "100%" }}
              >
                Story Link Copied
              </Alert>
            </Snackbar>
          </Box>
        </Box>

        <Box sx={{ mt: "1.5rem" }}>
          Created on :{" "}
          <Chip
            variant="filled"
            color="primary"
            size="small"
            label={new Date(story.createdDate).toLocaleDateString()}
          />
        </Box>
      </CardContent>
    </Card>
  );
});

export default StoryCard;
