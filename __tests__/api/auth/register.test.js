// __tests__/api/auth/register.test.js
import { POST } from "@/app/api/auth/register/route";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

// Mock dependencies
jest.mock("@/lib/db");
jest.mock("@/models/User");

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    connectDB.mockResolvedValue();
  });

  test("should register a new user successfully", async () => {
    const mockUser = {
      _id: "user123",
      name: "Test User",
      email: "test@example.com",
      role: "patient",
    };

    User.findOne.mockResolvedValue(null); // User doesn't exist
    User.create.mockResolvedValue(mockUser);

    const req = {
      json: async () => ({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      }),
    };

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.message).toBe("User registered successfully");
    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Test User",
        email: "test@example.com",
        role: "patient",
      })
    );
  });

  test("should return error for missing required fields", async () => {
    const req = {
      json: async () => ({
        name: "Test User",
        // Missing email and password
      }),
    };

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Missing required fields");
  });

  test("should return error for invalid email format", async () => {
    const req = {
      json: async () => ({
        name: "Test User",
        email: "invalid-email",
        password: "password123",
      }),
    };

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Invalid email format");
  });

  test("should return error for weak password", async () => {
    const req = {
      json: async () => ({
        name: "Test User",
        email: "test@example.com",
        password: "123", // Too short
      }),
    };

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("at least 6 characters");
  });

  test("should return error if user already exists", async () => {
    User.findOne.mockResolvedValue({ _id: "existing", email: "test@example.com" });

    const req = {
      json: async () => ({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      }),
    };

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("User already exists");
  });
});
