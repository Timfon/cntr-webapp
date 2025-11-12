"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import Loading from "@/app/components/Loading";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { userService } from "@/backend/users";
import { useRouter } from "next/navigation";
import { colors } from "@/app/theme/colors";

export default function Settings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);  
  const [success, setSuccess] = useState<string | null>(null);

  // User data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userProfile = await userService.getUserProfile(user.uid);
          if (userProfile) {
            setFirstName(userProfile.firstName || "");
            setLastName(userProfile.lastName || "");
            setEmail(user.email || "");
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
          setError("Failed to load user profile");
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/signin");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("No user logged in");
        setSaving(false);
        return;
      }

      await userService.updateUser({
        uid: user.uid,
        firstName: firstName,
        lastName: lastName,
      });

      setSuccess("Settings updated successfully");
    } catch (error: any) {
      console.error("Error updating settings:", error);
      setError("Failed to update settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
        {/* First Name */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            sx={{ mb: 0.5, fontWeight: 500, color: colors.text.secondary }}
          >
            First Name
          </Typography>
          <TextField
            fullWidth
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: colors.background.white,
              },
            }}
          />
        </Box>

        {/* Last Name */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            sx={{ mb: 0.5, fontWeight: 500, color: colors.text.secondary }}
          >
            Last Name
          </Typography>
          <TextField
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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
