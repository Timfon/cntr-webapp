/**
 * Input Validation Utilities
 * Provides comprehensive validation for all service parameters
 */

// UUID v4 regex pattern
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Max sizes for preventing DoS
const MAX_STRING_LENGTH = 10000;
const MAX_SEARCH_LENGTH = 500;
const MAX_OBJECT_KEYS = 1000;
const MAX_PAGE_SIZE = 100;

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validate that a string is a valid UUID v4
 */
export function validateUUID(value: string, fieldName: string = 'id'): void {
  if (!value || typeof value !== 'string') {
    throw new ValidationError(`${fieldName} is required and must be a string`);
  }
  if (!UUID_REGEX.test(value)) {
    throw new ValidationError(`${fieldName} must be a valid UUID`);
  }
}

/**
 * Validate that a string is non-empty and within size limits
 */
export function validateString(
  value: string,
  fieldName: string,
  options: { required?: boolean; maxLength?: number; minLength?: number } = {}
): void {
  const { required = true, maxLength = MAX_STRING_LENGTH, minLength = 0 } = options;

  if (required && (!value || typeof value !== 'string' || value.trim() === '')) {
    throw new ValidationError(`${fieldName} is required`);
  }

  if (value && typeof value === 'string') {
    if (value.length > maxLength) {
      throw new ValidationError(`${fieldName} exceeds maximum length of ${maxLength}`);
    }
    if (value.length < minLength) {
      throw new ValidationError(`${fieldName} must be at least ${minLength} characters`);
    }
  }
}

/**
 * Validate search string - sanitizes and limits length
 */
export function validateSearchString(value: string): string {
  if (!value || typeof value !== 'string') {
    return '';
  }

  // Trim and limit length
  let sanitized = value.trim().substring(0, MAX_SEARCH_LENGTH);

  // Remove potentially dangerous characters for PostgREST filters
  // Allow alphanumeric, spaces, and common punctuation
  sanitized = sanitized.replace(/[^\w\s\-.,!?'"()]/g, '');

  return sanitized;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): void {
  if (!email || typeof email !== 'string') {
    throw new ValidationError('Email is required');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }

  if (email.length > 254) {
    throw new ValidationError('Email exceeds maximum length');
  }
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): void {
  if (!password || typeof password !== 'string') {
    throw new ValidationError('Password is required');
  }

  if (password.length < 6) {
    throw new ValidationError('Password must be at least 6 characters');
  }

  if (password.length > 128) {
    throw new ValidationError('Password exceeds maximum length');
  }
}

/**
 * Validate an object doesn't exceed size limits (prevents DoS)
 */
export function validateObjectSize(
  obj: Record<string, any>,
  fieldName: string,
  maxKeys: number = MAX_OBJECT_KEYS
): void {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    throw new ValidationError(`${fieldName} must be an object`);
  }

  const keyCount = Object.keys(obj).length;
  if (keyCount > maxKeys) {
    throw new ValidationError(`${fieldName} exceeds maximum of ${maxKeys} entries`);
  }

  const jsonSize = JSON.stringify(obj).length;
  if (jsonSize > 1000000) {
    // 1MB limit
    throw new ValidationError(`${fieldName} data size exceeds limit`);
  }
}

/**
 * Validate pagination parameters
 */
export function validatePagination(
  page?: number,
  pageSize?: number
): { page: number; pageSize: number } {
  const validatedPage = Math.max(1, Math.floor(page || 1));
  const validatedPageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Math.floor(pageSize || 20))
  );

  return { page: validatedPage, pageSize: validatedPageSize };
}

/**
 * Validate date string format (ISO 8601)
 */
export function validateDateString(value: string, fieldName: string): void {
  if (!value || typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a valid date string`);
  }

  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new ValidationError(`${fieldName} is not a valid date`);
  }
}

/**
 * Validate date range (end must be after start)
 */
export function validateDateRange(startDate: string, endDate: string): void {
  validateDateString(startDate, 'start_date');
  validateDateString(endDate, 'end_date');

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end < start) {
    throw new ValidationError('end_date must be after start_date');
  }
}

/**
 * Validate user role
 */
export function validateUserRole(role: string): void {
  const validRoles = ['undergraduate', 'advanced', 'expert', 'legislative_staff', 'general', 'admin'];
  if (!validRoles.includes(role)) {
    throw new ValidationError(`Invalid role: ${role}`);
  }
}

/**
 * Validate assignment status
 */
export function validateAssignmentStatus(status: string): void {
  const validStatuses = ['assigned', 'in_progress', 'completed'];
  if (!validStatuses.includes(status)) {
    throw new ValidationError(`Invalid assignment status: ${status}`);
  }
}

/**
 * Sanitize column name for orderBy to prevent injection
 */
export function validateOrderByColumn(column: string, allowedColumns: string[]): string {
  if (!column || typeof column !== 'string') {
    return allowedColumns[0] || 'created_at';
  }

  const sanitized = column.trim().toLowerCase();
  if (!allowedColumns.includes(sanitized)) {
    throw new ValidationError(`Invalid sort column: ${column}`);
  }

  return sanitized;
}

/**
 * Type guard for validating Supabase response matches expected structure
 */
export function validateResponseStructure<T>(
  data: unknown,
  requiredFields: (keyof T)[]
): data is T {
  if (!data || typeof data !== 'object') {
    return false;
  }

  for (const field of requiredFields) {
    if (!(field in data)) {
      return false;
    }
  }

  return true;
}
