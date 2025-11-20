"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { billService, submissionService } from "@/backend/database";
import Loading from "@/app/components/Loading";
import ResponsiveAppBar from "@/app/components/ResponsiveAppBar";
import Footer from "@/app/components/Footer";
import ScoringSummary from "@/app/scorecard/ScoringSummary";
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
import { colors } from "@/app/theme/colors";

function ViewSubmissionContent() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const billParam = searchParams.get("bill");

  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState<any>(null);
  const [billDetails, setBillDetails] = useState<any>(null);

  useEffect(() => {
    const initialize = async () => {
      if (authLoading) {
        return;
      }

      if (!user) {
        setLoading(false);
        return;
      }

      if (!billParam) {
        router.push("/dashboard");
        return;
      }

      const decodedBill = decodeURIComponent(billParam);

      try {
        // Fetch bill details first
        const bill = await billService.getBill(decodedBill);
        if (bill) {
          setBillDetails(bill);
        }

        // Fetch user's submission for this bill
        const userSubmissions = await submissionService.getUserSubmissions(user.id);
        const submissionData = userSubmissions.find(s => s.bill_id === decodedBill);

        if (!submissionData) {
          alert("Submission not found for this bill.");
          router.push("/dashboard");
          return;
        }

        setSubmission(submissionData);
      } catch (error) {
        console.error("Error loading submission:", error);
        alert("Failed to load submission.");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [user, authLoading, router, billParam]);

  if (loading || authLoading) {
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
          backgroundColor: colors.background.main,
          position: "relative",
          p: 3,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* Main Content */}
        <Box sx={{ maxWidth: 900, width: "100%" }}>
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
              variant="h4"
              component="h1"
              sx={{
                textAlign: "center",
                mb: 2,
                fontWeight: "bold",
                color: colors.text.primary,
                pt: 4,
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
                      backgroundColor: colors.background.white,
                      "&:before": {
                        display: "none",
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        backgroundColor: colors.background.white,
                        borderRadius: "12px",
                        "&:hover": {
                          backgroundColor: colors.border.lighter,
                        },
                        "&.Mui-expanded": {
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 0,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Typography
                          sx={{
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
                            ml: 2,
                          }}
                          color={
                            answeredCount === totalCount ? "success" : "default"
                          }
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
                            <TableRow
                              sx={{ backgroundColor: colors.neutral.gray100 }}
                            >
                              <TableCell
                                sx={{
                                  fontWeight: 600,
                                  borderBottom: `1px solid ${colors.border.light}`,
                                }}
                              >
                                Section
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: 600,
                                  borderBottom: `1px solid ${colors.border.light}`,
                                }}
                              >
                                Question
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: 600,
                                  borderBottom: `1px solid ${colors.border.light}`,
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
                                    backgroundColor: colors.neutral.gray50,
                                  },
                                }}
                              >
                                <TableCell
                                  sx={{
                                    borderBottom: `1px solid ${colors.border.light}`,
                                  }}
                                >
                                  {section.name}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    borderBottom: `1px solid ${colors.border.light}`,
                                  }}
                                >
                                  {question.id}. {question.text}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    borderBottom: `1px solid ${colors.border.light}`,
                                    color: question.hasAnswer
                                      ? colors.text.primary
                                      : colors.text.tertiary,
                                    fontStyle: question.hasAnswer
                                      ? "normal"
                                      : "italic",
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
                            borderTop: `2px solid ${colors.status.info}`,
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              mb: 1,
                              color: colors.text.primary,
                            }}
                          >
                            Section Notes
                          </Typography>
                          <Typography
                            sx={{
                              color: colors.text.primary,
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

