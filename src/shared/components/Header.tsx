import React, { useState, type ChangeEvent, type SyntheticEvent } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
  MenuItem,
  FormControl,
  Stack,
  type SelectChangeEvent,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";
import { GlobalCommandPalette } from "./GlobalCommandPalette";
import { useUsers } from "../../features/users/context/UserContext";
import { useProjects } from "../../features/projects/context/ProjectContext";

const MenuProps = {
  PaperProps: {
    sx: {
      maxHeight: "15.625rem", // 250px
      width: "15.625rem",
    },
  },
};

// Form state type
interface ProjectFormData {
  name: string;
  description: string;
  users: string[];
}

const Header: React.FC = React.memo(() => {
  const [open, setOpen] = useState(false);
  const allUsers = useUsers((state) => state.users);
  const currentUser = useUsers((state) => state.currentUser);
  const addProject = useProjects((state) => state.addProject);

  const initialState: ProjectFormData = {
    name: "",
    description: "",
    users: [],
  };

  const [formData, setFormData] = useState<ProjectFormData>(initialState);

  // Text input change handler
  const handleInputChange =
    (field: "name" | "description") =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  // Multi-select change handler
  const handleSelectChange = (e: SelectChangeEvent<string[]>) => {
    setFormData((prev) => ({ ...prev, users: e.target.value as string[] }));
  };

  // Form submit
  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    // Pass only name, description, and users to addProject
    addProject({
      name: formData.name.trim(),
      description: formData.description.trim(),
      users: formData.users,
    });

    handleClose();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData(initialState);
  };

  return (
    <AppBar
      component="nav"
      color="default"
      elevation={1}
      sx={{
        bgcolor: "white",
        borderRadius: "0.3125rem", // 5px
        marginBottom: "1rem",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button component={Link} to="/" color="inherit">
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              color: "primary.main",
            }}
          >
            KanbanFlow
          </Typography>
        </Button>

        <Box
          maxWidth="100%"
          sx={{
            display: { xs: "none", sm: "block" },
          }}
        >
          <GlobalCommandPalette />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Button
            variant="contained"
            onClick={handleOpen}
            sx={{ borderRadius: "0.5rem", textTransform: "none" }}
          >
            Add Project
          </Button>

          <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ fontWeight: "bold" }}>
              Create New Project
            </DialogTitle>

            <form onSubmit={handleSubmit}>
              <DialogContent>
                <Stack spacing="1.5rem" sx={{ marginTop: "0.5rem" }}>
                  <TextField
                    label="Project Name"
                    fullWidth
                    required
                    value={formData.name}
                    onChange={handleInputChange("name")}
                  />

                  <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange("description")}
                  />

                  <FormControl fullWidth>
                    <InputLabel>Team Users</InputLabel>
                    <Select
                      multiple
                      value={formData.users}
                      onChange={handleSelectChange}
                      input={<OutlinedInput label="Team Users" />}
                      renderValue={(selected) => (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: " 0.5rem",
                          }}
                        >
                          {(selected as string[]).map((id) => {
                            const user = allUsers.find((u) => u.id === id);
                            return (
                              <Chip key={id} label={user?.name} size="small" />
                            );
                          })}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {allUsers.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </DialogContent>

              <DialogActions sx={{ padding: "1.5rem" }}>
                <Button onClick={handleClose} color="inherit">
                  Cancel
                </Button>
                <Button type="submit" variant="contained">
                  Create Project
                </Button>
              </DialogActions>
            </form>
          </Dialog>

          <Tooltip title={currentUser?.name as string}>
            <IconButton size="small">
              <Avatar
                sx={{
                  width: "2.1875rem", //35px
                  height: "2.1875rem",
                  bgcolor: currentUser?.avatarColor,
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
});

export default Header;
