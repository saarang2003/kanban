// StoryContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import { mockStories } from "../apiData/mockStories";
import type { Stories, Story, StoryStatus } from "../types";

const DEFAULT_STATUS: StoryStatus = "Backlog";

// Define the shape of the context
interface StoryContextType {
  stories: Stories;
  addStory: (storyData: Omit<Story, "id" | "status" | "createdDate">) => void;
  removeStory: (id: string) => void;
  updateStory: (id: string, updatedData: Partial<Story>) => void;
}

// Create context
const StoryContext = createContext<StoryContextType | undefined>(undefined);

// Provider props
interface StoryProviderProps {
  children: ReactNode;
}

export const StoryProvider: React.FC<StoryProviderProps> = ({ children }) => {
  const [stories, setStories] = useState<Stories>(() => {
    const saved = localStorage.getItem("stories");
    return saved ? JSON.parse(saved) : mockStories;
  });

  useEffect(() => {
    localStorage.setItem("stories", JSON.stringify(stories));
  }, [stories]);

  const addStory = useCallback(
    (storyData: Omit<Story, "id" | "status" | "createdDate">) => {
      const newStory: Story = {
        id: crypto.randomUUID(),
        status: DEFAULT_STATUS,
        createdDate: new Date().toISOString(),
        ...storyData,
      };

      setStories((prev) => [...prev, newStory]);
    },
    [],
  );

  const removeStory = useCallback((id: string) => {
    setStories((prev) => prev.filter((story) => story.id !== id));
  }, []);

  const updateStory = useCallback((id: string, updatedData: Partial<Story>) => {
    setStories((prev) =>
      prev.map((story) =>
        story.id === id ? { ...story, ...updatedData } : story,
      ),
    );
  }, []);

  const storyValue = useMemo(
    () => ({ stories, addStory, removeStory, updateStory }),
    [stories, addStory, removeStory, updateStory],
  );

  return (
    <StoryContext.Provider value={storyValue}>{children}</StoryContext.Provider>
  );
};

// Custom hook
// eslint-disable-next-line react-refresh/only-export-components
export const useStories = (): StoryContextType => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error("useStories must be used within a StoryProvider");
  }
  return context;
};
