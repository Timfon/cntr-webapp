// Database Models for Refactored Structure

export interface User {
  uid: string;
  email: string;
  role: string;
  assignedBills: string[]; 
  inProgress: {
    billId: string;
    currentSection: string;
    answers: {
      [sectionId: string]: {
        [questionId: string]: any;
      };
    };
    flags: Record<string, boolean>;
    notes: Record<string, string>;
    lastUpdated: string;
    startedAt: string;
  } | null;
  completedBills: Record<string, string>; // key: billId, value: submissionId
}

export interface Bill {
  billId: string; // Format: {state} {H|S} {Number} {Year}
  name: string;
  url: string;
  versionDate: string;
  state: string;
  year: string;
  number: string;
  type: 'H' | 'S';
}

export interface Submission {
  version: string;
  id: string;
  billId: string;
  createdAt: string;
  uid: string;
  answers: Record<string, any>;
  notes: {
    [sectionId: string]: string;
  }
}