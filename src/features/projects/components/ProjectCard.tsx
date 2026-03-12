import {
  Alert,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
  type SelectChangeEvent,
  type SnackbarCloseReason,
} from "@mui/material";
import React, { useState, type ChangeEvent, type SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import ShareIcon from "@mui/icons-material/Share";
import { CheckCircleOutline } from "@mui/icons-material";
import { useProjects } from "../context/ProjectContext";
import { useUsers } from "../../users/context/UserContext";

const MenuProps = {
  PaperProps: {
    sx: {
      maxHeight: "15.625rem",
      width: "15.625rem",
    },
  },
};
interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  users: string[];
  removeProject: (id: string) => void;
}

interface ProjectFormData {
  name: string;
  description: string;
  users: string[];
}

const ProjectCard: React.FC<ProjectCardProps> = React.memo(
  ({ id, name, description, users: projectUserIds, removeProject }) => {
    const [open, setOpen] = useState<boolean>(false);
    const projects = useProjects((state) => state.projects);
    const updateProject = useProjects((state) => state.updateProject);
    const allUsers = useUsers((state) => state.users);
    const currentUser = useUsers((state) => state.currentUser);
    const [toast, setToast] = useState(false);

    const currentProject = projects.find((p) => p.id === id);

    const [formData, setFormData] = useState<ProjectFormData>({
      name: "",
      description: "",
      users: [],
    });

    if (!currentProject) return null;

    if (!currentUser) {
      return null;
    }

    const canEditProject =
      currentUser.role === "Admin" ||
      currentProject.createdBy === currentUser.id;

    const handleOpen = () => {
      setFormData({
        name: currentProject.name,
        description: currentProject.description,
        users: currentProject.users,
      });
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const handleInputChange =
      (field: "name" | "description") =>
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
          ...prev,
          [field]: e.target.value,
        }));
      };

    const handleSelectChange = (e: SelectChangeEvent<string[]>) => {
      setFormData((prev) => ({
        ...prev,
        users: e.target.value as string[],
      }));
    };

    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      updateProject(id, formData);
      handleClose();
    };

    const handleCopy = () => {
      if (currentProject?.id) {
        navigator.clipboard.writeText(
          `${window.location.origin}/project/${id}/info`,
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
        sx={{
          marginBottom: "1.5rem",
          padding: "1rem",
          boxShadow: "0.125rem 0 0.3125rem rgba(0,0,0,0.1)",
        }}
        elevation={3}
      >
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" noWrap>
            {name}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>

        <Box
          sx={{
            paddingLeft: "1rem",
            paddingRight: "1rem",
            paddingBottom: "0.5rem",
          }}
        >
          <AvatarGroup max={2}>
            {projectUserIds.map((userId) => {
              const user = allUsers.find((u) => u.id === userId);
              return (
                <Avatar
                  key={userId}
                  alt={user?.name}
                  sx={{ bgcolor: user?.avatarColor }}
                >
                  {user?.name?.[0]}
                </Avatar>
              );
            })}
          </AvatarGroup>
        </Box>

        <CardActions>
          <Button
            size="small"
            variant="contained"
            component={Link}
            to={`/project/${id}/info`}
          >
            View Project
          </Button>

          <Button
            size="small"
            variant="outlined"
            disabled={!canEditProject}
            onClick={handleOpen}
          >
            Edit Project
          </Button>
          <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ fontWeight: "bold" }}>Edit Project</DialogTitle>

            <form onSubmit={handleSubmit}>
              <DialogContent>
                <Stack gap="1.5rem" sx={{ marginTop: "0.5rem" }}>
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
                            gap: "0.25rem",
                          }}
                        >
                          {(selected as string[]).map((id) => {
                            const user = allUsers.find((u) => u.id === id);
                            return (
                              <Chip
                                key={user?.id}
                                label={user?.name}
                                size="small"
                              />
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

              <DialogActions sx={{ p: "1.5rem" }}>
                <Button onClick={handleClose} color="inherit">
                  Cancel
                </Button>
                <Button type="submit" variant="contained">
                  Save Changes
                </Button>
              </DialogActions>
            </form>
          </Dialog>

          <Button
            size="small"
            variant="contained"
            color="secondary"
            disabled={!canEditProject}
            onClick={() => removeProject(id)}
          >
            Archive Project
          </Button>

          <Tooltip title="Share">
            <IconButton
              size="small"
              onClick={handleCopy}
              sx={{
                bgcolor: "primary.main",
                color: "white",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
                p: "0.rem",
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
              icon={<CheckCircleOutline fontSize="inherit" />}
              variant="filled"
              sx={{ width: "100%" }}
            >
              Project link copied
            </Alert>
          </Snackbar>
        </CardActions>
      </Card>
    );
  },
);

export default ProjectCard;
