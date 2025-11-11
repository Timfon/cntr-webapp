"use client";
import * as React from "react";
import { Box, Container } from "@mui/material";
import ResponsiveAppBar from "@/app/components/ResponsiveAppBar";
import Footer from "@/app/components/Footer";
import "@fontsource/rubik";
import Settings from "@/app/settings/Settings";
import { colors } from "@/app/theme/colors";

export default function SettingsPage() {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: colors.background.main }}>
      <ResponsiveAppBar />
      <Container maxWidth={false} sx={{ py: 4, px: 4 }}>
        <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
          <Settings />
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}
