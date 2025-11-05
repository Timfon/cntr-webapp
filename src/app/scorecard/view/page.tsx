"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/firebase";
import { databaseService } from "@/backend/database";
import { onAuthStateChanged } from "firebase/auth";
import Loading from "@/app/components/Loading";
import ResponsiveAppBar from "@/app/components/ResponsiveAppBar";
import Footer from "@/app/components/Footer";
import ScoringSummary from "@/app/components/ScoringSummary";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { sections } from "@/app/data/sections";
import { questionBank } from "@/app/data/questionBank";

function ViewSubmissionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionIdParam = searchParams.get("submission");

  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState<any>(null);
  const [billDetails, setBillDetails] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/signin");
        return;
      }

      if (!submissionIdParam) {
        router.push("/dashboard");
        return;
      }

      try {
        // Fetch submission
        const submissionData = await databaseService.getSubmission(
          decodeURIComponent(submissionIdParam)
        );

        if (!submissionData) {
          alert("Submission not found.");
          router.push("/dashboard");
          return;
        }

        setSubmission(submissionData);

        // Fetch bill details
        if (submissionData.billId) {
          try {
            const bill = await databaseService.getBill(submissionData.billId);
            if (bill) {
              setBillDetails(bill);
            }
          } catch (error) {
            console.error("Error fetching bill details:", error);
          }
        }
      } catch (error) {
        console.error("Error loading submission:", error);
        alert("Failed to load submission.");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, submissionIdParam]);

  if (loading) {
    return <Loading />;
  }

  if (!submission) {
    return null;
  }

  // Calculate summary statistics
  const allQuestions = Object.entries(questionBank).flatMap(
    ([sectionId, questions]) =>
      Array.isArray(questions)
        ? questions.map((q) => ({ ...q, sectionId }))
        : []
  );

  const answers = submission.answers || {};
  const notes = submission.notes || {};

  const totalQuestions = allQuestions.length;
  const answeredQuestions = allQuestions.filter(
    (q) => answers[q.id] !== undefined
  ).length;

  // Calculate completed sections
  const completedSections = sections
    .filter((section) => {
      if (section.id === "submit") return false;
      const sectionQuestions = questionBank[section.id] || [];
      return (
        sectionQuestions.length > 0 &&
        sectionQuestions.every((q) => answers[q.id] !== undefined)
      );
    })
    .length;

  const sectionsWithNotes = Object.keys(notes).filter(
    (sectionId) => notes[sectionId]?.trim()
  ).length;

  // Get questions grouped by section for display
  const getSectionQuestions = (sectionId: string) => {
    return (questionBank[sectionId] || []).map((question: any) => ({
      ...question,
      answer: answers[question.id],
      hasAnswer: answers[question.id] !== undefined,
    }));
  };

  // Format answer for display
  const formatAnswer = (answer: any): string => {
    if (answer === undefined || answer === null) {
      return "Not answered";
    }
    if (typeof answer === "boolean") {
      return answer ? "Yes" : "No";
    }
    if (typeof answer === "string") {
      return answer;
    }
    if (Array.isArray(answer)) {
      return answer.join(", ");
    }
    return String(answer);
  };

  return (
    <Box>
      <ResponsiveAppBar />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#F6FBF7",
          position: "relative",
          p: 3,
          display: "flex",
        }}
      >
        {/* Left Sidebar */}
        <Box>
          <Box
            sx={{
              p: 1.5,
              mb: 2,
              borderRadius: 2,
              position: "sticky",
              top: 30,
              backgroundColor: "#ffffffff",
              fontFamily: "Rubik, sans-serif",
              fontWeight: 500,
              color: "#333333",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              fontSize: "1rem",
              maxWidth: 300,
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            {billDetails ? (
              <>
                <Box
                  sx={{
                    fontWeight: 600,
                    mb: 0.5,
                    fontSize: "0.85rem",
                    color: "#4CAF50",
                  }}
                >
                  {billDetails.state} {billDetails.type}
                  {billDetails.number} ({billDetails.year})
                </Box>
                <Box sx={{ fontSize: "0.9rem", color: "#666" }}>
                  {billDetails.name}
                </Box>
              </>
            ) : (
              <Box>Bill: {submission.billId}</Box>
            )}
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ maxWidth: 800, flex: 1, ml: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mb: 2,
              fontFamily: "Rubik-Bold, sans-serif",
              color: "#333333",
            }}
          >
            View Submission
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 4,
              fontFamily: "Rubik, sans-serif",
              color: "#666",
              lineHeight: 1.6,
            }}
          >
            Here is a summary of your completed submission for this bill. Past submissions cannot be edited. 
          </Typography>

          <ScoringSummary
            completedSections={completedSections}
            totalSections={sections.length - 1}
            answeredQuestions={answeredQuestions}
            totalQuestions={totalQuestions}
            flaggedQuestions={0}
            sectionsWithNotes={sectionsWithNotes}
          />

          {/* Section Accordions */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                mb: 2,
                fontFamily: "Rubik-Bold, sans-serif",
                color: "#333333",
              }}
            >
              Your Answers
            </Typography>

            {sections
              .filter((section) => section.id !== "submit")
              .map((section) => {
                const sectionQuestions = getSectionQuestions(section.id);
                const answeredCount = sectionQuestions.filter(
                  (q) => q.hasAnswer
                ).length;
                const totalCount = sectionQuestions.length;
                const sectionNotes = notes[section.id];

                return (
                  <Accordion
                    key={section.id}
                    sx={{
                      mb: 2,
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      borderRadius: "12px !important",
                      "&:before": {
                        display: "none",
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        backgroundColor: "#f5f5f5",
                        borderRadius: "12px",
                        "&:hover": {
                          backgroundColor: "#eeeeee",
                        },
                        "&.Mui-expanded": {
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 0,
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                        <Typography
                          sx={{
                            fontFamily: "Rubik-Bold, sans-serif",
                            fontWeight: "bold",
                            flex: 1,
                          }}
                        >
                          {section.name}
                        </Typography>
                        <Chip
                          label={`${answeredCount}/${totalCount} answered`}
                          size="small"
                          sx={{
                            fontFamily: "Rubik, sans-serif",
                            ml: 2,
                          }}
                          color={answeredCount === totalCount ? "success" : "default"}
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      <TableContainer
                        component={Paper}
                        sx={{
                          borderRadius: "0 0 12px 12px",
                          boxShadow: "none",
                        }}
                      >
                        <Table>
                          <TableHead>
                            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                              <TableCell
                                sx={{
                                  fontFamily: "Rubik, sans-serif",
                                  fontWeight: 600,
                                  borderBottom: "1px solid #e0e0e0",
                                }}
                              >
                                Section
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontFamily: "Rubik, sans-serif",
                                  fontWeight: 600,
                                  borderBottom: "1px solid #e0e0e0",
                                }}
                              >
                                Question
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontFamily: "Rubik, sans-serif",
                                  fontWeight: 600,
                                  borderBottom: "1px solid #e0e0e0",
                                }}
                              >
                                Answer
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {sectionQuestions.map((question) => (
                              <TableRow
                                key={question.id}
                                sx={{
                                  "&:last-child td": { borderBottom: 0 },
                                  "&:hover": {
                                    backgroundColor: "#fafafa",
                                  },
                                }}
                              >
                                <TableCell
                                  sx={{
                                    fontFamily: "Rubik, sans-serif",
                                    borderBottom: "1px solid #e0e0e0",
                                  }}
                                >
                                  {section.name}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontFamily: "Rubik, sans-serif",
                                    borderBottom: "1px solid #e0e0e0",
                                  }}
                                >
                                  {question.id}. {question.text}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontFamily: "Rubik, sans-serif",
                                    borderBottom: "1px solid #e0e0e0",
                                    color: question.hasAnswer ? "#333" : "#999",
                                    fontStyle: question.hasAnswer ? "normal" : "italic",
                                  }}
                                >
                                  {formatAnswer(question.answer)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      
                      {sectionNotes && sectionNotes.trim() && (
                        <Box
                          sx={{
                            p: 2,
                            backgroundColor: "#e3f2fd",
                            borderTop: "2px solid #2196F3",
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: "Rubik-Bold, sans-serif",
                              fontWeight: "bold",
                              mb: 1,
                              color: "#333",
                            }}
                          >
                            Section Notes
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: "Rubik, sans-serif",
                              color: "#333",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {sectionNotes}
                          </Typography>
                        </Box>
                      )}
                    </AccordionDetails>
                  </Accordion>
                );
              })}
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}

export default function ViewSubmissionPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ViewSubmissionContent />
    </Suspense>
  );
}

