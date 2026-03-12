import {
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
  type SelectChangeEvent,
} from "@mui/material";
import type React from "react";
import type { Priority } from "../../../shared/types/common";
import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import type { User } from "../../users/types";

interface AddStoryModalProps {
  open: boolean;
  handleClose: () => void;
  id: string;
  addStories: (story: {
    title: string;
    description: string;
    priority: Priority;
    projectId: string;
    storyPoints: number;
    assignedUserId: string;
  }) => void;
  projectUsers: User[];
}

interface StoryFormData {
  title: string;
  description: string;
  priority: Priority | "";
  projectId: string;
  storyPoints: number | "";
  assignedUserId: string;
}

const AddStoryModal: React.FC<AddStoryModalProps> = ({
  open,
  handleClose,
  id,
  addStories,
  projectUsers,
}) => {
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

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: "bold" }}>Create New Story</DialogTitle>

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
                <FormControlLabel value="Low" control={<Radio />} label="Low" />
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
  );
};

export default AddStoryModal;
