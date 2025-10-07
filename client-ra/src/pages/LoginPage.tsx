// src/pages/LoginPage.tsx
import * as React from "react";
import { useLogin, Notification } from "react-admin";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

const LoginPage: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const login = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Chú ý: useLogin mặc định truyền username, password
      await login({ username: email, password });
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Card sx={{ width: 400, p: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Sign in
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Notification />
    </Box>
  );
};

export default LoginPage;
