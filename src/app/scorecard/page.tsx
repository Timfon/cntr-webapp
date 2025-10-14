"use client";
import React, { useState } from "react";
import { auth } from "@/firebase";
import { backendFirebase } from "@/backend/firebase";

import {
  Box,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

import ResponsiveAppBar from "@/components/ResponsiveAppBar";
import Footer from "@/components/Footer";

import ScorecardSidebar from "@/components/ScorecardSidebar";
import QuestionCard from "@/components/QuestionCard";
import NotesSection from "@/components/NotesSection";
import NavigationButtons from "@/components/NavigationButtons";
import SubmissionPage from "./submission";

import { sections } from "../data/sections";
import { questionBank } from "../data/questionBank";
import { validateAllAnswers } from "./scoreCardUtils";
// import "@fontsource/rubik/400.css";
// import "@fontsource/rubik/500.css";
// import "@fontsource/rubik/700.css";

export default function ScorecardPage() {
  const [currentSection, setCurrentSection] = useState("general");
  const [answers, setAnswers] = useState({});
  const [selectedBill, setSelectedBill] = useState('');

  // flags is a map from question number to boolean (whether it's filled out or not)
  const [flags, setFlags] = useState({});
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);


  const router = useRouter();
  const currentIndex = sections.findIndex((s) => s.id === currentSection);
  const currentSectionData = sections[currentIndex];
  const currentQuestions = questionBank[currentSection] || [];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/signin");
      } else {
        // Fetch saved progress
        const data = await backendFirebase.getProgress(user.uid);

        if (data) {
          setAnswers(data.answers || {});
          setFlags(data.flags || {});
          setNotes(data.notes || {});
          setCurrentSection(data.currentSection || "general");
          setSelectedBill(data.selectedBill || data.answers?.['00'] || ''); // fallback
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

  if (loading) {
    return <div></div>;
  }

  const saveProgress = async (newData) => {
    const user = auth.currentUser;
    if (!user) return;

    await backendFirebase.saveProgress(user.uid, {
      answers,
      flags,
      notes,
      currentSection,
      ...newData,
    });
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => {
      const updated = { ...prev, [questionId]: answer };
      saveProgress({ answers: updated });
      return updated;
    });
     if (questionId === '00') {
      setSelectedBill(answer);
      saveProgress({ selectedBill: answer });

    }
  };

  const handleFlag = (questionId) => {
    setFlags((prev) => {
      const updated = { ...prev, [questionId]: !prev[questionId] };
      saveProgress({ flags: updated });
      return updated;
    });
  };

  const handleNotesChange = (sectionId, value) => {
    const newNotes = { ...notes, [sectionId]: value };
    setNotes(newNotes);
    saveProgress({ notes: newNotes });
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
    // Check if all questions are answered
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
    
    await backendFirebase.submitForm({
      answers,
      flags,
      notes,
      submittedAt: new Date().toISOString(),
      uid: user.uid,
      email: user.email,
    });

    // Clear saved progress
    await backendFirebase.clearProgress(user.uid);

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
              selectedBill={selectedBill}
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
