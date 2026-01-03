// __tests__/api/patients.test.js
import { GET, POST } from "@/app/api/patients/route";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/middleware";
import Patient from "@/models/Patient";
import User from "@/models/User";

// Mock dependencies
jest.mock("@/lib/db");
jest.mock("@/lib/middleware");
jest.mock("@/models/Patient");
jest.mock("@/models/User");

describe("Patients API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    connectDB.mockResolvedValue();
  });

  describe("POST /api/patients", () => {
    test("should create a patient successfully", async () => {
      const mockUser = { id: "user123", role: "admin" };
      requireAuth.mockResolvedValue(mockUser);

      const mockPatient = {
        _id: "patient123",
        name: "John Doe",
        email: "john@example.com",
        age: 30,
        gender: "male",
      };

      Patient.findOne.mockResolvedValue(null);
      Patient.create.mockResolvedValue(mockPatient);

      const req = {
        json: async () => ({
          name: "John Doe",
          email: "john@example.com",
          age: 30,
          gender: "male",
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.name).toBe("John Doe");
      expect(Patient.create).toHaveBeenCalled();
    });

    test("should return error for missing required fields", async () => {
      const mockUser = { id: "user123", role: "admin" };
      requireAuth.mockResolvedValue(mockUser);

      const req = {
        json: async () => ({
          name: "John Doe",
          // Missing email, age, gender
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Missing required fields");
    });

    test("should return error for invalid gender", async () => {
      const mockUser = { id: "user123", role: "admin" };
      requireAuth.mockResolvedValue(mockUser);

      const req = {
        json: async () => ({
          name: "John Doe",
          email: "john@example.com",
          age: 30,
          gender: "invalid",
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Invalid gender");
    });
  });

  describe("GET /api/patients", () => {
    test("should return paginated list of patients", async () => {
      const mockUser = { id: "user123", role: "admin" };
      requireAuth.mockResolvedValue(mockUser);

      const mockPatients = [
        { _id: "1", name: "Patient 1", email: "p1@example.com" },
        { _id: "2", name: "Patient 2", email: "p2@example.com" },
      ];

      Patient.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(mockPatients),
      });

      Patient.countDocuments.mockResolvedValue(2);

      const req = {
        url: "http://localhost:3000/api/patients?page=1&limit=10",
      };

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(2);
      expect(data.pagination).toBeDefined();
      expect(data.pagination.total).toBe(2);
    });

    test("should return error if not authenticated", async () => {
      requireAuth.mockRejectedValue(
        new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
      );

      const req = { url: "http://localhost:3000/api/patients" };

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });
  });
});
