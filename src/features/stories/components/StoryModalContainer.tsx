import { useNavigate, useParams } from "react-router-dom";
import type { Priority } from "../../../shared/types/common";
import type { StoryStatus } from "../types";
import type { User } from "../../users/types";
import { useState, type SyntheticEvent } from "react";
import type { SelectChangeEvent } from "@mui/material";
import StoryModal from "./StoryModal";
import { useApp } from "../../../shared/context/useApp";

export interface StoryFormData {
  title: string;
  description: string;
  priority: Priority | "";
  storyPoints: number;
  assignedUserId: string;
  status: StoryStatus;
}

const StoryModalContainer: React.FC = () => {
  const { storyId, id: projectId } = useParams();
  const { stories, updateStory, removeStory, projects, users, currentUser } =
    useApp();
  const navigate = useNavigate();

  // Find the story based on the storyId from params
  const story = stories.find((s) => s.id === storyId);

  const project = projects.find((p) => p.id === projectId);
  // Get users of the project, filter out undefined
  const projectUsers: User[] =
    project?.users
      .map((uid) => users.find((u) => u.id === uid))
      .filter((u): u is User => !!u) || [];

  const isAdmin = currentUser?.role === "Admin";

  const isProjectOwner = project?.createdBy === currentUser?.id;

  const canEditOrDelete = isAdmin || isProjectOwner;

  // Initialize state safely even if story is undefined
  const [formData, setFormData] = useState<StoryFormData>(() => ({
    title: story?.title || "",
    description: story?.description || "",
    priority: story?.priority || "",
    storyPoints: story?.storyPoints || 1,
    assignedUserId: story?.assignedUserId || (projectUsers[0]?.id ?? ""),
    status: story?.status || "Backlog",
  }));

  // Close modal -> go back to project page
  const handleClose = () => {
    navigate(`/project/${projectId}`);
  };

  const handleInputChange =
    (field: keyof StoryFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        field === "storyPoints" ? Number(e.target.value) : e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleSelectChange =
    (field: keyof StoryFormData) => (e: SelectChangeEvent<string>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.storyPoints < 1 || formData.storyPoints > 10) {
      alert("Story Points must be between 1 and 10");
      return;
    }

    if (!story) {
      alert("Story not found");
      return;
    }

    updateStory(story.id, {
      title: formData.title,
      description: formData.description,
      priority: formData.priority as Priority,
      storyPoints: Number(formData.storyPoints),
      assignedUserId: formData.assignedUserId,
      status: formData.status,
    });
    handleClose();
  };

  const handleRemoveStory = (id: string) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      removeStory(id);
      handleClose();
    }
  };

  return (
    <StoryModal
      open={true}
      handleClose={handleClose}
      handleInputChange={handleInputChange}
      handleSelectChange={handleSelectChange}
      handleSubmit={handleSubmit}
      handleRemoveStory={handleRemoveStory}
      projectUsers={projectUsers}
      formData={formData}
      storyId={storyId}
      canEditOrDelete={canEditOrDelete}
    />
  );
};

export default StoryModalContainer;
