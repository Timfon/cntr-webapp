/**
 * Shared formatting utilities
 */

import { Bill } from '@/types/database';

/**
 * Format a date string to MM/DD/YYYY format
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
}

/**
 * Format a date range for display
 */
export function formatDateRange(startDate: string | null, endDate: string | null): string {
  if (!startDate || !endDate) return 'Select Date Range';
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

/**
 * Format a bill identifier (state + bill number)
 */
export function formatBillId(bill: Bill): string {
  return `${bill.state} ${bill.bill_number || ''}`.trim();
}

/**
 * Capitalize first letter of each word (for role display)
 */
export function formatRole(role: string): string {
  return role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number = 180): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
