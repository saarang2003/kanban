import {
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
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import React, { useState, type ChangeEvent, type SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import { useProjects } from "../context/ProjectContext";
import { useUsers } from "../context/UserContext";

const MenuProps = {
  PaperProps: { style: { maxHeight: 250, width: 250 } },
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

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  name,
  description,
  users: projectUserIds,
  removeProject,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const { projects, updateProject } = useProjects();
  const { users: allUsers } = useUsers();

  const currentProject = projects.find((p) => p.id === id);

  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    users: [],
  });

  if (!currentProject) return null;

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

  return (
    <Card
      sx={{ mb: 3, p: 2, boxShadow: "2px 0 5px rgba(0,0,0,0.1)" }}
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

      <Box sx={{ px: 2, pb: 1 }}>
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
          to={`/project/${id}`}
        >
          View Project
        </Button>

        <Button size="small" variant="outlined" onClick={handleOpen}>
          Edit Project
        </Button>

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
          <DialogTitle sx={{ fontWeight: "bold" }}>Edit Project</DialogTitle>

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
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
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

            <DialogActions sx={{ p: 3 }}>
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
          onClick={() => removeProject(id)}
        >
          Archive Project
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProjectCard;
