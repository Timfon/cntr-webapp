'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { billService, assignmentService, draftService, submissionService } from '@/backend/database';
import { questionBank } from '../data/questionBank';
import { sections } from '../data/sections';
import { findDependentQuestions, validateAllAnswers } from './scoreCardUtils';
import { Bill } from '@/types/database';

interface UseScorecardDataResult {
  // State
  loading: boolean;
  currentSection: string;
  answers: Record<string, any>;
  flags: Record<string, boolean>;
  notes: Record<string, string>;
  selectedBill: string | null;
  billDetails: Bill | null;
  currentUserId: string | null;
  assignmentId: string | null;
  decodedBill: string | null;

  // Actions
  setCurrentSection: (section: string) => void;
  handleAnswer: (questionId: string, answer: any) => void;
  handleFlag: (questionId: string) => void;
  handleNotesChange: (sectionId: string, value: string) => void;
  handleSubmit: () => Promise<void>;
  saveProgress: (data: {
    answers?: Record<string, any>;
    flags?: Record<string, boolean>;
    notes?: Record<string, string>;
  }) => Promise<void>;
}

export function useScorecardData(): UseScorecardDataResult {
  const { user, loading: authLoading } = useAuth();
  const [currentSection, setCurrentSection] = useState('general');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [selectedBill, setSelectedBill] = useState<string | null>(null);
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [billDetails, setBillDetails] = useState<Bill | null>(null);
  const [assignmentId, setAssignmentId] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const billParam = searchParams.get('bill');
  const decodedBill = billParam ? decodeURIComponent(billParam) : null;

  // Find which section a question belongs to
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

  // Load user data and draft on mount
  useEffect(() => {
    const initializeScorecard = async () => {
      if (authLoading) {
        // Wait for auth to load
        return;
      }

      if (!user) {
        setLoading(false);
        return;
      }

      if (!billParam || !decodedBill) {
        router.push('/dashboard');
        return;
      }

      // Get bill details
      let billName = decodedBill;
      try {
        const details = await billService.getBill(decodedBill);
        if (details) {
          setBillDetails(details);
          billName = details.title || decodedBill;
          setSelectedBill(billName);
        } else {
          setSelectedBill(decodedBill);
        }
      } catch (error) {
        setSelectedBill(decodedBill);
      }

      // Get the user's in-progress assignment for this bill
      const inProgressAssignment = await assignmentService.getUserInProgressAssignment(user.id);
      if (!inProgressAssignment || inProgressAssignment.bill_id !== decodedBill) {
        alert('No active assignment found for this bill.');
        router.push('/dashboard');
        return;
      }

      setAssignmentId(inProgressAssignment.id);

      // Load draft for this assignment
      const draft = await draftService.getDraft(user.id, decodedBill);

      if (draft) {
        const draftAnswers = (draft.answers as Record<string, any>) || {};
        const draftFlags = (draft.flags as Record<string, boolean>) || {};
        const draftNotes = (draft.notes as Record<string, string>) || {};
        const draftSection = draft.current_section || 'general';

        // Ensure question 00 is answered
        if (!draftAnswers['00']) {
          draftAnswers['00'] = billName;
          setTimeout(async () => {
            try {
              await draftService.saveDraft(user.id, decodedBill, inProgressAssignment.id, {
                answers: draftAnswers,
                flags: draftFlags,
                notes: draftNotes,
                currentSection: draftSection,
              });
            } catch (error) {
              console.error('Error saving question 00 answer:', error);
            }
          }, 100);
        }
        setAnswers(draftAnswers);
        setFlags(draftFlags);
        setNotes(draftNotes);
        setCurrentSection(draftSection);
      } else {
        // New bill - start fresh
        const initialAnswers = { '00': billName };
        setAnswers(initialAnswers);
        setFlags({});
        setNotes({});
        setCurrentSection('general');
        setTimeout(async () => {
          try {
            await draftService.saveDraft(user.id, decodedBill, inProgressAssignment.id, {
              answers: initialAnswers,
              flags: {},
              notes: {},
              currentSection: 'general',
            });
          } catch (error) {
            console.error('Error saving initial draft:', error);
          }
        }, 100);
      }

      setLoading(false);
    };

    initializeScorecard();
  }, [user, authLoading, router, billParam, decodedBill]);

  const saveProgress = async (data: {
    answers?: Record<string, any>;
    flags?: Record<string, boolean>;
    notes?: Record<string, string>;
  }) => {
    if (!user || !decodedBill || !assignmentId) return;

    try {
      const updatedAnswers = data.answers ? { ...answers, ...data.answers } : answers;
      const updatedFlags = data.flags ? { ...flags, ...data.flags } : flags;
      const updatedNotes = data.notes ? { ...notes, ...data.notes } : notes;

      await draftService.saveDraft(user.id, decodedBill, assignmentId, {
        answers: updatedAnswers,
        flags: updatedFlags,
        notes: updatedNotes,
        currentSection: currentSection,
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleAnswer = (questionId: string, answer: any) => {
    if (questionId === '00') {
      setSelectedBill(answer);
      saveProgress({ answers: { '00': answer } });
      return;
    }

    let updatedAnswers = { ...answers, [questionId]: answer };

    // If the answer is "No" or "N/A", clear dependent question answers
    if (answer === 'no' || answer === 'N/A') {
      const dependentQuestions = findDependentQuestions(questionId);

      dependentQuestions.forEach(dependentId => {
        updatedAnswers[dependentId] = ['N/A'];
      });

      const updatedFlags = { ...flags };
      dependentQuestions.forEach(dependentId => {
        delete updatedFlags[dependentId];
      });
      setFlags(updatedFlags);

      saveProgress({
        answers: updatedAnswers,
        flags: updatedFlags,
      });
    } else {
      const dependentQuestions = findDependentQuestions(questionId);
      dependentQuestions.forEach(dependentId => {
        delete updatedAnswers[dependentId];
      });
    }

    setAnswers(updatedAnswers);
    saveProgress({ answers: updatedAnswers });
  };

  const handleFlag = (questionId: string) => {
    const updated = { ...flags, [questionId]: !flags[questionId] };
    setFlags(updated);
    saveProgress({ flags: updated });
  };

  const handleNotesChange = (sectionId: string, value: string) => {
    const updated = { ...notes, [sectionId]: value };
    setNotes(updated);
    saveProgress({ notes: updated });
  };

  const handleSubmit = async () => {
    const firstUnanswered = validateAllAnswers(answers);
    const flaggedQuestions = Object.entries(flags)
      .filter(([_, value]) => value === true)
      .map(([key]) => key);

    if (firstUnanswered || flaggedQuestions.length > 0) {
      let errorMessage = 'Cannot submit. Please address the following issues:\n\n';

      if (firstUnanswered) {
        errorMessage += `• Unanswered questions: ${firstUnanswered.id}\n`;
      }

      if (flaggedQuestions.length > 0) {
        errorMessage += `• Flagged questions: ${flaggedQuestions.join(', ')}\n`;
      }

      errorMessage += '\nPlease review and complete all questions before submitting.';

      alert(errorMessage);
      return;
    }

    if (!user || !decodedBill || !assignmentId) {
      alert('Unable to identify bill or assignment. Please try again.');
      return;
    }

    try {
      await submissionService.createSubmission({
        userId: user.id,
        billId: decodedBill,
        assignmentId: assignmentId,
        answers: answers,
        notes: notes,
      });

      await assignmentService.updateAssignmentStatus(user.id, assignmentId, 'completed');
      await draftService.deleteDraft(user.id, decodedBill);

      setAnswers({});
      setFlags({});
      setNotes({});
      setCurrentSection('general');
      setSelectedBill('');

      alert('Form submitted!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      router.push(`/scorecard/view-submission?bill=${encodeURIComponent(decodedBill)}`);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    }
  };

  return {
    loading: loading || authLoading,
    currentSection,
    answers,
    flags,
    notes,
    selectedBill,
    billDetails,
    currentUserId: user?.id || null,
    assignmentId,
    decodedBill,
    setCurrentSection,
    handleAnswer,
    handleFlag,
    handleNotesChange,
    handleSubmit,
    saveProgress,
  };
}
