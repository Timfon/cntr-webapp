import React from 'react';
import {
  Alert,
  Typography
} from '@mui/material';

interface SubmissionStatusAlertProps {
  canSubmit: boolean;
  submissionIssues: string[];
}

const SubmissionStatusAlert: React.FC<SubmissionStatusAlertProps> = ({
  canSubmit,
  submissionIssues
}) => {
  if (canSubmit) {
    return null;
  }

  return (
    <Alert 
      severity="warning" 
      sx={{ mb: 4, fontFamily: 'Rubik, sans-serif' }}
    >
      <Typography sx={{ fontFamily: 'Rubik, sans-serif', fontWeight: 500 }}>
        Cannot submit yet. Please address the following:
      </Typography>
      <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
        {submissionIssues.map((issue, index) => (
          <li key={index} style={{ fontFamily: 'Rubik, sans-serif' }}>{issue}</li>
        ))}
      </ul>
    </Alert>
  );
};

export default SubmissionStatusAlert;
