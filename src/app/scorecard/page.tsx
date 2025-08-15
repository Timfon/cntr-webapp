"use client";
import React, { useState } from "react";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";

import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Divider,
  Alert,
  Tooltip,
} from "@mui/material";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import { Flag, FlagOutlined, Warning } from "@mui/icons-material";
import ResponsiveAppBar from "@/components/ResponsiveAppBar";
import Footer from "@/components/Footer";

import ScorecardSidebar from "@/components/ScorecardSidebar";
import QuestionCard from "@/components/QuestionCard";
import NotesSection from "@/components/NotesSection";
import NavigationButtons from "@/components/NavigationButtons";

import { sections } from "../data/sections";
import { questionBank } from "../data/questionBank";
import { validateAllAnswers, validateSectionAnswers } from "./scoreCardUtils";
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
  const currentQuestions = questionBank[currentSection] || [];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/signin");
      } else {
        // Fetch saved progress
        const userDoc = doc(db, "progress", user.uid);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          const data = docSnap.data();
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

    const userDoc = doc(db, "progress", user.uid);
    await setDoc(userDoc, {
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

  const handleNext = async () => {
    const firstUnanswered = validateSectionAnswers(answers, currentSection);
    if (firstUnanswered) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      setCurrentSection(firstUnanswered.sectionId);

      alert(`Please answer all questions before proceeding. Missing: ${firstUnanswered.id}`);
      return;
    }
    handleSectionChange(sections[currentIndex + 1].id);
    window.scrollTo({ top: 0, behavior: 'instant' });
};

  const handleSubmit = async () => {
    const firstUnanswered = validateAllAnswers(answers);
    if (firstUnanswered) {
      setCurrentSection(firstUnanswered.sectionId);
      setTimeout(() => {
      const el = document.getElementById(`question-${firstUnanswered.id}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
      alert(
        `Please answer all questions before submitting. Missing: ${firstUnanswered.id}`
      );
      return;
    }
    const user = auth.currentUser;
    if (!user) return;
    await addDoc(collection(db, "submissions"), {
      answers,
      flags,
      notes,
      submittedAt: new Date().toISOString(),
      uid: user.uid,
      email: user.email,
    });
//go to homepage
    alert("Form submitted!");

    setAnswers({});
    setFlags({});
    setNotes({});
    window.location.href = "/";

    //setCurrentSection("general");

    window.scrollTo({ top: 0, behavior: "smooth" });
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
          <Typography
            variant="body2"
            sx={{
              color: "#666",
              mb: 2,
              mt: 4,
              fontFamily: "Rubik, sans-serif",
            }}
          >
            Section {currentIndex + 1} of {sections.length}
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: "100",
              mb: 2,
              fontFamily: "Rubik-Bold, sans-serif",
            }}
          >
            {sections[currentIndex].name}
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
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
