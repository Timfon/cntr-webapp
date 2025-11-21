"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import Loading from "@/app/components/Loading";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/backend/users";
import { colors } from "@/app/theme/colors";

export default function Settings() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // User data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const loadUserProfile = async () => {
      if (authLoading) {
        return;
      }

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userProfile = await userService.getUser(user.id);
        if (userProfile) {
          setName(userProfile.name || "");
          setEmail(user.email || "");
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [user, authLoading]);

  const handleSave = async () => {
    if (!user) {
      setError("No user logged in");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await userService.updateUser(user.id, user.id, {
        name: name,
      });
      setSuccess("Settings updated successfully");
    } catch (error: unknown) {
      console.error("Error updating settings:", error);
      setError("Failed to update settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || authLoading) {
    return <Loading />;
  }

  return (
    <Box
      sx={{
        backgroundColor: colors.background.card,
        borderRadius: 3,
        border: `1px solid ${colors.border.lighter}`,
        boxShadow: "0px 10px 30px rgba(12, 100, 49, 0.05)",
        width: "100%",
        p: { xs: 3, sm: 4 },
      }}
    >
      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          mb: 1,
          color: colors.text.primary,
          fontWeight: 100,
        }}
      >
        Settings
      </Typography>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Profile Information Section */}
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          color: colors.text.primary,
          fontWeight: 600,
        }}
      >
        Profile Information
      </Typography>

      <Box sx={{ maxWidth: 600 }}>
        {/* Name */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            sx={{ mb: 0.5, fontWeight: 500, color: colors.text.secondary }}
          >
            Name
          </Typography>
          <TextField
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: colors.background.white,
              },
            }}
          />
        </Box>

        {/* Email Address */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="body2"
            sx={{ mb: 0.5, fontWeight: 500, color: colors.text.secondary }}
          >
            Email Address
          </Typography>
          <TextField
            fullWidth
            type="email"
            value={email}
            disabled
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: colors.background.main,
              },
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: colors.text.primary,
                color: colors.text.primary,
              },
            }}
          />
        </Box>
      </Box>

      {/* Save Button */}
      <Button
        variant="contained"
        onClick={handleSave}
        disabled={saving}
        sx={{
          backgroundColor: colors.primary,
          color: colors.text.white,
          px: 4,
          py: 1,
          "&:hover": {
            backgroundColor: colors.primaryHover,
          },
          "&:disabled": {
            backgroundColor: colors.text.disabled,
          },
        }}
      >
        {saving ? "Saving..." : "Save"}
      </Button>
    </Box>
  );
}
