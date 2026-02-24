import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
import { ChevronLeft, Menu as MenuIcon } from "lucide-react";
import { useProjects } from "../context/ProjectContext";
import { useNavigate } from "react-router-dom";

const drawerWidthOpen = 240;
const drawerWidthClosed = 60;

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const { projects } = useProjects();
  console.log("projects in sidebar", projects);
  // const projects: string[] = [
  //   "Marketing Campaign",
  //   "Q4 Roadmap",
  //   "Website Redesign",
  //   "Mobile App",
  // ];

  return (
    <Drawer
      variant="permanent"
      component="aside"
      elevation={2}
      sx={{
        width: open ? drawerWidthOpen : drawerWidthClosed,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          position: "fixed",
          width: open ? drawerWidthOpen : drawerWidthClosed,
          boxSizing: "border-box",
          mt: "88px",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
          borderTopRightRadius: "5px", // Push drawer below header
        },
      }}
    >
      {/* Header Area */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          p: 2,
        }}
      >
        {open && (
          <Typography variant="h6" fontWeight="bold">
            Projects
          </Typography>
        )}
        <IconButton onClick={() => setOpen((prev) => !prev)}>
          {open ? <ChevronLeft /> : <MenuIcon />}
        </IconButton>
      </Box>

      <Divider />

      {/* Project List */}
      <List>
        {projects.map((project) => (
          <ListItem key={project.id} disablePadding>
            <ListItemButton
              sx={{ minHeight: 48 }}
              onClick={() => navigate(`/project/${project.id}`)}
            >
              {/* Placeholder icon / first letter */}
              <Box
                sx={{
                  minWidth: 30,
                  fontWeight: "bold",
                  color: "primary.main",
                }}
              >
                {project.name.charAt(0).toUpperCase()}
              </Box>

              {open && <ListItemText primary={project.name} sx={{ ml: 2 }} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
