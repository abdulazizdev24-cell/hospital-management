// __tests__/lib/validation.test.js
import {
  isValidEmail,
  validateRequired,
  validateEmail,
  validatePassword,
  validateRole,
  validateDate,
  sanitizeString,
} from "@/lib/validation";

describe("Validation Utilities", () => {
  describe("isValidEmail", () => {
    test("should return true for valid email", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name@domain.co.uk")).toBe(true);
    });

    test("should return false for invalid email", () => {
      expect(isValidEmail("invalid-email")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
      expect(isValidEmail("test@")).toBe(false);
      expect(isValidEmail("")).toBe(false);
    });
  });

  describe("validateRequired", () => {
    test("should return valid for all required fields present", () => {
      const body = { name: "John", email: "john@example.com", age: 30 };
      const result = validateRequired(body, ["name", "email", "age"]);
      expect(result.valid).toBe(true);
    });

    test("should return invalid for missing fields", () => {
      const body = { name: "John", email: "" };
      const result = validateRequired(body, ["name", "email", "age"]);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Missing required fields");
    });

    test("should handle empty strings as missing", () => {
      const body = { name: "John", email: "   " };
      const result = validateRequired(body, ["name", "email"]);
      expect(result.valid).toBe(false);
    });
  });

  describe("validateEmail", () => {
    test("should return valid for correct email", () => {
      const result = validateEmail("test@example.com");
      expect(result.valid).toBe(true);
    });

    test("should return invalid for incorrect email", () => {
      const result = validateEmail("invalid-email");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Invalid email format");
    });
  });

  describe("validatePassword", () => {
    test("should return valid for password meeting minimum length", () => {
      const result = validatePassword("password123", 6);
      expect(result.valid).toBe(true);
    });

    test("should return invalid for password below minimum length", () => {
      const result = validatePassword("pass", 6);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("at least 6 characters");
    });

    test("should use default minimum length of 6", () => {
      const result = validatePassword("pass", 6);
      expect(result.valid).toBe(false);
    });
  });

  describe("validateRole", () => {
    test("should return valid for allowed role", () => {
      const result = validateRole("admin", ["admin", "doctor", "patient"]);
      expect(result.valid).toBe(true);
    });

    test("should return invalid for disallowed role", () => {
      const result = validateRole("invalid", ["admin", "doctor"]);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Invalid role");
    });
  });

  describe("validateDate", () => {
    test("should return valid for valid date string", () => {
      const result = validateDate("2024-01-15");
      expect(result.valid).toBe(true);
      expect(result.date).toBeInstanceOf(Date);
    });

    test("should return invalid for invalid date", () => {
      const result = validateDate("invalid-date");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Invalid date format");
    });
  });

  describe("sanitizeString", () => {
    test("should trim whitespace", () => {
      expect(sanitizeString("  test  ")).toBe("test");
    });

    test("should return empty string for non-string input", () => {
      expect(sanitizeString(null)).toBe("");
      expect(sanitizeString(123)).toBe("");
      expect(sanitizeString(undefined)).toBe("");
    });

    test("should handle empty string", () => {
      expect(sanitizeString("")).toBe("");
    });
  });
});
