"use client";
import React, { useState, useEffect } from "react";
import { auth } from "@/firebase";
import { databaseService } from "@/backend/database";
import { userService } from "@/backend/users";
import Loading from "@/app/components/Loading";
import { questionBank } from "../data/questionBank";
import { filterQuestionsByDependencies, findDependentQuestions } from "./scoreCardUtils";
import { useDebounce } from "./useDebounce";

import {
  Box,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

import ResponsiveAppBar from "@/app/components/ResponsiveAppBar";
import Footer from "@/app/components/Footer";

import ScorecardSidebar from "@/app/components/ScorecardSidebar";
import QuestionCard from "@/app/components/QuestionCard";
import NotesSection from "@/app/components/NotesSection";
import NavigationButtons from "@/app/components/NavigationButtons";
import SubmissionPage from "./submission";

import { sections } from "../data/sections";
import { validateAllAnswers } from "./scoreCardUtils";

export default function ScorecardPage() {
  const [currentSection, setCurrentSection] = useState("general");
  const [answers, setAnswers] = useState({});
  const [selectedBill, setSelectedBill] = useState<string | null>(null);

  // flags is a map from question number to boolean (whether it's filled out or not)
  const [flags, setFlags] = useState({});
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);

  const debouncedAnswers = useDebounce(answers, 2000);
  const debouncedFlags = useDebounce(flags, 2000);
  const debouncedNotes = useDebounce(notes, 2000);


  const router = useRouter();
  const currentIndex = sections.findIndex((s) => s.id === currentSection);
  const currentSectionData = sections[currentIndex];
  const allCurrentQuestions = questionBank[currentSection] || [];
  const currentQuestions = filterQuestionsByDependencies(allCurrentQuestions, answers);
  const version = questionBank.version;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/signin");
      } else {
        const data = await userService.getUser(user.uid);
        if (data && data.inProgress) {
          setAnswers(data.inProgress.answers || {});
          setFlags(data.inProgress.flags || {});
          setNotes(data.inProgress.notes || {});
          setCurrentSection(data.inProgress.currentSection || "general");
          setSelectedBill(data.inProgress.billId || '');
        } else {
          setAnswers({});
          setFlags({});
          setNotes({});
          setCurrentSection("general");
        }

        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(() => {
        saveProgress({ notes });
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [notes, loading]);

  // Debounced save - saves to Firestore after 2 seconds of no changes
  useEffect(() => {
    const user = auth.currentUser;
    if (!user || !selectedBill || loading) return;

    // Only save if there are actual changes (non-empty answers)
    const hasAnswers = Object.keys(debouncedAnswers).length > 0;
    if (hasAnswers) {
      const saveData = async () => {
        try {
          await databaseService.updateUserProgress(
            user.uid,
            selectedBill.split(':')[0],
            debouncedAnswers,
            debouncedFlags,
            debouncedNotes,
            currentSection
          );
        } catch (error) {
          console.error('Error saving progress (debounced):', error);
        }
      };
      saveData();
    }
  }, [debouncedAnswers, debouncedFlags, debouncedNotes, currentSection, selectedBill, loading]);

  if (loading) {
    return <Loading />;
  }

  const saveProgress = async (data, isImmediate = false) => {
    const user = auth.currentUser;
    if (!user || !selectedBill) return;
    
    try {
      const updatedAnswers = data.answers ? { ...answers, ...data.answers } : answers;
      const updatedFlags = data.flags ? { ...flags, ...data.flags } : flags;
      const updatedNotes = data.notes ? { ...notes, ...data.notes } : notes;
      
      if (isImmediate) {
        await databaseService.updateUserProgress(
          user.uid, 
          selectedBill.split(':')[0],
          updatedAnswers, 
          updatedFlags, 
          updatedNotes, 
          currentSection
        );
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleAnswer = (questionId, answer) => {
    if (questionId === "00") {
      setSelectedBill(answer);
      saveProgress({ answers: { "00": answer } }, true);
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
    // Debounced save will handle saving to Firestore
  };

  const handleFlag = (questionId) => {
    setFlags((prev) => {
      const updated = { ...prev, [questionId]: !prev[questionId] };
      return updated;
    });
  };

  const handleNotesChange = (sectionId, value) => {
    setNotes({ ...notes, [sectionId]: value });
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
    if (!user) return;
    
    const submissionId = await databaseService.createSubmission({
      version: version,
      billId: selectedBill?.split(':')[0] || '',
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
        [selectedBill?.split(':')[0] || '']: submissionId
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
router.push("/"); // next/navigation router is cleaner than window.location.href

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
        //drop shadow
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',

        fontSize: '1rem',
        maxWidth: 300,
        whiteSpace: 'normal',
        wordBreak: 'break-word'
      }}
      >
      {selectedBill || 'No bill selected'}
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
              {currentQuestions.map((question) => (
                <QuestionCard
                  key={question.id}
                  id={`question-${question.id}`}
                  question={question}
                  answer={answers[question.id]}
                  flagged={flags[question.id]}
                  onAnswer={handleAnswer}
                  onFlag={handleFlag}
                />
              ))}
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
      </Box>
      <Footer />
    </Box>
  );
}
