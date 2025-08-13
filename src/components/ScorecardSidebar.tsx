import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { sections } from "@/app/data/sections";
import { getIsFlagged, getIsInProgress } from "@/app/scorecard/scoreCardUtils";
import { TbProgress } from "react-icons/tb";
import { FaCheck } from "react-icons/fa6";

const ScorecardSidebar = ({
  currentSection,
  onSectionChange,
  answers,
  flags,
}) => {
  const getIcon = (section: any) => {
    const hasFlagged = getIsFlagged(section.id, flags);
    const inProgress = getIsInProgress(section.id, answers, flags);
    if (hasFlagged) {
      return <ErrorOutlineIcon sx={{ color: "black", fontSize: "1.25rem" }} />;
    }
    if (inProgress) {
      return <TbProgress size={20} color="#afafaf" />;
    }
    if (section.name === "Submission") {
      return <div style={{ width: 20, height: 20 }}></div>;
    }
    return <FaCheck size={20} color="#1d8f3b" />;
  };
  return (
    <Paper
      sx={{
        mr: 6,
        position: "sticky",
        top: 200,
        left: 24,
        width: 300,
        height: "calc(100vh - 230px)", //Adjust height to account for top offset and bottom margin
        backgroundColor: "white",
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* <Box
    sx={{
      p: 1.5,
      m: 2, // gives separation from Paper edges
      borderRadius: 2,
      backgroundColor: "#fff",
      fontFamily: "Rubik, sans-serif",
      fontWeight: 500,
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      fontSize: "1rem",
      whiteSpace: "normal",
      wordBreak: "break-word",
    }}
  >
    {selectedBill || "No bill selected"}
  </Box> */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          mt: 2,
          // Add padding to prevent content from touching edges during scroll
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            borderRadius: "3px",
          },
        }}
      >
        {sections.map((section) => (
          <Box
            key={section.id}
            sx={{
              pl: 2.5,
              pr: 2,
              py: 2.5,
              cursor: "pointer",
              backgroundColor:
                currentSection === section.id ? "#CEE7BD" : "transparent",
              borderRadius: "12px",
              margin: "5px 19px",
              position: "relative",
              overflow: "hidden",
              "&:hover": {
                backgroundColor:
                  currentSection === section.id
                    ? "#CEE7BD"
                    : "rgba(0, 0, 0, 0.02)",
              },
              "&:active": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "all 0.15s ease-out",
            }}
            onClick={() => {
              onSectionChange(section.id);
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.9rem",
                fontWeight: 500,
                fontFamily: "Rubik-Medium, sans-serif",
                color: currentSection === section.id ? "#1b5e20" : "inherit",
              }}
            >
              {section.name}
            </Typography>
            {getIcon(section)}
            {/*    
            {getSectionWarnings(section.id, answers, flags) && (
              <TbProgress />
              // <ErrorOutlineIcon sx={{ color: 'black', fontSize: '1.5rem' }} />
            )} */}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default ScorecardSidebar;
