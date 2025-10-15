// User role types
export type UserRole = 'undergraduate' | 'advanced' | 'expert' | 'legislative_staff' | 'general';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  // Demographic information
  ageRange?: string;
  genderIdentity?: string;
  educationLevel?: string;
  employmentStatus?: string;
}

export interface RolePermissions {
  canViewScorecard: boolean;
  canEditScorecard: boolean;
  canSubmitForms: boolean;
  canManageUsers: boolean;
  canViewAnalytics: boolean;
  canManageRoles: boolean;
}

// Role permission mappings - All roles have same permissions for now
export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  undergraduate: {
    canViewScorecard: true,
    canEditScorecard: true,
    canSubmitForms: true,
    canManageUsers: true,
    canViewAnalytics: true,
    canManageRoles: true,
  },
  advanced: {
    canViewScorecard: true,
    canEditScorecard: true,
    canSubmitForms: true,
    canManageUsers: true,
    canViewAnalytics: true,
    canManageRoles: true,
  },
  expert: {
    canViewScorecard: true,
    canEditScorecard: true,
    canSubmitForms: true,
    canManageUsers: true,
    canViewAnalytics: true,
    canManageRoles: true,
  },
  legislative_staff: {
    canViewScorecard: true,
    canEditScorecard: true,
    canSubmitForms: true,
    canManageUsers: true,
    canViewAnalytics: true,
    canManageRoles: true,
  },
  general: {
    canViewScorecard: true,
    canEditScorecard: true,
    canSubmitForms: true,
    canManageUsers: true,
    canViewAnalytics: true,
    canManageRoles: true,
  },
};
