// Database Models for Refactored Structure

import { UserRole } from './user';

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  cohort: string | null;
  assignedBills: string[];
  inProgress: {
    billId: string;
    currentSection: string;
    answers: Record<string, any>;
    flags: Record<string, boolean>;
    notes: Record<string, string>;
    lastUpdated: string;
    startedAt: string;
  } | null;
  completedBills: Record<string, string>; // key: billId, value: submissionId
  completedBillsCount?: number;
}

export interface Bill {
  billId: string;
  title: string; // Bill title from Firestore
  url: string;
  versionDate: string;
  state: string;
  year: number | string; // Firestore has number, but can be string
  number: string; // Firestore format: includes prefix like "HB283" or "SB123"
  body?: string; // Firestore format: "House" or "Senate"
  description?: string; // Firestore format - bill description
}

export interface Submission {
  id: string;
  billId: string;
  uid: string;
  submissionDate: string;
  answers: Record<string, any>;
  notes: {
    [sectionId: string]: string;
  };
  version?: string;
}