import { createContext, useContextSelector } from "use-context-selector";
import type { Story } from "../types";

type StoryContextType = {
  stories: Story[];
  addStory: (data: Omit<Story, "id" | "status" | "createdDate">) => void;
  removeStory: (id: string) => void;
  updateStory: (id: string, data: Partial<Omit<Story, "id">>) => void;
};

export const StoryContext = createContext<StoryContextType | null>(null);

export function useStories<T>(selector: (ctx: StoryContextType) => T): T {
  const selected = useContextSelector(StoryContext, (ctx) => {
    if (!ctx) {
      throw new Error("useUsers must be used within AppProvider");
    }
    return selector(ctx);
  });
  return selected;
}
