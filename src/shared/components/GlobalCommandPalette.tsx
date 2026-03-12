import {
  Dialog,
  DialogContent,
  TextField,
  Box,
  Chip,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FolderIcon from "@mui/icons-material/Folder";
import { useProjects } from "../../features/projects/context/ProjectContext";
import { useStories } from "../../features/stories/context/StoryContext";
import { useUsers } from "../../features/users/context/UserContext";
import { useDebounce } from "../hooks/useDebounce";

type SearchResult =
  | { type: "project"; id: string; label: string }
  | { type: "story"; id: string; label: string; projectId: string }
  | { type: "user"; id: string; label: string };

export const GlobalCommandPalette: React.FC = React.memo(() => {
  const projects = useProjects((state) => state.projects);
  const stories = useStories((state) => state.stories);
  const users = useUsers((state) => state.users);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]); // for tracking current items of list
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 1. Reset query on close
  const handleClose = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  // Pre-flatten the list. This only runs if your data from useApp() changes. no need for recalculation in every render)
  const allSearchableItems = useMemo(
    () => [
      ...projects.map((p) => ({
        type: "project" as const,
        id: p.id,
        label: p.name,
      })),
      ...stories.map((s) => ({
        type: "story" as const,
        id: s.id,
        label: s.title,
        projectId: s.projectId,
      })),

      ...users.map((u) => ({
        type: "user" as const,
        id: u.id,
        label: u.name,
      })),
    ],
    [projects, stories, users],
  );

  const debouncedQuery = useDebounce(query, 200);

  // 2. Optimized filtering & grouping
  const filteredResults = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const lowerQuery = debouncedQuery.toLowerCase();
    return allSearchableItems
      .filter((item) => item.label.toLowerCase().includes(lowerQuery))
      .slice(0, 10); // shows only 10 reuslts
  }, [debouncedQuery, allSearchableItems]);

  // 3. Navigation handler
  const handleSelect = useCallback(
    (item: SearchResult) => {
      handleClose();
      if (item.type === "project") navigate(`/project/${item.id}/info`);
      if (item.type === "story")
        navigate(`/project/${item.projectId}/story/${item.id}`);
      if (item.type === "user") navigate(`/userDashboard/${item.id}`);
    },
    [navigate, handleClose],
  );

  const selectedIndexRef = useRef(0);

  // Keep the ref in sync with state for UI rendering
  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        return;
      }

      const activeItem = itemRefs.current[selectedIndex];

      if (activeItem) {
        activeItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }

      if (!open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredResults.length - 1 ? prev + 1 : prev,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter") {
        const selectedItem = filteredResults[selectedIndexRef.current];
        if (selectedItem) handleSelect(selectedItem);
      } else if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, filteredResults, handleSelect, selectedIndex, handleClose]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  return (
    <Box sx={{ maxWidth: "100%", display: "flex", alignItems: "center" }}>
      <TextField
        placeholder="Search..."
        size="small"
        fullWidth
        onClick={() => setOpen(true)}
        autoComplete="off"
        inputRef={inputRef}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <Chip
              label="⌘ K"
              size="small"
              sx={{ fontSize: "0.7rem", height: 20 }}
            />
          ),
          sx: {
            borderRadius: "20px",
            cursor: "pointer",
          },
        }}
        sx={{ width: "25.625rem" }}
      />

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm" // Smaller feels more like a palette
        scroll="paper"
        BackdropProps={{
          sx: { backdropFilter: "blur(4px)", bgcolor: "rgba(0,0,0,0.4)" },
        }}
        PaperProps={{ sx: { borderRadius: 3, mt: "10vh" } }} // Push it up slightly
      >
        <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
          <TextField
            fullWidth
            autoFocus
            variant="standard"
            placeholder="Search projects, stories, or people..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              disableUnderline: true,
              style: { fontSize: "1.2rem" },
            }}
            inputRef={inputRef}
          />
        </Box>

        <DialogContent sx={{ p: 0, minHeight: query ? "auto" : "100px" }}>
          {query && filteredResults.length === 0 ? (
            <Typography
              sx={{ p: 4, textAlign: "center" }}
              color="text.secondary"
            >
              No results found for "{query}"
            </Typography>
          ) : (
            <List sx={{ pt: 0, overflow: "auto" }}>
              {filteredResults.map((item, index) => (
                <ListItemButton
                  key={`${item.type}-${item.id}`}
                  onClick={() => handleSelect(item)}
                  divider={index !== filteredResults.length - 1}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  selected={selectedIndex === index}
                  sx={{
                    // Custom styling for the "active" item
                    "&.Mui-selected": {
                      backgroundColor: "action.selected",
                      borderLeft: "4px solid",
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <ListItemIcon>
                    {item.type === "project" && <FolderIcon color="primary" />}
                    {item.type === "story" && (
                      <AssignmentIcon color="success" />
                    )}
                    {item.type === "user" && <AccountCircleIcon color="info" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    secondary={item.type.toUpperCase()}
                    secondaryTypographyProps={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                    }}
                  />
                  <Typography variant="caption" color="text.disabled">
                    Jump to
                  </Typography>
                </ListItemButton>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
});
