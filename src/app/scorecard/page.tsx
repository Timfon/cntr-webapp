"use client";
import React, { useState, useEffect, Suspense } from "react";
import { auth } from "@/firebase";
import { databaseService } from "@/backend/database";
import { userService } from "@/backend/users";
import Loading from "@/app/components/Loading";
import { questionBank } from "../data/questionBank";
import { filterQuestionsByDependencies, findDependentQuestions } from "./scoreCardUtils";

import {
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

import ResponsiveAppBar from "@/app/components/ResponsiveAppBar";
import Footer from "@/app/components/Footer";

import ScorecardSidebar from "@/app/components/ScorecardSidebar";
import QuestionCard from "@/app/components/QuestionCard";
import NotesSection from "@/app/components/NotesSection";
import NavigationButtons from "@/app/components/NavigationButtons";
import SubmissionPage from "./submission";
import GlossaryPanel from "@/app/components/GlossaryPanel";

import { sections } from "../data/sections";
import { validateAllAnswers } from "./scoreCardUtils";

function ScorecardContent() {
  const [currentSection, setCurrentSection] = useState("general");
  const [answers, setAnswers] = useState({});
  const [selectedBill, setSelectedBill] = useState<string | null>(null);

  // flags is a map from question number to boolean
  const [flags, setFlags] = useState({});
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [billDetails, setBillDetails] = useState<any>(null);
  const [glossaryOpen, setGlossaryOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const billParam = searchParams.get('bill');
  const decodedBill = billParam ? decodeURIComponent(billParam) : null;
  
  const currentIndex = sections.findIndex((s) => s.id === currentSection);
  const currentSectionData = sections[currentIndex];
  const allCurrentQuestions = questionBank[currentSection] || [];
  const currentQuestions = filterQuestionsByDependencies(allCurrentQuestions, answers);
  const version = questionBank.version;

  // Helper: Find which section a question belongs to
  const getSectionForQuestion = (questionId: string): string => {
    for (const section of sections) {
      if (section.id === 'submit') continue;
      const sectionQuestions = questionBank[section.id] || [];
      if (sectionQuestions.some((q: any) => q.id === questionId)) {
        return section.id;
      }
    }
    return 'general';
  };

  // Convert flat answers to nested structure for database
  const convertToNestedAnswers = (flatAnswers: Record<string, any>): Record<string, Record<string, any>> => {
    const nested: Record<string, Record<string, any>> = {};
    Object.entries(flatAnswers).forEach(([questionId, answer]) => {
      const sectionId = getSectionForQuestion(questionId);
      if (!nested[sectionId]) {
        nested[sectionId] = {};
      }
      nested[sectionId][questionId] = answer;
    });
    return nested;
  };

  // Flatten nested answers to flat structure
  const flattenAnswers = (nestedAnswers: Record<string, Record<string, any>>): Record<string, any> => {
    const flat: Record<string, any> = {};
    Object.entries(nestedAnswers).forEach(([sectionId, sectionAnswers]) => {
      if (typeof sectionAnswers === 'object' && sectionAnswers !== null && !Array.isArray(sectionAnswers)) {
        Object.entries(sectionAnswers).forEach(([questionId, answer]) => {
          flat[questionId] = answer;
        });
      }
    });
    return flat;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/signin");
        return;
      }

      // bill has to be preselected
      if (!billParam || !decodedBill) {
        router.push("/dashboard");
        return;
      }
      
      // Fetch saved progress
      const data = await userService.getUser(user.uid);
      
      // Get bill details from database to show proper name
      let billName = decodedBill;
      try {
        const details = await databaseService.getBill(decodedBill);
        if (details) {
          setBillDetails(details);
          billName = details.title || details.name || decodedBill;
          setSelectedBill(billName);
        } else {
          setSelectedBill(decodedBill);
        }
      } catch (error) {
        setSelectedBill(decodedBill);
      }
      
      // If there's existing progress for this bill, load it
      if (data?.inProgress && data.inProgress.billId === decodedBill) {
        // Convert nested answers back to flat structure
        const nestedAnswers = data.inProgress.answers || {};
        let existingAnswers: Record<string, any> = {};
        
        // Check if answers are nested or already flat (backward compatibility)
        if (typeof nestedAnswers === 'object' && !Array.isArray(nestedAnswers)) {
          // Check if it's nested structure (has section keys like 'general', 'impact', etc.)
          const hasSectionKeys = Object.keys(nestedAnswers).some(key => 
            sections.some(s => s.id === key && s.id !== 'submit')
          );
          if (hasSectionKeys) {
            existingAnswers = flattenAnswers(nestedAnswers as Record<string, Record<string, any>>);
          } else {
            // Already flat, use as-is
            Object.assign(existingAnswers, nestedAnswers);
          }
        } else {
          existingAnswers = nestedAnswers;
        }
        
        // Ensure question 00 is answered (bill is always pre-selected)
        if (!existingAnswers['00']) {
          existingAnswers['00'] = billName;
          // Save the updated answer to progress
          setTimeout(async () => {
            try {
              const user = auth.currentUser;
              if (user && billName) {
                const nestedAnswers = convertToNestedAnswers(existingAnswers);
                await databaseService.updateUserProgress(
                  user.uid,
                  decodedBill,
                  nestedAnswers,
                  data.inProgress?.flags || {},
                  data.inProgress?.notes || {},
                  data.inProgress?.currentSection || "general"
                );
              }
            } catch (error) {
              console.error('Error saving question 00 answer:', error);
            }
          }, 100);
        }
        setAnswers(existingAnswers);
        setFlags(data.inProgress.flags || {});
        setNotes(data.inProgress.notes || {});
        setCurrentSection(data.inProgress.currentSection || "general");
      } else {
        // New bill - start fresh with bill pre-selected (auto-answer question 00)
        const initialAnswers = { '00': billName };
        setAnswers(initialAnswers);
        setFlags({});
        setNotes({});
        setCurrentSection("general");
        // Save the initial answer to progress
        setTimeout(async () => {
          try {
            const user = auth.currentUser;
            if (user && billName) {
              const nestedAnswers = convertToNestedAnswers(initialAnswers);
              await databaseService.updateUserProgress(
                user.uid,
                decodedBill,
                nestedAnswers,
                {},
                {},
                "general"
              );
            }
          } catch (error) {
            console.error('Error saving initial question 00 answer:', error);
          }
        }, 100);
      }

      setLoading(false);
    });
    return () => unsubscribe();
  }, [router, billParam]);


  if (loading) {
    return <Loading />;
  }

  const saveProgress = async (data) => {
    const user = auth.currentUser;
    if (!user || !decodedBill) return;
    
    try {
      const updatedAnswers = data.answers ? { ...answers, ...data.answers } : answers;
      const updatedFlags = data.flags ? { ...flags, ...data.flags } : flags;
      const updatedNotes = data.notes ? { ...notes, ...data.notes } : notes;
      
      // Convert flat answers to nested structure for database
      const nestedAnswers = convertToNestedAnswers(updatedAnswers);
      
      await databaseService.updateUserProgress(
        user.uid, 
        decodedBill,
        nestedAnswers, 
        updatedFlags, 
        updatedNotes, 
        currentSection
      );
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleAnswer = (questionId, answer) => {
    if (questionId === "00") {
      setSelectedBill(answer);
      saveProgress({ answers: { "00": answer } });
      return;
    }
    
    let updatedAnswers = { ...answers, [questionId]: answer };
    
    // If the answer is "No" or "N/A", clear dependent question answers
    if (answer === 'no' || answer === 'N/A') {
      const dependentQuestions = findDependentQuestions(questionId);
      
      dependentQuestions.forEach((dependentId) => {
        updatedAnswers[dependentId] = ['N/A'];
      });
      
      const updatedFlags = { ...flags };
      dependentQuestions.forEach((dependentId) => {
        delete updatedFlags[dependentId];
      });
      setFlags(updatedFlags);
      
      saveProgress({ 
        answers: updatedAnswers, 
        flags: updatedFlags, 
      });
    } else {
      const dependentQuestions = findDependentQuestions(questionId);
      dependentQuestions.forEach((dependentId) => {
        delete updatedAnswers[dependentId];
      });
    }
    
    setAnswers(updatedAnswers);
    saveProgress({ answers: updatedAnswers });
  };

  const handleFlag = (questionId) => {
    const updated = { ...flags, [questionId]: !flags[questionId] };
    setFlags(updated);
    saveProgress({ flags: updated });
  };

  const handleNotesChange = (sectionId, value) => {
    const updated = { ...notes, [sectionId]: value };
    setNotes(updated);
    saveProgress({ notes: updated });
  };

  const handleSectionChange = (sectionId) => {
    setCurrentSection(sectionId);
  };

  const handleNavigateToQuestion = (sectionId, questionId) => {
    setCurrentSection(sectionId);
    // Scroll to the specific question after a short delay to allow section to load
    setTimeout(() => {
      const element = document.getElementById(`question-${questionId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleNext = async () => {
    if (currentIndex >= 0 && currentIndex < sections.length - 1) {
      handleSectionChange(sections[currentIndex + 1].id);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  const handleSubmit = async () => {
    const firstUnanswered = validateAllAnswers(answers);
    const flaggedQuestions = Object.entries(flags)
      .filter(([_, value]) => value === true)
      .map(([key, _]) => key);

    // If there are unanswered questions or flagged questions, show error
    if (firstUnanswered || flaggedQuestions.length > 0) {
      let errorMessage = "Cannot submit. Please address the following issues:\n\n";
      
      if (firstUnanswered) {
        errorMessage += `• Unanswered questions: ${firstUnanswered.id}\n`;
      }
      
      if (flaggedQuestions.length > 0) {
        errorMessage += `• Flagged questions: ${flaggedQuestions.join(", ")}\n`;
      }
      
      errorMessage += "\nPlease review and complete all questions before submitting.";
      
      alert(errorMessage);
      return;
    }
    const user = auth.currentUser;
    if (!user || !decodedBill) {
      alert('Unable to identify bill. Please try again.');
      return;
    }

    const submissionId = await databaseService.createSubmission({
      version: version,
      billId: decodedBill,
      answers,
      uid: user.uid,
      notes,
      createdAt: new Date().toISOString(),
    });

    // Add bill to completed bills
    const currentUser = await userService.getUser(user.uid);
    await userService.updateUser({
      uid: user.uid,
      completedBills: {
        ...(currentUser?.completedBills || {}),
        [decodedBill]: submissionId
      }
    });

    // Clear saved progress
    await databaseService.clearUserProgress(user.uid);

// Reset local state
setAnswers({});
setFlags({});
setNotes({});
setCurrentSection("general");
setSelectedBill('');

alert("Form submitted!");
window.scrollTo({ top: 0, behavior: "smooth" });
router.push("/dashboard");

  };
  return (
    <Box>
      <ResponsiveAppBar />
      {/* Glossary Toggle Button*/}
      <IconButton
        onClick={() => setGlossaryOpen(!glossaryOpen)}
        sx={{
          position: 'fixed',
          right: glossaryOpen ? 400 : 0,
          top: '120px',
          zIndex: 1400,
          backgroundColor: '#0C6431',
          color: 'white',
          borderRadius: glossaryOpen ? '0' : '8px 0 0 8px',
          width: '48px',
          height: '72px',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            backgroundColor: '#094d26',
          },
          transition: 'right 0.0s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.0s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        title={glossaryOpen ? "Close Glossary" : "Open Glossary"}
      >
        <MenuBookIcon sx={{ fontSize: '28px' }} />
      </IconButton>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#F6FBF7",
          position: "relative",
          p: 3,
          display: "flex",
        }}
      >
        <Box>
          <Box
      sx={{
        p: 1.5,
        mb: 2,
        borderRadius: 2,
        position: "sticky",
        top: 30,
        backgroundColor: '#ffffffff',
        fontFamily: 'Rubik, sans-serif',
        fontWeight: 500,
        color: '#333333',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',

        fontSize: '1rem',
        maxWidth: 300,
        whiteSpace: 'normal',
        wordBreak: 'break-word'
      }}
      >
      {billDetails ? (
        <>
          <Box sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.85rem', color: '#4CAF50' }}>
            {billDetails.state} {billDetails.type}{billDetails.number} ({billDetails.year})
          </Box>
          <Box sx={{ fontSize: '0.9rem', color: '#666' }}>
            {selectedBill || 'No bill selected'}
          </Box>
        </>
      ) : (
        selectedBill || 'No bill selected'
      )}
    </Box>
          <ScorecardSidebar
            currentSection={currentSection}
            onSectionChange={handleSectionChange}
            answers={answers}
            flags={flags}
            saveProgress={saveProgress}
            />
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            // marginLeft: '350px',
            maxWidth: 800,
          }}
        >
          {currentSection === 'submit' ? (
            <SubmissionPage
              answers={answers}
              flags={flags}
              notes={notes}
              onNavigateToQuestion={handleNavigateToQuestion}
              onSubmit={handleSubmit}
              selectedBill={selectedBill || ''}
            />
          ) : (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#333333",
                    mb: 2,
                    mt: 4,
                    fontFamily: "Rubik, sans-serif",
                  }}
                >
                  Section {currentIndex >= 0 ? currentIndex + 1 : 1} of {sections.length}
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "100",
                    color: "#333333",
                    mb: 2,
                    fontFamily: "Rubik-Bold, sans-serif",
                  }}
                >
                  {currentSectionData?.name || 'Unknown Section'}
                </Typography>
              </Box>
              {currentQuestions.map((question) => {
                //bill preselected from dashboard
                if (question.id === '00' && billParam) {
                  return null;
                }
                return (
                  <QuestionCard
                    key={question.id}
                    id={`question-${question.id}`}
                    question={question}
                    answer={answers[question.id]}
                    flagged={flags[question.id]}
                    onAnswer={handleAnswer}
                    onFlag={handleFlag}
                  />
                );
              })}
              <NotesSection
                notes={notes}
                currentSection={currentSection}
                onNotesChange={handleNotesChange}
              />
              <NavigationButtons
                currentSection={currentSection}
                onSectionChange={handleSectionChange}
                onSubmit={handleSubmit}
                onNext={handleNext}
              />
            </>
          )}
        </Box>

        {/* Glossary Panel */}
        <GlossaryPanel open={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
      </Box>
      <Footer />
    </Box>
  );
}

export default function ScorecardPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ScorecardContent />
    </Suspense>
  );
}
