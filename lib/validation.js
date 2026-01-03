// lib/validation.js

/**
 * Validate email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate required fields in an object
 */
export function validateRequired(body, fields) {
  const missing = fields.filter((field) => !body[field] || body[field].toString().trim() === "");
  if (missing.length > 0) {
    return { valid: false, error: `Missing required fields: ${missing.join(", ")}` };
  }
  return { valid: true };
}

/**
 * Validate email format
 */
export function validateEmail(email) {
  if (!email || !isValidEmail(email)) {
    return { valid: false, error: "Invalid email format" };
  }
  return { valid: true };
}

/**
 * Validate password strength
 */
export function validatePassword(password, minLength = 6) {
  if (!password || password.length < minLength) {
    return { valid: false, error: `Password must be at least ${minLength} characters` };
  }
  return { valid: true };
}

/**
 * Validate role
 */
export function validateRole(role, allowedRoles) {
  if (!role || !allowedRoles.includes(role)) {
    return { valid: false, error: `Invalid role. Must be one of: ${allowedRoles.join(", ")}` };
  }
  return { valid: true };
}

/**
 * Validate date format
 */
export function validateDate(date) {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: "Invalid date format" };
  }
  return { valid: true, date: dateObj };
}

/**
 * Sanitize string input
 */
export function sanitizeString(str) {
  if (typeof str !== "string") return "";
  return str.trim();
}
