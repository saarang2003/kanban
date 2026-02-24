import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Box } from "@mui/material";
import Header from "./component/Header";
import Sidebar from "./component/Sidebar";
import Dashboard from "./page/Dashboard";
import ProjectLayout from "./page/ProjectPage/KanbanBoard/ProjectLayout";

function App() {
  return (
    <>
      <BrowserRouter>
        <Box sx={{ mb: 6 }}>
          <Header />
        </Box>
        <Box sx={{ display: "flex" }}>
          <Sidebar />

          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/project/:id" element={<ProjectLayout />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </>
  );
}

export default App;
