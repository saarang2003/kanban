import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import type { Priority, Story, StoryStatus, User } from "../../../types";
import { FilePen } from "lucide-react";
import React, { useState, type SyntheticEvent } from "react";
import { useProjects } from "../../../context/ProjectContext";
import { useUsers } from "../../../context/UserContext";

interface StoryCardProps {
  story: Story;
  id: string;
  updateStory: (id: string, updatedData: Partial<Story>) => void;
}

export interface StoryFormData {
  title: string;
  description: string;
  priority: Priority | "";
  projectId: string;
  storyPoints: number;
  assignedUserId: string;
  status: StoryStatus;
}

const StoryCard: React.FC<StoryCardProps> = React.memo(
  ({ story, id, updateStory }) => {
    const [open, setOpen] = useState(false);
    const { projects } = useProjects();
    const { users: allUsers } = useUsers();

    const projectUsers =
      projects.find((p: { id: string }) => p.id === story.projectId)?.users ||
      []; /// all users in that project

    console.log("projectUsers in story card", projectUsers);

    const userObj = projectUsers
      .map((userId) => allUsers.find((u) => u.id === userId))
      .filter((u) => u !== undefined) as User[]; /// user objects of users in that project
    console.log("userObj in story card", userObj);

    const initialState: StoryFormData = {
      title: story.title,
      description: story.description,
      priority: story.priority,
      projectId: id,
      storyPoints: story.storyPoints,
      assignedUserId: story.assignedUserId,
      status: story.status,
    };

    const [formData, setFormData] = useState<StoryFormData>(initialState);

    const handleInputChange =
      (field: keyof StoryFormData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setFormData((prev) => ({
          ...prev,
          [field]:
            field === "storyPoints"
              ? value === ""
                ? ""
                : Number(value)
              : value,
        }));
      };

    const handleSelectChange =
      (field: keyof StoryFormData) => (e: SelectChangeEvent<string>) => {
        const value = e.target.value;
        setFormData((prev) => ({
          ...prev,
          [field]: value,
        }));
      };

    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      updateStory(story.id, {
        title: formData.title,
        description: formData.description,
        priority: formData.priority as Priority,
        storyPoints: Number(formData.storyPoints),
        assignedUserId: formData.assignedUserId,
        status: formData.status,
      });

      setOpen(false);
    };

    const handleOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <Card
        elevation={3}
        key={story.id}
        variant="outlined"
        sx={{ borderRadius: 2, mb: 2 }}
      >
        <CardContent sx={{ p: 2, borderRadius: 5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="body2" fontWeight="bold">
              {story.title}
            </Typography>
            <IconButton
              size="small"
              sx={{ color: "text.secondary" }}
              onClick={handleOpen}
            >
              <FilePen />
            </IconButton>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
              <DialogTitle sx={{ fontWeight: "bold" }}>Edit Story</DialogTitle>

              <form onSubmit={handleSubmit}>
                <DialogContent>
                  <Stack spacing={3} sx={{ mt: 1 }}>
                    <TextField
                      label="Story Name"
                      fullWidth
                      required
                      value={formData.title}
                      onChange={handleInputChange("title")}
                    />

                    <TextField
                      label="Description"
                      fullWidth
                      multiline
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange("description")}
                    />

                    <FormControl>
                      <FormLabel>Priority</FormLabel>
                      <RadioGroup
                        row
                        value={formData.priority}
                        onChange={handleInputChange("priority")}
                      >
                        <FormControlLabel
                          value="High"
                          control={<Radio />}
                          label="High"
                        />
                        <FormControlLabel
                          value="Medium"
                          control={<Radio />}
                          label="Medium"
                        />
                        <FormControlLabel
                          value="Low"
                          control={<Radio />}
                          label="Low"
                        />
                      </RadioGroup>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Status</FormLabel>
                      <RadioGroup
                        row
                        value={formData.status}
                        onChange={handleInputChange("status")}
                      >
                        <FormControlLabel
                          value="Backlog"
                          control={<Radio />}
                          label="Backlog"
                        />
                        <FormControlLabel
                          value="In Progress"
                          control={<Radio />}
                          label="In Progress"
                        />
                        <FormControlLabel
                          value="Testing"
                          control={<Radio />}
                          label="Testing"
                        />
                        <FormControlLabel
                          value="Completed"
                          control={<Radio />}
                          label="Completed"
                        />
                      </RadioGroup>
                    </FormControl>

                    <TextField
                      label="Story Points"
                      type="number"
                      inputProps={{ min: 1, max: 10 }}
                      value={formData.storyPoints}
                      onChange={handleInputChange("storyPoints")}
                      fullWidth
                      size="small"
                    />

                    <FormControl fullWidth>
                      <InputLabel>Assign to User</InputLabel>
                      <Select /// here we are only showing users that are part of that project, not all users in the system and also we are showing the name of the user instead of id, and the selected one as this is part of edit
                        value={formData.assignedUserId}
                        label="Assign to User"
                        onChange={handleSelectChange("assignedUserId")}
                        sx={{
                          backgroundColor: "white",
                          borderRadius: "4px",
                          color: "black",
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                        }}
                      >
                        {userObj.map((user) => (
                          <MenuItem key={user.id} value={user.id}>
                            {user.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                  <Button onClick={handleClose} color="inherit">
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained">
                    Update Status
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
          </Box>
        </CardContent>
      </Card>
    );
  },
);

export default StoryCard;
