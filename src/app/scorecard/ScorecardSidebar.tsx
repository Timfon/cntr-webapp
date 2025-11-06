import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { sections } from "@/app/data/sections";
import { questionBank } from "@/app/data/questionBank";
import { getIsFlagged, getIsInProgress, filterQuestionsByDependencies } from "@/app/scorecard/scoreCardUtils";
import { TbProgress } from "react-icons/tb";
import { FaCheck } from "react-icons/fa6";

const ScorecardSidebar = ({
  currentSection,
  onSectionChange,
  answers,
  flags,
  saveProgress,
}) => {
  const getIcon = (section: any) => {
    if (section.id === "submit") {
      return null;
    }
    
    const hasFlagged = getIsFlagged(section.id, flags, answers);
    const inProgress = getIsInProgress(section.id, answers, flags);
    const sectionQuestions = questionBank[section.id] || [];
    const visibleQuestions = filterQuestionsByDependencies(sectionQuestions, answers);
    const hasAnswers = visibleQuestions.some(q => answers[q.id] !== undefined);
    
    // 1. If section has not been started yet, grey circle
    if (!hasAnswers) {
      return <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#e0e0e0' }}></div>;
    }
    
    // 2. If user flagged 1 or more questions, red exclamation point
    if (hasFlagged) {
      return <ErrorOutlineIcon sx={{ color: "#d32f2f", fontSize: "1.25rem" }} />;
    }
    
    // 3. If user did not answer all questions, incomplete logo (progress icon)
    if (inProgress) {
      return <TbProgress size={20} color="#afafaf" />;
    }
    
    // 4. If all questions have been answered, green check
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
              saveProgress({ currentSection: section.id });
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.9rem",
                fontWeight: 500,
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
