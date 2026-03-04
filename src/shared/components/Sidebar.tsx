import React, { useMemo, useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  IconButton,
  Typography,
  Divider,
  Collapse,
  Tooltip,
} from "@mui/material";

import {
  ChevronLeft,
  Menu as MenuIcon,
  Dashboard,
  ExpandLess,
  ExpandMore,
  Folder,
} from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/useApp";
import DeleteIcon from "@mui/icons-material/Delete";

const drawerWidthOpen = 240;
const drawerWidthClosed = 60;

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [projectsOpen, setProjectsOpen] = useState<boolean>(true);
  const navigate = useNavigate();
  const { projects, logout, deleteUser, currentUser } = useApp();

  //filter project based on roles
  const visibleProjects = useMemo(() => {
    if (!currentUser) return [];

    if (currentUser.role === "Admin") return projects;

    return projects.filter(
      (project) =>
        project.users.includes(currentUser.id) || // assigned to user
        project.createdBy === currentUser.id, // projects they created
    );
  }, [currentUser, projects]);

  const handleToggleDrawer = () => setOpen(!open);
  const handleToggleProjects = () => setProjectsOpen(!projectsOpen);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidthOpen : drawerWidthClosed,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidthOpen : drawerWidthClosed,
          transition: "width 0.2s ease-in-out",
          overflowX: "hidden",
          marginTop: "5.5rem",
          boxShadow: "0.125rem 0 0.3125rem rgba(0,0,0,0.1)", // 2px 0 5px
          display: "flex",
          flexDirection: "column",
          height: "calc(100% - 5.5rem)",
        },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          padding: "1rem",
        }}
      >
        {open && (
          <Typography variant="subtitle1" fontWeight="bold">
            My App
          </Typography>
        )}
        <IconButton onClick={handleToggleDrawer}>
          {open ? <ChevronLeft /> : <MenuIcon />}
        </IconButton>
      </Box>

      <Divider />

      <List>
        {/* Dashboard */}
        <ListItem disablePadding>
          <Tooltip title="Dashboard">
            <ListItemButton
              onClick={() => navigate(`/userDashboard/${currentUser?.id}`)}
            >
              <ListItemIcon sx={{ minWidth: "2.5rem" }}>
                <Dashboard />
              </ListItemIcon>
              {open && <ListItemText primary="Dashboard" />}
            </ListItemButton>
          </Tooltip>
        </ListItem>

        {/* Projects */}
        <ListItem disablePadding sx={{ display: "block" }}>
          <Tooltip title="Projects">
            <ListItemButton
              onClick={open ? handleToggleProjects : handleToggleDrawer}
            >
              <ListItemIcon sx={{ minWidth: "2.5rem" }}>
                <Folder />
              </ListItemIcon>
              {open && <ListItemText primary="Projects" />}
              {open && (projectsOpen ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
          </Tooltip>

          <Collapse in={open && projectsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {visibleProjects.map((project) => (
                <ListItemButton
                  key={project.id}
                  sx={{ pl: "2rem" }}
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <Box
                    sx={{
                      minWidth: "1.5625rem", // 25px
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                    }}
                  >
                    {project.name.charAt(0)}
                  </Box>
                  {open && <ListItemText primary={project.name} />}
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </ListItem>
      </List>

      <Divider sx={{ mt: "auto" }} />

      {/* Auth Section */}
      <List>
        <ListItem disablePadding>
          <Tooltip title="Delete User">
            <ListItemButton
              onClick={() => currentUser && deleteUser(currentUser?.id)}
            >
              <ListItemIcon sx={{ minWidth: "2.5rem" }}>
                <DeleteIcon />
              </ListItemIcon>
              {open && <ListItemText primary="Delete User" />}
            </ListItemButton>
          </Tooltip>
        </ListItem>

        <ListItem disablePadding>
          <Tooltip title="Logout">
            <ListItemButton onClick={logout}>
              <ListItemIcon sx={{ minWidth: "2.5rem" }}>
                <LogoutIcon />
              </ListItemIcon>
              {open && <ListItemText primary="Logout" />}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
