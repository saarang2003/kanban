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
} from "@mui/material";
import { Link } from "react-router-dom";
import { useUsers } from "../context/UserContext";
import { useProjects } from "../context/ProjectContext"; // corrected hook

const MenuProps = {
  PaperProps: { style: { maxHeight: 250, width: 250 } },
};

// Form state type
interface ProjectFormData {
  name: string;
  description: string;
  users: string[];
}

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { users: allUsers } = useUsers();
  const { addProject } = useProjects();

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

    // Pass only name, description, and users to addProject
    addProject({
      name: formData.name,
      description: formData.description,
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
      sx={{ bgcolor: "white", borderRadius: "5px", mb: 2 }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button component={Link} to="/" color="inherit">
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 700, color: "primary.main" }}
          >
            KanbanFlow
          </Typography>
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleOpen}
            sx={{ borderRadius: "8px", textTransform: "none" }}
          >
            Add Project
          </Button>

          <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ fontWeight: "bold" }}>
              Create New Project
            </DialogTitle>

            <form onSubmit={handleSubmit}>
              <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
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
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
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

              <DialogActions sx={{ p: 3 }}>
                <Button onClick={handleClose} color="inherit">
                  Cancel
                </Button>
                <Button type="submit" variant="contained">
                  Create Project
                </Button>
              </DialogActions>
            </form>
          </Dialog>

          <IconButton size="small">
            <Avatar
              sx={{ width: 35, height: 35 }}
              src="https://i.pravatar.cc/150?u=fake@pravatar.com"
            />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
