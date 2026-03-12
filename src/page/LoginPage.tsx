import React, { useEffect, useState, type ChangeEvent } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../features/users/context/UserContext";

const LoginPage: React.FC = () => {
  const login = useUsers((state) => state.login);
  const currentUser = useUsers((state) => state.currentUser);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = login(formData.username, formData.password);
    if (!success) return alert("Invalid credentials");

    navigate("/dashboard");
    setFormData({ username: "", password: "" });
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: "2rem", marginTop: "4rem" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login Account
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <TextField
            label="Username"
            name="username"
            variant="outlined"
            fullWidth
            required
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={formData.password}
            onChange={handleChange}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
          <Typography>
            New Users ?{" "}
            <Button onClick={() => navigate("/register")}>Register Here</Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
