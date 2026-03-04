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
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  ListItemText,
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
import type { Priority } from "../../../shared/types/common";
import type { StoryStatus } from "../../stories/types";
import type { User } from "../../users/types";
import { useApp } from "../../../shared/context/useApp";

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
  priorityfilter: Priority[];
  setPriorityFilter: (status: Priority[]) => void;
  userFilter: string;
  setUserFilter: (userId: string) => void;
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

const MenuProps = {
  PaperProps: {
    sx: {
      maxHeight: "14rem",
      width: "15.625rem",
    },
  },
};

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  id,
  title,
  users: projectUserIds,
  addStories,
  priorityfilter,
  setPriorityFilter,
  userFilter,
  setUserFilter,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const { users: allUsers } = useApp();

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

  const handleStatusChange = (e: SelectChangeEvent<string[]>) => {
    const { value } = e.target;
    setPriorityFilter(
      (typeof value === "string" ? value.split(",") : value) as Priority[],
    );
  };

  const handleUserChange = (e: SelectChangeEvent<string>) => {
    setUserFilter(e.target.value);
  };

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
      sx={{ borderRadius: "0.3125rem", mb: "1rem" }}
    >
      <Toolbar
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: "1rem",
          p: "0.5rem",
        }}
      >
        <Typography>{title}</Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            gap: 1,
            flexShrink: 0,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <FormControl
            size="small"
            sx={{
              minWidth: { sm: "12.5rem" },
              width: { xs: "100%", sm: "15.625rem" },
              mb: { xs: 1, sm: 0 },
            }}
          >
            <InputLabel
              id="demo-simple-select-label"
              sx={{
                "&.Mui-focused": { color: "primary.main" },
                backgroundColor: "white",
                paddingLeft: "0.25rem",
                paddingRight: "0.25rem",
                borderRadius: "0.25rem",
              }}
            >
              User
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={userFilter}
              label="User"
              onChange={handleUserChange}
              sx={{
                backgroundColor: "white",
                color: "black",
                borderRadius: 1,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "gray",
                },
                "& .MuiSvgIcon-root": {
                  color: "black",
                },
              }}
            >
              <MenuItem value="all">All Users</MenuItem>
              {projectUsers.map((user: User) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            size="small"
            sx={{
              minWidth: { sm: "12.5rem" },
              width: { xs: "100%", sm: "15.625rem" },
              mb: { xs: "0.5rem", sm: 0 },
            }}
          >
            <InputLabel
              sx={{
                "&.Mui-focused": { color: "primary.main" },
                backgroundColor: "white",
                paddingLeft: "0.25rem",
                paddingRight: "0.25rem",
                borderRadius: "0.25rem",
              }}
              id="demo-multiple-checkbox-label"
            >
              Priority
            </InputLabel>

            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={priorityfilter}
              onChange={handleStatusChange}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
              sx={{
                backgroundColor: "white",
                color: "black",
                borderRadius: "0.25rem",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "gray",
                },
                "& .MuiSvgIcon-root": {
                  color: "black",
                },
              }}
            >
              {["High", "Medium", "Low"].map((p) => {
                return (
                  <MenuItem key={p} value={p}>
                    <Checkbox
                      checked={priorityfilter.includes(p as Priority)}
                      size="small"
                      style={{ marginRight: "3rem" }}
                    />
                    <ListItemText primary={p} />
                  </MenuItem>
                );
              })}
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
                <Stack gap="1.5rem" sx={{ mt: "0.5rem" }}>
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

              <DialogActions sx={{ p: "1.5rem" }}>
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
