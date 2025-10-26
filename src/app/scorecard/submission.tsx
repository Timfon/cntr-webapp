import React from 'react';
import {
  Box,
  Typography
} from '@mui/material';
import { sections } from '@/app/data/sections';
import { questionBank } from '@/app/data/questionBank';
import ScoringSummary from '@/components/ScoringSummary';
import FlaggedQuestionsTable from '@/components/FlaggedQuestionsTable';
import UnansweredQuestionsTable from '@/components/UnansweredQuestionsTable';
import NotesTable from '@/components/NotesTable';
import SubmitButton from '@/components/SubmitButton';
import SubmissionStatusAlert from '@/components/SubmissionStatusAlert';

interface SubmissionPageProps {
  answers: Record<string, any>;
  flags: Record<string, boolean>;
  notes: Record<string, string>;
  onNavigateToQuestion: (sectionId: string, questionId: string) => void;
  onSubmit: () => void;
  selectedBill: string;
}

const SubmissionPage: React.FC<SubmissionPageProps> = ({
  answers,
  flags,
  notes,
  onNavigateToQuestion,
  onSubmit,
  selectedBill
}) => {
  // Calculate summary statistics
  const allQuestions = Object.entries(questionBank).flatMap(
    ([sectionId, questions]) => Array.isArray(questions) ? questions.map((q) => ({ ...q, sectionId })) : []
  );

  const totalQuestions = allQuestions.length;
  const answeredQuestions = allQuestions.filter(q => answers[q.id] !== undefined).length;
  const flaggedQuestions = allQuestions.filter(q => flags[q.id]).length;
  const sectionsWithNotes = Object.keys(notes).length;
  
  // Calculate completed sections
  const completedSections = sections.filter(section => {
    const sectionQuestions = questionBank[section.id] || [];
    return sectionQuestions.length > 0 && sectionQuestions.every(q => answers[q.id] !== undefined);
  }).length;

  // Get flagged questions data
  const flaggedQuestionsData = allQuestions.filter(q => flags[q.id]).map(q => ({
    section: sections.find(s => s.id === q.sectionId)?.name || 'Unknown',
    question: q.text,
    response: answers[q.id] || 'Not answered',
    sectionId: q.sectionId,
    questionId: q.id
  }));

  // Get unanswered questions data
  const unansweredQuestionsData = allQuestions.filter(q => answers[q.id] === undefined).map(q => ({
    section: sections.find(s => s.id === q.sectionId)?.name || 'Unknown',
    question: q.text,
    sectionId: q.sectionId,
    questionId: q.id
  }));

  // Get notes data
  const notesData = Object.entries(notes).filter(([_, noteText]) => noteText.trim()).map(([sectionId, noteText]) => {
    const section = sections.find(s => s.id === sectionId);
    return {
      section: section?.name || 'Unknown',
      question: `Section notes for ${section?.name || sectionId}`,
      notes: noteText,
      response: 'N/A',
      sectionId,
      questionId: 'notes'
    };
  });

  // Check if submission is allowed
  const canSubmit = answeredQuestions === totalQuestions && flaggedQuestions === 0;
  const submissionIssues: string[] = [];

  if (answeredQuestions < totalQuestions) {
    submissionIssues.push(`${totalQuestions - answeredQuestions} unanswered questions`);
  }
  if (flaggedQuestions > 0) {
    submissionIssues.push(`${flaggedQuestions} flagged questions`);
  }

  const handleNavigateToQuestion = (sectionId: string, questionId: string) => {
    onNavigateToQuestion(sectionId, questionId);
  };

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          mb: 2,
          fontFamily: "Rubik-Bold, sans-serif",
          color: "#333333"
        }}
      >
        Review & Submit
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mb: 4,
          fontFamily: "Rubik, sans-serif",
          color: "#666",
          lineHeight: 1.6
        }}
      >
        Here's a summary of your responses for this bill. Take a moment to review your scores, notes, and any flagged questions before you submit.
      </Typography>

      <ScoringSummary
        completedSections={completedSections}
        totalSections={sections.length - 1}
        answeredQuestions={answeredQuestions}
        totalQuestions={totalQuestions}
        flaggedQuestions={flaggedQuestions}
        sectionsWithNotes={sectionsWithNotes}
      />

      <SubmissionStatusAlert
        canSubmit={canSubmit}
        submissionIssues={submissionIssues}
      />

      <FlaggedQuestionsTable
        flaggedQuestions={flaggedQuestionsData}
        onNavigateToQuestion={handleNavigateToQuestion}
      />

      <UnansweredQuestionsTable
        unansweredQuestions={unansweredQuestionsData}
        onNavigateToQuestion={handleNavigateToQuestion}
      />

      <NotesTable
        notesData={notesData}
        onNavigateToQuestion={handleNavigateToQuestion}
      />

      <SubmitButton
        canSubmit={canSubmit}
        onSubmit={onSubmit}
      />
    </Box>
  );
};

export default SubmissionPage;
