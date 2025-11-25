// Database Models 

export type UserRole = 'undergraduate' | 'advanced' | 'expert' | 'legislative_staff' | 'general' | 'admin';
export type AuthCategory = 'general' | 'scorer' | 'admin';
export type AssignmentStatus = 'assigned' | 'in_progress' | 'completed';
export type BillBody = 'house' | 'senate' | 'assembly';

export interface Cohort {
  id: string; // UUID
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string; // UUID, matches auth.users(id)
  email: string;
  name: string | null;
  role: UserRole;
  cohort_id: string | null; // References cohorts(id)
  auth_category: AuthCategory; // Generated column
  created_at: string;
  updated_at: string;
}

export interface UserWithCohort extends User {
  cohort: Cohort | null;
}

export interface Bill {
  id: string; // UUID
  external_id: string;
  title: string;
  state: string;
  year: number;
  bill_number: string;
  body: BillBody;
  summary: string | null;
  url: string | null;
  version_date: string | null; // DATE format: YYYY-MM-DD
  created_at: string;
  updated_at: string;
}

export interface UserBillAssignment {
  id: string; // UUID
  user_id: string;
  bill_id: string;
  assigned_at: string;
  status: AssignmentStatus;
  started_at: string | null;
  completed_at: string | null;
  deadline: string | null; // DATE format
}

export interface SubmissionDraft {
  id: string; // UUID
  user_id: string;
  bill_id: string;
  assignment_id: string;
  answers: Record<string, any>;
  notes: Record<string, string> | null;
  flags: Record<string, boolean>;
  current_section: string;
  last_saved_at: string;
  created_at: string;
}

export interface Submission {
  id: string; // UUID
  user_id: string | null;
  bill_id: string;
  assignment_id: string | null;
  answers: Record<string, any>;
  notes: Record<string, string> | null;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

export interface QuestionBank {
  id: string; // UUID
  version: number;
  questions: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BillAssignmentOverview {
  bill_id: string; 
  total_assigned: number;
  in_progress: number;
  completed: number;
  not_started: number;
  last_updated: string;
}

export interface UserStatistics {
  user_id: string;
  total_bills_assigned: number;
  bills_in_progress: number;
  bills_completed: number;
  bills_not_started: number;
  last_updated: string;
}

// Extended types for joined queries
export interface UserBillAssignmentWithBill extends UserBillAssignment {
  bill: Bill;
}

export interface UserBillAssignmentWithDraft extends UserBillAssignment {
  bill: Bill;
  draft?: SubmissionDraft | null;
}

export interface SubmissionWithBill extends Submission {
  bill: Bill;
}

export interface UserWithStatistics extends UserWithCohort {
  statistics?: UserStatistics | null;
}

export interface BillWithOverview extends Bill {
  overview?: BillAssignmentOverview | null;
}
