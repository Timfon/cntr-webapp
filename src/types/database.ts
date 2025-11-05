// Database Models for Refactored Structure

export interface User {
  uid: string;
  email: string;
  role: string;
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
}

export interface Bill {
  billId: string; // Document ID from Firestore (e.g., "AL HB283 2025-02-13")
  title: string; // Bill title from Firestore
  name?: string; // Legacy field - fallback
  url: string;
  versionDate: string;
  state: string;
  year: number | string; // Firestore has number, but can be string
  number: string; // Firestore format: includes prefix like "HB283" or "SB123"
  body?: string; // Firestore format: "House" or "Senate"
  type?: 'H' | 'S'; // Legacy field - can be derived from body or number
  description?: string; // Firestore format - bill description
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