// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock environment variables
process.env.JWT_SECRET = "test-jwt-secret-key";
process.env.COOKIE_NAME = "auth-token";
process.env.MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/hospital-management-test";
process.env.NODE_ENV = "test";
