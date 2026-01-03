// __tests__/lib/response.test.js
import { jsonResponse, errorResponse, successResponse } from "@/lib/response";

describe("Response Utilities", () => {
  describe("jsonResponse", () => {
    test("should create response with correct status and headers", async () => {
      const data = { message: "test" };
      const response = jsonResponse(data, 200);

      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toBe("application/json");

      const json = await response.json();
      expect(json).toEqual(data);
    });

    test("should use default status 200", async () => {
      const response = jsonResponse({ test: true });
      expect(response.status).toBe(200);
    });
  });

  describe("errorResponse", () => {
    test("should create error response with message", async () => {
      const response = errorResponse("Error message", 400);

      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json).toEqual({ error: "Error message" });
    });

    test("should use default status 500", async () => {
      const response = errorResponse("Error");
      expect(response.status).toBe(500);
    });
  });

  describe("successResponse", () => {
    test("should create success response with data", async () => {
      const data = { id: 1, name: "Test" };
      const response = successResponse(data, 201);

      expect(response.status).toBe(201);
      const json = await response.json();
      expect(json).toEqual(data);
    });

    test("should use default status 200", async () => {
      const response = successResponse({ success: true });
      expect(response.status).toBe(200);
    });
  });
});
