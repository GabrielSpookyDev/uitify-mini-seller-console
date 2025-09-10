// src/lib/email.ts

/**
 * Minimal but reliable email validation.
 */
export function isValidEmail(email: string): boolean {
  const normalized = email.trim();
  if (normalized.length < 6 || normalized.length > 254) return false;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(normalized);
}

/** Lowercase + trim for canonical form. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Return validation message for UI, or empty string if valid. */
export function getEmailValidationMessage(email: string): string {
  if (!email.trim()) return 'Email is required.';
  if (!isValidEmail(email)) return 'Enter a valid email address.';
  return '';
}
