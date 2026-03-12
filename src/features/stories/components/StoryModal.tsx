import {
  Box,
  Button,
  Chip,
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
import type { StoryFormData } from "./StoryModalContainer";
import type { ChangeEvent } from "react";

interface StoryModalProps {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  formData: StoryFormData;
  handleInputChange: (
    field: keyof StoryFormData,
  ) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (
    field: keyof StoryFormData,
  ) => (e: SelectChangeEvent<string>) => void;
  handleRemoveStory: (id: string) => void;
  projectUsers: {
    role: string;
    avatarColor: string;
    id: string;
    name: string;
  }[];
  storyId: string | unknown;
  canEditOrDelete: boolean;
  lastUpdated: string;
}

const StoryModal: React.FC<StoryModalProps> = ({
  open,
  handleClose,
  handleSubmit,
  formData,
  handleInputChange,
  handleSelectChange,
  handleRemoveStory,
  projectUsers,
  storyId,
  canEditOrDelete,
  lastUpdated,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold" }}>Edit Story</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={"1.5rem"} sx={{ mt: "0.5rem" }}>
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

            {/* status  */}
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
                  borderRadius: "0.25rem",
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

        <Box sx={{ paddingLeft: "2rem" }}>
          Last Updated : <Chip label={lastUpdated} />
        </Box>

        <DialogActions sx={{ p: "1.5rem" }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() => handleRemoveStory(storyId as string)}
            variant="contained"
            color="error"
            disabled={!canEditOrDelete}
          >
            Remove Story
          </Button>
          <Button type="submit" variant="contained" disabled={!canEditOrDelete}>
            Update Status
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StoryModal;
