import {
  AppBar,
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Toolbar,
  Typography,
  TextField,
  type SelectChangeEvent,
} from "@mui/material";
import React from "react";
import type { Priority } from "../../../shared/types/common";

const MenuProps = {
  PaperProps: {
    sx: {
      maxHeight: "14rem",
      width: "15.625rem",
    },
  },
};

interface UserHeaderProps {
  id: string;
  name: string;
  priorityfilter: Priority[];
  setPriorityFilter: (status: Priority[]) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  name,
  priorityfilter,
  setPriorityFilter,
  searchTerm,
  setSearchTerm,
}) => {
  const handleStatusChange = (e: SelectChangeEvent<string[]>) => {
    const { value } = e.target;
    setPriorityFilter(
      (typeof value === "string" ? value.split(",") : value) as Priority[],
    );
  };

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
        <Typography>{name}'s Dashboard</Typography>

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
          {/* Search Field */}
          <TextField
            size="small"
            placeholder="Search by title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              backgroundColor: "white",
              borderRadius: "0.25rem",
              width: { xs: "100%", sm: "15rem" },
            }}
          />

          {/* Priority Filter */}
          <FormControl
            size="small"
            sx={{
              minWidth: { sm: "12.5rem" },
              width: { xs: "100%", sm: "15.625rem" },
              mb: { xs: 0.5, sm: 0 },
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
              id="priority-select-label"
            >
              Priority
            </InputLabel>

            <Select
              labelId="priority-select-label"
              multiple
              value={priorityfilter}
              onChange={handleStatusChange}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
              sx={{
                backgroundColor: "white",
                color: "black",
                borderRadius: "0.25rem",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "gray" },
                "& .MuiSvgIcon-root": { color: "black" },
              }}
            >
              {["High", "Medium", "Low"].map((p) => (
                <MenuItem key={p} value={p}>
                  <Checkbox checked={priorityfilter.includes(p as Priority)} />
                  <ListItemText primary={p} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default UserHeader;
