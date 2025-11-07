"use client";

import * as React from "react";
import { Box } from "@mui/material";
import ResponsiveAppBar from "@/app/components/ResponsiveAppBar";
import Footer from "@/app/components/Footer";
import ResetPassword from "@/app/reset-password/ResetPassword";
import "@fontsource/rubik";

export default function ResetPasswordPage() {
  return (
    <Box>
      <ResponsiveAppBar />
      <Box
        sx={{
          backgroundColor: "#D9E8DF",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ResetPassword />
      </Box>
      <Footer />
    </Box>
  );
}
