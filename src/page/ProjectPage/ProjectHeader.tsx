import React, {
  useState,
  useMemo,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";

import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Toolbar,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";

import { useUsers } from "../../context/UserContext";
import type { Priority, StoryStatus } from "../../types";

interface ProjectHeaderProps {
  id: string;
  title: string;
  users: string[];
  addStories: (story: {
    title: string;
    description: string;
    priority: Priority;
    projectId: string;
    storyPoints: number;
    assignedUserId: string;
  }) => void;
}

export interface Story {
  id: string;
  projectId: string;
  title: string;
  description: string;
  priority: Priority;
  storyPoints: number;
  assignedUserId: string;
  status: StoryStatus;
  createdDate: string; // ISO string
}

interface StoryFormData {
  title: string;
  description: string;
  priority: Priority | "";
  projectId: string;
  storyPoints: number | "";
  assignedUserId: string;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  id,
  title,
  users: projectUserIds,
  addStories,
}) => {
  const [status, setStatus] = useState<StoryStatus>("Backlog");
  const [open, setOpen] = useState<boolean>(false);

  const { users: allUsers } = useUsers();

  // Filter users assigned to this project
  const projectUsers = useMemo(() => {
    return allUsers.filter((u) => projectUserIds.includes(u.id));
  }, [allUsers, projectUserIds]);

  const initialState: StoryFormData = {
    title: "",
    description: "",
    priority: "",
    projectId: id,
    storyPoints: "",
    assignedUserId: "",
  };

  const [formData, setFormData] = useState<StoryFormData>(initialState);

  const handleInputChange =
    (field: keyof StoryFormData) =>
    (
      e:
        | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent,
    ) => {
      const value = e.target.value;

      setFormData((prev) => ({
        ...prev,
        [field]:
          field === "storyPoints" ? (value === "" ? "" : Number(value)) : value,
      }));
    };

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.priority ||
      !formData.assignedUserId ||
      formData.storyPoints === ""
    )
      return;

    addStories({
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      projectId: id,
      storyPoints: formData.storyPoints,
      assignedUserId: formData.assignedUserId,
    });

    setFormData(initialState);
    handleClose();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <AppBar
      position="static"
      color="primary"
      elevation={1}
      sx={{ borderRadius: "5px", mb: 2 }}
    >
      <Toolbar
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
          p: 1,
        }}
      >
        <Typography>{title}</Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <FormControl
            sx={{ minWidth: 120, width: { xs: "100%", sm: "auto" } }}
            size="small"
          >
            <Select
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value as StoryStatus)}
              sx={{
                backgroundColor: "white",
                borderRadius: "4px",
                color: "black",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            >
              <MenuItem value="Backlog">Backlog</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Testing">Testing</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" color="secondary" onClick={handleOpen}>
            Add Story
          </Button>

          <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ fontWeight: "bold" }}>
              Create New Story
            </DialogTitle>

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
                    <Select
                      value={formData.assignedUserId}
                      label="Assign to User"
                      onChange={handleInputChange("assignedUserId")}
                      sx={{
                        backgroundColor: "white",
                        borderRadius: "4px",
                        color: "black",
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                      }}
                    >
                      {projectUsers.map((user) => (
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
                  Create Story
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ProjectHeader;
