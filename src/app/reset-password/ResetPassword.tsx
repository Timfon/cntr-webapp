"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
} from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/backend/auth";
import { colors } from "@/app/theme/colors";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type ResetStatus = "checking" | "ready" | "error" | "success";

const ResetPassword: React.FC = () => {
  const router = useRouter();

  const [status, setStatus] = useState<ResetStatus>("checking");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      setStatus("checking");

      const supabase = createBrowserSupabaseClient();

      // Listen for password recovery events (in case they land directly here with hash)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          // User clicked password reset link
          if (session?.user) {
            setEmail(session.user.email || "");
            setStatus("ready");
          } else {
            setError("Invalid reset link. Please request a new one.");
            setStatus("error");
          }
        }
      });

      // Check for code parameter first 
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          console.error("Error exchanging code:", exchangeError);
          setError("Invalid or expired reset link. Please request a new one.");
          setStatus("error");
          subscription.unsubscribe();
          return;
        }

        if (data?.user) {
          setEmail(data.user.email || "");
          setStatus("ready");
          // Clean up URL
          window.history.replaceState({}, "", "/reset-password");
        } else {
          setError("Invalid reset link. Please request a new one.");
          setStatus("error");
        }
        subscription.unsubscribe();
        return;
      }

      // Check for existing session (user already authenticated)
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // User has a valid session - allow password reset
        setEmail(session.user.email || "");
        setStatus("ready");
      } else {
        // No session and no code - invalid access
        setTimeout(() => {
          if (status === "checking") {
            setError("Invalid or expired reset link. Please request a new one.");
            setStatus("error");
          }
        }, 1000);
      }

      return () => {
        subscription.unsubscribe();
      };
    };

    checkSession();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword.trim().length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const result = await authService.updatePassword(newPassword.trim());

    setLoading(false);

    if (result.success) {
      setSuccess("Your password has been reset. You can now sign in.");
      setStatus("success");
      setNewPassword("");
      setConfirmPassword("");

      // Sign out after password reset so user can sign in with new password
      await authService.signOut();
    } else {
      setError(result.error || "Failed to reset password. Please try again.");
    }
  };

  const renderContent = () => {
    if (status === "checking") {
      return (
        <Typography variant="body1" sx={{ textAlign: "center", mb: 0 }}>
          Validating your reset link...
        </Typography>
      );
    }

    if (status === "error") {
      return (
        <>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          <Typography variant="body2" sx={{ textAlign: "center", mb: 3 }}>
            You can request a new reset link below.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={() => router.push("/forgot-password")}
            sx={{
              py: 1.5,
              backgroundColor: colors.primary,
              "&:hover": {
                backgroundColor: colors.primaryHover,
              },
            }}
          >
            Request new reset link
          </Button>
          <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
            <Link
              component={NextLink}
              href="/signin"
              underline="hover"
              sx={{ fontWeight: 500 }}
            >
              Back to Sign In
            </Link>
          </Typography>
        </>
      );
    }

    if (status === "success") {
      return (
        <>
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}
          <Button
            fullWidth
            variant="contained"
            onClick={() => router.push("/signin")}
            sx={{
              py: 1.5,
              backgroundColor: colors.primary,
              "&:hover": {
                backgroundColor: colors.primaryHover,
              },
            }}
          >
            Go to Sign In
          </Button>
        </>
      );
    }

    return (
      <>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Typography
          variant="body2"
          sx={{ textAlign: "center", mb: 3, color: colors.text.secondary }}
        >
          {email
            ? `Resetting password for ${email}`
            : "Enter your new password below."}
        </Typography>

        <TextField
          fullWidth
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          disabled={loading}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
          sx={{ mb: 3 }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            py: 1.5,
            backgroundColor: colors.primary,
            "&:hover": {
              backgroundColor: colors.primaryHover,
            },
          }}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </Button>

        <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
          <Link
            component={NextLink}
            href="/signin"
            underline="hover"
            sx={{ fontWeight: 500 }}
          >
            Back to Sign In
          </Link>
        </Typography>
      </>
    );
  };

  return (
    <Box
      component="form"
      onSubmit={status === "ready" ? handleSubmit : undefined}
      sx={{
        backgroundColor: colors.background.white,
        p: 4,
        boxShadow: 3,
        width: "100%",
        maxWidth: 400,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <img src="/cntr_logo.png" alt="CNTR logo" style={{ height: 50 }} />
      </Box>

      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          mb: 1,
          color: colors.primary,
        }}
      >
        Reset Password
      </Typography>

      {renderContent()}
    </Box>
  );
};

export default ResetPassword;
