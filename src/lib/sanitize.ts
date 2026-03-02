/**
 * Input sanitization utilities to prevent XSS and injection attacks.
 * Use these on all user-facing text inputs before storing or displaying.
 */

/** Strip HTML tags and trim whitespace */
export const sanitizeText = (input: string): string => {
  return input
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/[<>"'`]/g, "") // strip potentially dangerous characters
    .trim();
};

/** Sanitize and enforce max length */
export const sanitizeField = (input: string, maxLength = 255): string => {
  return sanitizeText(input).slice(0, maxLength);
};

/** Sanitize name fields (letters, spaces, hyphens, apostrophes only) */
export const sanitizeName = (input: string, maxLength = 100): string => {
  return input
    .replace(/[^a-zA-ZÀ-ÿ\s'\-\.]/g, "") // allow letters, accented, spaces, apostrophe, hyphen, period
    .trim()
    .slice(0, maxLength);
};

/** Sanitize phone (digits, +, spaces, parens, hyphens only) */
export const sanitizePhone = (input: string): string => {
  return input
    .replace(/[^0-9+\s()\-]/g, "")
    .trim()
    .slice(0, 20);
};

/** Sanitize ZIP code (digits and hyphen only) */
export const sanitizeZip = (input: string): string => {
  return input
    .replace(/[^0-9\-]/g, "")
    .slice(0, 10);
};

/** Sanitize email (basic character enforcement) */
export const sanitizeEmail = (input: string): string => {
  return input
    .replace(/[^a-zA-Z0-9@._+\-]/g, "")
    .trim()
    .toLowerCase()
    .slice(0, 255);
};

/** Sanitize address fields */
export const sanitizeAddress = (input: string, maxLength = 200): string => {
  return input
    .replace(/[<>"'`]/g, "")
    .trim()
    .slice(0, maxLength);
};

/** Sanitize chat/message input (strip HTML but allow more characters) */
export const sanitizeMessage = (input: string, maxLength = 2000): string => {
  return input
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "") // remove script tags
    .replace(/<[^>]*>/g, "") // strip remaining HTML tags
    .trim()
    .slice(0, maxLength);
};

/** Validate email format */
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 255;
};

/** Validate phone (at least 10 digits) */
export const isValidPhone = (phone: string): boolean => {
  return phone.replace(/\D/g, "").length >= 10;
};

/** Validate password strength */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};
