import { questionBank } from "../data/questionBank";

export const getIsInProgress = (sectionId, answers, flags): boolean => {
  const sectionQuestions = questionBank[sectionId] || [];
  const visibleQuestions = filterQuestionsByDependencies(sectionQuestions, answers);
  return visibleQuestions.some((q) => !answers[q.id]);
};

export const getIsFlagged = (sectionId, flags, answers): boolean => {
  const sectionQuestions = questionBank[sectionId] || [];
  const visibleQuestions = filterQuestionsByDependencies(sectionQuestions, answers);
  return visibleQuestions.some((q) => flags[q.id]);
};

export const getSectionColor = (sectionId, sections) => {
  const section = sections.find((s) => s.id === sectionId);
  return section ? section.color : "#666";
};

export const validateAllAnswers = (answers) => {
  const allQuestions = Object.entries(questionBank).flatMap(
    ([sectionId, questions]) => {
      if (Array.isArray(questions)) {
        const visibleQuestions = filterQuestionsByDependencies(questions, answers);
        return visibleQuestions.map((q) => ({ ...q, sectionId }));
      }
      return [];
    }
  );
  return allQuestions.find((q) => !(q.id in answers));
};

export const validateSectionAnswers = (answers, sectionId) => {
  const sectionQuestions = questionBank[sectionId] || [];
  const visibleQuestions = filterQuestionsByDependencies(sectionQuestions, answers);
  return visibleQuestions.find((q) => !(q.id in answers));
};

export const filterQuestionsByDependencies = (questions, answers) => {
  return questions.filter((question) => {
    if (!question.dependencies || question.dependencies.length === 0) {
      return true;
    }

    return question.dependencies.every((dependencyId) => {
      const dependencyAnswer = answers[dependencyId];
      
      if (!dependencyAnswer) {
        return false;
      }
      
      if (dependencyAnswer === 'no' || dependencyAnswer === 'N/A') {
        return false;
      }
      
      if (Array.isArray(dependencyAnswer) && dependencyAnswer.includes('N/A')) {
        return false;
      }
      
      return true;
    });
  });
};

/**
 * Finds all questions that depend on a given question ID
 * @param questionId - The ID of the parent question
 * @returns Array of question IDs that depend on the given question
 */
export const findDependentQuestions = (questionId: string): string[] => {
  const dependentQuestions: string[] = [];
  
  // Search through all sections in the question bank
  Object.values(questionBank).forEach((questions) => {
    if (Array.isArray(questions)) {
      questions.forEach((question) => {
        if (question.dependencies && question.dependencies.includes(questionId)) {
          dependentQuestions.push(question.id);
        }
      });
    }
  });
  
  return dependentQuestions;
};
