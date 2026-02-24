import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import { ProjectProvider } from "./context/ProjectContext.tsx";
import { StoryProvider } from "./context/StoryContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <ProjectProvider>
        <StoryProvider>
          <App />
        </StoryProvider>
      </ProjectProvider>
    </UserProvider>
  </StrictMode>,
);
