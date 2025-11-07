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
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/backend/auth";
import { colors } from "@/app/theme/colors";

type ResetStatus = "checking" | "ready" | "error" | "success";

const ResetPassword: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const mode = searchParams.get("mode");
  const fallbackEmail = searchParams.get("email") ?? "";

  const [status, setStatus] = useState<ResetStatus>("checking");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!oobCode || mode !== "resetPassword") {
      setError("Invalid or missing password reset code.");
      setStatus("error");
      return;
    }

    let isMounted = true;

    const verify = async () => {
      setStatus("checking");
      const result = await authService.verifyPasswordResetCode(oobCode);
      if (!isMounted) return;

      if (result.success) {
        setEmail(result.email || fallbackEmail);
        setStatus("ready");
      } else {
        setError(result.error || "Reset link has expired or is invalid.");
        setStatus("error");
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [fallbackEmail, mode, oobCode]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!oobCode) {
      setError("Missing reset code. Please request a new reset link.");
      return;
    }

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

    const result = await authService.confirmPasswordReset(
      oobCode,
      newPassword.trim()
    );

    setLoading(false);

    if (result.success) {
      setSuccess("Your password has been reset. You can now sign in.");
      setStatus("success");
      setNewPassword("");
      setConfirmPassword("");
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
