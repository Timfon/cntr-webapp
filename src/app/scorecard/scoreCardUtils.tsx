import { questionBank } from "../data/questionBank";

export const getIsInProgress = (sectionId, answers, flags): boolean => {
  const sectionQuestions = questionBank[sectionId] || [];
  return sectionQuestions.some((q) => !answers[q.id]);
};

export const getIsFlagged = (sectionId, flags): boolean => {
  const sectionQuestions = questionBank[sectionId] || [];
  return sectionQuestions.some((q) => flags[q.id]);
};

export const getSectionColor = (sectionId, sections) => {
  const section = sections.find((s) => s.id === sectionId);
  return section ? section.color : "#666";
};

export const validateAllAnswers = (answers) => {
  const allQuestions = Object.entries(questionBank).flatMap(
    ([sectionId, questions]) => Array.isArray(questions) ? questions.map((q) => ({ ...q, sectionId })) : []
  );
  return allQuestions.find((q) => !(q.id in answers));
};

export const validateSectionAnswers = (answers, sectionId) => {
  const sectionQuestions = questionBank[sectionId] || [];
  return sectionQuestions.find((q) => !(q.id in answers));
};
