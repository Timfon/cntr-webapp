'use client';

import { Suspense } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useState } from 'react';

import ResponsiveAppBar from '@/app/components/ResponsiveAppBar';
import Footer from '@/app/components/Footer';
import Loading from '@/app/components/Loading';
import ScorecardSidebar from '@/app/scorecard/ScorecardSidebar';
import QuestionCard from '@/app/scorecard/QuestionCard';
import NotesSection from '@/app/scorecard/NotesSection';
import NavigationButtons from '@/app/components/NavigationButtons';
import SubmissionPage from './submission';
import GlossaryPanel from '@/app/components/GlossaryPanel';
import BillInfoHeader from './BillInfoHeader';

import { useScorecardData } from './useScorecardData';
import { questionBank } from '../data/questionBank';
import { sections } from '../data/sections';
import { filterQuestionsByDependencies } from './scoreCardUtils';
import { colors } from '@/app/theme/colors';

function ScorecardContent() {
  const [glossaryOpen, setGlossaryOpen] = useState(false);

  const {
    loading,
    currentSection,
    answers,
    flags,
    notes,
    selectedBill,
    billDetails,
    decodedBill,
    setCurrentSection,
    handleAnswer,
    handleFlag,
    handleNotesChange,
    handleSubmit,
    saveProgress,
  } = useScorecardData();

  const currentIndex = sections.findIndex(s => s.id === currentSection);
  const currentSectionData = sections[currentIndex];
  const allCurrentQuestions = questionBank[currentSection] || [];
  const currentQuestions = filterQuestionsByDependencies(allCurrentQuestions, answers);

  if (loading) {
    return <Loading />;
  }

  const handleSectionChange = (sectionId: string) => {
    setCurrentSection(sectionId);
  };

  const handleNavigateToQuestion = (sectionId: string, questionId: string) => {
    setCurrentSection(sectionId);
    setTimeout(() => {
      const element = document.getElementById(`question-${questionId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < sections.length - 1) {
      handleSectionChange(sections[currentIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  return (
    <Box>
      <ResponsiveAppBar />

      {/* Glossary Toggle Button */}
      <IconButton
        onClick={() => setGlossaryOpen(!glossaryOpen)}
        sx={{
          position: 'fixed',
          right: glossaryOpen ? 320 : 0,
          top: '120px',
          zIndex: 1400,
          backgroundColor: colors.primary,
          color: 'white',
          borderRadius: glossaryOpen ? '0' : '8px 0 0 8px',
          width: '48px',
          height: '72px',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            backgroundColor: colors.primaryDark,
          },
          transition: 'right 0.0s, border-radius 0.0s',
        }}
        title={glossaryOpen ? 'Close Glossary' : 'Open Glossary'}
      >
        <MenuBookIcon sx={{ fontSize: '28px' }} />
      </IconButton>

      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: colors.background.main,
          position: 'relative',
          p: 3,
          display: 'flex',
        }}
      >
        {/* Sidebar */}
        <Box>
          <BillInfoHeader billDetails={billDetails} selectedBill={selectedBill} />
          <ScorecardSidebar
            currentSection={currentSection}
            onSectionChange={handleSectionChange}
            answers={answers}
            flags={flags}
            saveProgress={saveProgress}
          />
        </Box>

        {/* Main Content */}
        <Box sx={{ maxWidth: 800 }}>
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
                    color: colors.text.primary,
                    mb: 2,
                    mt: 4,
                  }}
                >
                  Section {currentIndex >= 0 ? currentIndex + 1 : 1} of {sections.length}
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: '100',
                    color: colors.text.primary,
                    mb: 2,
                  }}
                >
                  {currentSectionData?.name || 'Unknown Section'}
                </Typography>
              </Box>

              {currentQuestions.map(question => {
                // Bill preselected from dashboard
                if (question.id === '00' && decodedBill) {
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
