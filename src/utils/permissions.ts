import { User } from '@/types/database';
import { UserRole } from '@/types/user';

/**
 * Permission Utilities
 *
 * ⚠️ SECURITY WARNING:
 * These functions run CLIENT-SIDE and are for UI/UX only.
 * They do NOT provide security - all security is enforced in Firestore Rules.
 *
 * Permission Model:
 * - Admin (role='admin'): Full access to everything
 * - Scorers (all other roles): Can only access assigned bills
 */

/**
 * Check if user is an admin
 */
export function isAdmin(user: User): boolean {
  return user.role === 'admin';
}

/**
 * Check if user is a scorer (any non-admin role)
 */
export function isScorer(user: User): boolean {
  return user.role !== 'admin';
}

/**
 * Check if user has access to a specific bill
 */
export function hasAccessToBill(user: User, billId: string): boolean {
  // Admins can access all bills
  if (isAdmin(user)) return true;

  // Scorers can only access their assigned bills
  return user.assignedBills.includes(billId);
}

/**
 * Check if user can submit a specific bill
 */
export function canSubmitBill(user: User, billId: string): boolean {
  // Must have access to the bill
  if (!hasAccessToBill(user, billId)) return false;

  // Cannot submit if already completed
  return !user.completedBills[billId];
}

/**
 * Get a display name for a role (for UI)
 */
export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    admin: 'Administrator',
    legislative_staff: 'Legislative Staff',
    expert: 'Expert',
    advanced: 'Advanced',
    undergraduate: 'Undergraduate',
    general: 'General',
  };
  return roleNames[role] || role;
}

/**
 * Get all scorer roles (excludes admin)
 */
export function getScorerRoles(): UserRole[] {
  return ['legislative_staff', 'expert', 'advanced', 'undergraduate', 'general'];
}

/**
 * Check if a role is a scorer role
 */
export function isScorerRole(role: UserRole): boolean {
  return role !== 'admin';
}
