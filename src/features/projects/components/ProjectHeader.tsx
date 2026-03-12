import React, { useState, useMemo, useCallback } from "react";
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Toolbar,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import type { Priority } from "../../../shared/types/common";
import type { User } from "../../users/types";
import { useUsers } from "../../users/context/UserContext";
import AddStoryModal from "../../stories/components/AddStoryModal";

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

const MenuProps = {
  PaperProps: {
    sx: {
      maxHeight: "14rem",
      width: "15.625rem",
    },
  },
};

const ProjectHeader: React.FC<ProjectHeaderProps> = React.memo(
  ({
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
    const allUsers = useUsers((state) => state.users);

    // Filter users assigned to this project
    const projectUsers = useMemo(() => {
      return allUsers.filter((u) => projectUserIds.includes(u.id));
    }, [allUsers, projectUserIds]);

    const handleStatusChange = (e: SelectChangeEvent<string[]>) => {
      const { value } = e.target;
      setPriorityFilter(
        (typeof value === "string" ? value.split(",") : value) as Priority[],
      );
    };

    const handleUserChange = (e: SelectChangeEvent<string>) => {
      setUserFilter(e.target.value);
    };

    const handleOpen = useCallback(() => setOpen(true), []);
    const handleClose = useCallback(() => setOpen(false), []);

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
          <Typography>{title.toLocaleUpperCase()}</Typography>

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

            <AddStoryModal
              open={open}
              handleClose={handleClose}
              id={id}
              addStories={addStories}
              projectUsers={projectUsers}
            />
          </Box>
        </Toolbar>
      </AppBar>
    );
  },
);

export default ProjectHeader;
