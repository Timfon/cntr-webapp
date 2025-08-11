import { questionBank } from '../data/questionBank';

export const getSectionWarnings = (sectionId, answers, flags) => {
  const sectionQuestions = questionBank[sectionId] || [];
  return sectionQuestions.some(q => flags[q.id] || !answers[q.id]);
};

export const getSectionColor = (sectionId, sections) => {
  const section = sections.find(s => s.id === sectionId);
  return section ? section.color : '#666';
};

export const validateAllAnswers = (answers) => {
  const allQuestions = Object.entries(questionBank).flatMap(([sectionId, questions]) =>
    questions.map((q) => ({ ...q, sectionId }))
  );

  return allQuestions.find(q => !(q.id in answers));
};