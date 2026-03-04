import { Typography, Box } from "@mui/material";

export const FallBackUI = ({ error }: { error: Error }) => (
  <Box
    sx={{
      padding: "1.5rem",
      border: "0.0625rem solid red",
      borderRadius: "0.5rem",
      textAlign: "center",
    }}
  >
    <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
      Something went wrong in this section.
    </Typography>

    <Typography color="error" sx={{ marginBottom: "1.25rem" }}>
      {error.message}
    </Typography>
  </Box>
);
