"use client";
import React, { useState } from 'react';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase';
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
} from '@mui/material';
import { useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import { Flag, FlagOutlined, Warning } from '@mui/icons-material';
import ResponsiveAppBar from '@/components/ResponsiveAppBar';
import Footer from '@/components/Footer';
// import "@fontsource/rubik/400.css";
// import "@fontsource/rubik/500.css";
// import "@fontsource/rubik/700.css";


const definitions = {
  'public-sector': 'The use or procurement of AI / ADS in federal, state or local government agencies or entities',
  'private-sector': 'Commercial businesses, corporations, and non-governmental organizations that use AI systems for business purposes.',
  'algorithmic-discrimination': 'Unfair or biased treatment of individuals or groups based on algorithmic decision-making processes.',
  // Add more definitions as needed
};

// Create a reusable component for terms with definitions

const DefinedTerm = ({ term = '', children = null, definition = '' }) => {
  const finalDefinition = definition || definitions?.[term] || 'Definition not available';

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <Tooltip 
        title={
          <Box sx={{ fontFamily: 'Rubik, sans-serif' }}>
            <strong>Definition:</strong> {finalDefinition}
          </Box>
        }
        arrow
        placement="top"
        sx={{
          '& .MuiTooltip-tooltip': {
            backgroundColor: 'white',
            color: '#333',
            fontSize: '0.875rem',
            maxWidth: 400,
            padding: '12px 16px',
            borderRadius: '12px',
            fontFamily: 'Rubik, sans-serif',
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            lineHeight: 1.5
          },
          '& .MuiTooltip-arrow': {
            color: 'white',
            '&::before': {
              border: '1px solid #e0e0e0'
            }
          }
        }}
      >
        <InfoOutlineIcon 
          sx={{ 
            fontSize: '1.1rem', 
            color: '#4CAF50', 
            cursor: 'help',
            position: 'relative',
            top: '3px',
            '&:hover': {
              color: '#2e7d32'
            }
          }} 
        />
      </Tooltip>
      {children}
    </span>
  );
};


const sections = [
  { id: 'general', name: 'General', color: '#4CAF50' },
  { id: 'accountability', name: 'Accountability', color: '#4CAF50' },
  { id: 'bias', name: 'Bias & Discrimination', color: '#F44336' },
  { id: 'data', name: 'Data Protection', color: '#2196F3' },
  { id: 'institution', name: 'Institution', color: '#FF9800' },
  { id: 'labor', name: 'Labor Force', color: '#9C27B0' },
  { id: 'submit', name: 'Submission', color: '#9C27B0' },
];

const questionBank = {
  general: [
    { 
      id: 'G1', 
      text: 'Does the bill have a definition for "artificial intelligence" or "automated decision making / systems"?'
    },
    { id: 'G1a', text: 'If "Yes" to G1, please select at least one of the following categories of AI definitions that is closest to the definition of AI in the bill.' },
    { id: 'G1b', text: 'If "Yes" to G1, please select at least one of the following categories of ADS definitions that is closest to the definition of ADS in the bill.' },
    { id: 'G1bi', text: 'If the bill has ADS definition, does the bill provide exclusions for ADS?' },
    { id: 'G2', text: 'Does the bill include enforcement mechanisms to ensure compliance with any rules for AI governance?' },
    { id: 'G2a', text: 'If "Yes" to G2, does the bill specify the party responsible for enforcement?' },
    {
    id: 'G3',
    text: (
      <>
        Does the bill apply to
        <DefinedTerm term="public-sector" definition="Government and publicly funded organizations">
        </DefinedTerm>
        public-sector use
        of AI / ADS?
      </>
    )
  },
    { id: 'G4', text: 'Does the bill apply to private-sector use of AI / ADS?' },
    { id: 'G5', text: 'Does the bill provide an explicit list of domains where AI / ADS is used?' },
    { id: 'G6', text: 'Does the bill define concepts related to generative AI, e.g "large language model", "frontier model", "foundational model", etc?' },
    { id: 'G6a', text: 'If "Yes" to G6, does the bill specify scope (e.g. model size, compute power) specifically related to generative AI or foundational model?' }
  ],
  accountability: [
    { id: 'A1', text: 'Does the bill provide definitions for "Impact Assessment" (IA), "Risk Assessment" (RA), or similar forms of evaluation? If other forms of evaluation are used, please indicate in the Notes.' },
    { id: 'A2', text: 'Does the bill require covered entities (as defined in the bill) to conduct Impact/Risk Assessment (IA/RA) or similar evaluations?' },
    { id: 'A3', text: 'Does the bill specify the requirements or methodologies for conducting an IA/RA?' },
    { id: 'A4', text: 'Does the bill refer to established standards, such as frameworks from NIST, or published industry standards, specific to accountability?' },
    { id: 'A4a', text: 'Does the bill require stakeholder participation in the IA/RA process?' },
    { id: 'A5', text: 'Does the bill require notification to affected communities about IA/RA?' },
    { id: 'A6', text: 'Does the bill provide compensation and civil recourse for those affected by harms?' },
    { id: 'A7', text: 'Does the bill specify enforcement mechanisms or penalties for failing to conduct IA/RA as required?' },
    { id: 'A8', text: 'Are third-party vendors or partners required to comply with the IA/RA provisions in the bill?' },
    { id: 'A9', text: 'Does the bill specify or otherwise acknowledge risks arising from development by requiring testing the AI tool/system for validity?' },
    { id: 'A10', text: 'Does the bill specify or otherwise acknowledge privacy harms?' },
    { id: 'A11', text: 'Does the bill specify or otherwise acknowledge risks to individual rights and freedoms, such as threats to dignity, personal autonomy, or privacy (e.g., unauthorized disclosure, identity theft)?' },
    { id: 'A11a', text: 'If "Yes" to any of A9 - A11, does the bill require the covered companies to identify the nature and severity of those risks?' },
    { id: 'A12', text: 'Does the IA/RA establish procedures to assess, benchmark, and monitor identified AI risks and related impacts?' },
    { id: 'A13', text: 'Does the IA/RA propose measures to address the risks?' },
    { id: 'A14', text: 'Does the IA/RA include the option of deploying the system in its current state with increased testing and controls, or if necessary, decommissioning the system?' },
    { id: 'A15', text: 'Is risk management an ongoing procedure, with testing and evaluation occurring over the entire lifecycle of an AI system, including the post-deployment period?' },
    { id: 'A16', text: 'Does the bill specify the frequency of IA/RA?' },
    { id: 'A16a', text: 'If "Yes" to A16, are IA/RAs required at regular intervals (e.g., annually, biannually)?' },
    { id: 'A17', text: 'Does the bill require a pre-deployment IA/RA before the system is implemented?' },
    { id: 'A18', text: 'Does the bill require a post-deployment IA/RA after the system has been implemented?' },
    { id: 'A19', text: 'Does the bill require IA/RAs for all stages of the model\'s life cycle (e.g., development, deployment, monitoring)?' },
    { id: 'A20', text: 'Does the bill require IA/RAs for all stages of the data life cycle?' },
    { id: 'A21', text: 'Does the bill mandate ongoing monitoring and updating of the IA/RA as the system evolves?' },
    { id: 'A22', text: 'Does the bill require maintenance of IA/RA documentation?' },
    { id: 'A23', text: 'Does the bill require documentation detailing how a model functions and its intended use cases?' },
    { id: 'A24', text: 'Does the bill require a transparency report?' },
    { id: 'A25', text: 'Does the bill identify the party responsible for completing the transparency requirement?' },
    { id: 'A26', text: 'Does the bill require regular reporting to government agencies?' },
    { id: 'A27', text: 'Does the bill require public reporting/publication?' },
    { id: 'A28', text: 'Does the bill aim to address these risks by requiring auditing from expert third parties?' },
    { id: 'A28a', text: 'If the bill includes auditing requirements or you select "Yes" for A28, does the bill define how frequently auditing should occur (i.e., single point or regular intervals)?' },
    { id: 'A29', text: 'Does the bill deploy precautionary measures beyond impact assessments, such as licensing or sandboxing?' },
    { id: 'A30', text: 'Does the bill impose explicit bans on AI systems, such as preventing deployment due to safety risks or requiring compliance before use?' },
    { id: 'A31', text: 'Does the bill propose a licensing regime for any AI systems?' },
    { id: 'A32', text: 'Does the bill consider conditional licensing?' },
    { id: 'A32a', text: 'If "Yes" to A32a, is the conditional licensing imposed by a regulator rather than self-imposed by companies?' },
    { id: 'A34', text: 'Does the bill give regulators extensive inspection and information-forcing capabilities?' },
    { id: 'A35', text: 'Does the bill require tools of resilience, e.g., kill switches, recalls, emergency training and protocols, or establishing thresholds at which a deployed system should be shut down?' }
  ],
  bias: [
    { id: 'B1', text: 'Does the bill define "algorithmic discrimination" (or a similar term) to characterize unfair treatment toward specific groups?' },
    { id: 'B2', text: 'Does the bill explicitly include legally protected characteristics (e.g., race, gender, age, religion, disability) in its definition of discrimination or bias?' },
    { id: 'B3', text: 'Does the bill identify specific sectors or domains where bias provisions apply?' },
    { id: 'B3a', text: 'Does the bill apply bias provisions to specific types of consequential decisions (e.g., government benefits, employment)?' },
    { id: 'B4', text: 'Does the bill require or suggest examination of data sources?' },
    { id: 'B4a', text: 'If yes to B4, does the bill require or suggest examination of data sources that would implicate biased outcomes?' },
    { id: 'B5', text: 'Does the bill restrict the use of AI systems that exhibit potentially discriminatory outcomes?' },
    { id: 'B6', text: 'Does the bill propose or endorse specific methods to reduce algorithmic discrimination?' },
    { id: 'B7', text: 'Does the bill mandate ongoing monitoring and evaluation of AI systems for bias?' }
  ],
  data: [
    { id: 'D1', text: 'Does the bill mention or imply a right to privacy concerning personal data or individual information?' },
    { id: 'D2', text: 'Does the bill refer to established standards such as ISO standards or NIST guidelines specific to data protection?' },
    { id: 'D2a', text: 'If yes to D2, does the bill include provisions for the enforcement of these data protection standards?' },
    { id: 'D4', text: 'Does the bill establish a private right of action?' },
    { id: 'D5', text: 'Does the bill provide a definition of sensitive data?' },
    { id: 'D6', text: 'Does the bill have specific requirements for handling sensitive data?' },
    { id: 'D7', text: 'Does the bill require limits on access/use of sensitive data?' },
    { id: 'D8', text: 'Does the bill require disclosure of the specific categories of sensitive data collected?' },
    { id: 'D9', text: 'Does the bill specify guidelines or limitations regarding data collection practices?' },
    { id: 'D10', text: 'Does the bill specify the allowable time frame or conditions under which data can be collected during the pre-deployment stage?' },
    { id: 'D11', text: 'Does the bill reference data minimization?' },
    { id: 'D12', text: 'Does the bill require explicit, informed consent from individuals before collecting their personal data?' },
    { id: 'D13', text: 'Does the bill establish oversight mechanisms to ensure compliance with consent requirements for data collection?' },
    { id: 'D14', text: 'Does the bill require organizations to document the purposes for which personal data is collected, used, processed or retained?' },
    { id: 'D15', text: 'Does the bill require documentation, report or summary of used datasets, including data sources, consent records, and data preprocessing activities?' },
    { id: 'D16', text: 'Does the bill specify how personal data can be used after deployment of the AI system?' },
    { id: 'D17', text: 'Does the bill define the duration or conditions under which personal data can be used post-deployment?' },
    { id: 'D18', text: 'Does the bill reference data retention practices?' },
    { id: 'D19', text: 'Does the bill identify a data retention period?' },
    { id: 'D20', text: 'Does the bill specify the conditions under which personal data can be transferred or shared between parties domestically?' },
    { id: 'D21', text: 'Does the bill specify the conditions for cross-border transfer or sharing of personal data?' },
    { id: 'D22', text: 'Does the bill reference data deletion?' },
    { id: 'D23', text: 'Does the bill address how individuals can request deletion of their data?' },
    { id: 'D24', text: 'Does the bill address how individuals can verify the removal of their data?' },
    { id: 'D25', text: 'Does the bill specify requirements for securing data?' },
    { id: 'D26', text: 'Does the bill specify requirements for informing individuals of data breaches?' },
    { id: 'D27', text: 'Does the bill require mechanisms for individuals to ascertain if their personal data has been used in AI training datasets?' },
    { id: 'D28', text: 'Does the bill provide remedies for individuals if their personal data is disclosed in AI outputs without consent?' }
  ],
  institution: [
    { id: 'I1', text: 'Does the bill mandate the establishment of a new entity?' },
    { id: 'I1a', text: 'Does the bill outline clear, measurable objectives for the new entity that must be achieved within defined timelines?' },
    { id: 'I1b', text: 'Does the bill identify how the new entity will work with existing agencies?' }
  ],
  labor: [
    { id: 'L1', text: 'Does the bill contain provisions aimed at expanding the workforce in the AI Economy?' },
    { id: 'L2', text: 'Does the bill call for training the labor force for AI-related skills?' },
    { id: 'L3', text: 'Does the bill specify partners to collaborate with to research the impact of AI on the labor force?' },
    { id: 'L4', text: 'Does the bill call for the analysis of challenges faced by workers affected by automation or AI implementation?' },
    { id: 'L5', text: 'Does the bill call for the analysis of demographics that may be most vulnerable to AI displacement?' },
    { id: 'L6', text: 'Does the bill propose recommendations to alleviate work displacement as a result of AI?' },
    { id: 'L7', text: 'Does the bill propose compensation for workers who are being displaced, replaced or unemployed due to AI or automation?' }
  ]
};

export default function ScorecardPage() {
  
  const [currentSection, setCurrentSection] = useState('general');
  const [answers, setAnswers] = useState({});
  const [flags, setFlags] = useState({});
const [notes, setNotes] = useState({});

  const currentIndex = sections.findIndex(s => s.id === currentSection);
  const currentQuestions = questionBank[currentSection] || [];
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      router.push('/signin');
    } else {
      // Fetch saved progress
      const userDoc = doc(db, 'progress', user.uid);
      const docSnap = await getDoc(userDoc);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setAnswers(data.answers || {});
        setFlags(data.flags || {});
        setNotes(data.notes || {});

        setCurrentSection(data.currentSection || 'general');
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
    }, 500); // waits 500ms after typing ends

    return () => clearTimeout(timeout); // clear on next keystroke
  }
}, [notes, loading]);
  if (loading) {
    return <div></div>; // Or your loading spinner
  }

  
  
  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => {
    const updated = { ...prev, [questionId]: answer };
    saveProgress({ answers: updated });
    return updated;
  });
  };
  
  const handleFlag = (questionId) => {
    setFlags(prev => {
    const updated = { ...prev, [questionId]: !prev[questionId] };
    saveProgress({ flags: updated });
    return updated;
  });
  };
  
  const getSectionWarnings = (sectionId) => {
    const sectionQuestions = questionBank[sectionId] || [];
    return sectionQuestions.some(q => flags[q.id] || !answers[q.id]);
  };
  
  const getSectionColor = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    return section ? section.color : '#666';
  };

  const saveProgress = async (newData) => {
  const user = auth.currentUser;
  if (!user) return;

  const userDoc = doc(db, 'progress', user.uid);
  await setDoc(userDoc, {
    answers,
    flags,
    notes,
    currentSection,
    ...newData, // override any changed field
  });
};

// // Auto-save when section changes
// useEffect(() => {
//   if (!loading) {
//     saveProgress({ currentSection });
//   }
// }, [currentSection]);

  return (
    <Box>
      <ResponsiveAppBar />
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: '#F6FBF7',
        position: 'relative',
        p: 3
      }}>
        {/* Floating Sidebar */}
        <Paper sx={{ 
  position: 'fixed',
  left: 24,
  top: 120,
  width: 300,
  height: 'calc(100vh - 250px)',
  backgroundColor: 'white',
  borderRadius: 3,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  zIndex: 1000
}}>
  <Box sx={{ mt: 2, overflowY: 'auto', height: 'calc(100% - 60px)' }}>
    {sections.map((section) => (
      <Box
        key={section.id}
        sx={{
          pl: 2.5,
          pr: 2,
          py: 2.5,
          cursor: 'pointer',
          backgroundColor: currentSection === section.id ? '#CEE7BD' : 'transparent',
          borderRadius: '12px',
          margin: '5px 19px',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            backgroundColor: currentSection === section.id ? '#CEE7BD' : 'rgba(0, 0, 0, 0.02)',
          },
          '&:active': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.15s ease-out'
        }}
        onClick={() => {
          setCurrentSection(section.id);
          window.scrollTo({ top: 0, behavior: 'instant' }); //idk instant or smooth
        }}

      >
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: '0.9rem',
            fontWeight: 500, // Rubik-Medium
            fontFamily: 'Rubik-Medium, sans-serif',
            color: currentSection === section.id ? '#1b5e20' : 'inherit'
          }}
        >
          {section.name}
        </Typography>
        {getSectionWarnings(section.id) && (
          <ErrorOutlineIcon sx={{ color: 'black', fontSize: '1.5rem' }} />
        )}
      </Box>
    ))}
  </Box>
</Paper>

        {/* Main Content */}
        <Box sx={{ 
          marginLeft: '350px',
          maxWidth: 800
        }}>
          <Typography variant="body2" sx={{ 
  color: '#666', 
  mb: 1,
  mt: 4,
  fontFamily: 'Rubik, sans-serif'
}}>
  Section {currentIndex + 1} of {sections.length}
</Typography>

<Typography variant="h4" sx={{ 
  fontWeight: '100', 
  mb: 1,
  fontFamily: 'Rubik-Bold, sans-serif'
}}>
  {sections[currentIndex].name}
</Typography>
          {/* <Typography variant="body2" sx={{ fontFamily: 'Rubik, sans-serif', md: '1.2rem', mb: 3 }}>
            <strong>Note:</strong> In this category of Accountability & Transparency, "IA" 
            will refer to Impact Assessment and "RA" to Risk Assessment 
            throughout this scorecard. Both terms will be treated 
            synonymously within this category.
          </Typography>

          <Typography variant="h5" sx={{ 
            fontWeight: 'bold', 
            mb: 3,
            fontSize: '1.5rem',
            fontFamily: 'Rubik-Bold, sans-serif'
          }}>
            Definitions and General Requirements
          </Typography> */}

          {currentQuestions.map((question) => (
            <Paper key={question.id} sx={{ mb: 3, p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="body1" sx={{ 
                  flex: 1, 
                  mr: 2,
                  fontFamily: 'Rubik, sans-serif'
                }}>
                  <strong>{question.id}.</strong> {question.text}
                </Typography>
                <Button
                  onClick={() => handleFlag(question.id)}
                  sx={{ 
                    minWidth: 'auto', 
                    p: 0.5,
                    color: flags[question.id] ? '#d32f2f' : '#666',
                    borderRadius: 2
                  }}
                >
                  {flags[question.id] ? <Flag /> : <FlagOutlined />}
                </Button>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}>
                <Button
                  variant={answers[question.id] === 'yes' ? 'contained' : 'outlined'}
                  onClick={() => handleAnswer(question.id, 'yes')}
                  sx={{
                    backgroundColor: answers[question.id] === 'yes' ? '#138B43' : 'transparent',
                    color: answers[question.id] === 'yes' ? 'white' : '#666',
                    borderColor: '#ccc',
                    fontFamily: 'Rubik, sans-serif',
                    borderRadius: 2,
                    minWidth: 110,
                    textTransform: 'none',
                    fontSize: '1.0rem',

                    '&:hover': {
                      backgroundColor: answers[question.id] === 'yes' ? '#0f7a3a' : '#f5f5f5'
                    }
                  }}
                >
                  Yes
                </Button>
                <Button
                  variant={answers[question.id] === 'no' ? 'contained' : 'outlined'}
                  onClick={() => handleAnswer(question.id, 'no')}
                  sx={{
                    backgroundColor: answers[question.id] === 'no' ? '#138B43' : 'transparent',
                    color: answers[question.id] === 'no' ? 'white' : '#666',
                    borderColor: '#ccc',
                    minWidth: 110,
                    textTransform: 'none',
                    fontFamily: 'Rubik, sans-serif',
                    borderRadius: 2,
                    fontSize: '1.0rem',

                    '&:hover': {
                      backgroundColor: answers[question.id] === 'no' ? '#0f7a3a' : '#f5f5f5'
                    }
                  }}
                >
                  No
                </Button>
              </Box>
            </Paper>
          ))}

          {/* Notes Section */}
          <Paper sx={{ p: 3, mt: 4, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              fontFamily: 'Rubik, sans-serif'
            }}>
              Notes
            </Typography>
          <TextField
            multiline
            rows={6}
            fullWidth
            placeholder="Add your notes here..."
            value={notes[currentSection] || ''}
            onChange={(e) => {
              const newNotes = { ...notes, [currentSection]: e.target.value };
              setNotes(newNotes);
              saveProgress({ notes: newNotes }); // save updated notes per section
            }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  fontFamily: 'Rubik, sans-serif',
                  borderRadius: 2
                },
                '& .MuiInputBase-input': {
                  fontFamily: 'Rubik, sans-serif'
                }
              }}
            />
          </Paper>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
  <Button
    variant="outlined"
    onClick={() => {
      if (currentIndex > 0) {
        const prevSectionId = sections[currentIndex - 1].id;
        setCurrentSection(prevSectionId);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }}
    disabled={currentIndex === 0}
    sx={{ 
      color: '#666',
      borderColor: '#ccc',
      textTransform: 'none',
      minWidth: 110,
      fontFamily: 'Rubik, sans-serif',
      borderRadius: 2,
      '&:hover': {
        backgroundColor: '#f5f5f5'
      }
    }}
  >
    Previous
  </Button>
  {currentSection === 'submit' ? (
  <Button
    variant="contained"
    onClick={async () => {
  const allQuestions = Object.entries(questionBank).flatMap(([sectionId, questions]) =>
    questions.map((q) => ({ ...q, sectionId }))
  );

  const firstUnanswered = allQuestions.find(q => !(q.id in answers));

  if (firstUnanswered) {
    setCurrentSection(firstUnanswered.sectionId);
     setTimeout(() => {
    const el = document.getElementById(`question-${firstUnanswered.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 500); // adjust timing if needed

    alert(`Please answer all questions before submitting. Missing: ${firstUnanswered.id}`);
    return;
  }

  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, 'submissions'), {
    answers,
    flags,
    notes,
    submittedAt: new Date().toISOString(),
    uid: user.uid,
    email: user.email,
  });

  alert('Form submitted!');

  setAnswers({});
  setFlags({});
  setNotes('');
  setCurrentSection('general');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}}

    sx={{
      backgroundColor: '#2e7d32',
      fontFamily: 'Rubik, sans-serif',
      borderRadius: 2,
      textTransform: 'none',
      minWidth: 110,
      width: 100,
      '&:hover': {
        backgroundColor: '#1b5e20'
      }
    }}
  >
    Submit
  </Button>
) : (
  <Button 
    variant="contained" 
    onClick={() => {
      if (currentIndex < sections.length - 1) {
        const nextSectionId = sections[currentIndex + 1].id;
        setCurrentSection(nextSectionId);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }}
    sx={{ 
      backgroundColor: '#2e7d32',
      fontFamily: 'Rubik, sans-serif',
      borderRadius: 2,
      minWidth: 110,
      textTransform: 'none',
      width: 100,
      '&:hover': {
        backgroundColor: '#1b5e20'
      }
    }}
  >
    Next
  </Button>
)}
</Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}