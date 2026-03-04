import React, { useState, type ChangeEvent } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
  Select,
  FormControl,
  InputLabel,
  type SelectChangeEvent,
  MenuItem,
} from "@mui/material";
import { RoleList, type User } from "../features/users/types";
import { getRandomHexColor } from "../features/users/utils/randomHex";
import { useNavigate } from "react-router-dom";
import { useApp } from "../shared/context/useApp";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useApp();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "confirmPassword") setConfirmPassword(value);
    else setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setFormData((prev) => ({ ...prev, role: e.target.value as string }));
  };

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name: formData.username,
      password: formData.password,
      role: formData.role as User["role"],
      avatarColor: getRandomHexColor(),
    };

    register(newUser);
    navigate("/login");
    setFormData({ username: "", password: "", role: "" });
    setConfirmPassword("");
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: "2rem", marginTop: "4rem" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Create Account
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

          <FormControl fullWidth variant="filled">
            <InputLabel>Select User Role</InputLabel>
            <Select value={formData.role} onChange={handleSelectChange}>
              {RoleList.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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

          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={confirmPassword}
            onChange={handleChange}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
