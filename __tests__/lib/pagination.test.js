// __tests__/lib/pagination.test.js
import { getPaginationParams, createPaginatedResponse } from "@/lib/pagination";

describe("Pagination Utilities", () => {
  describe("getPaginationParams", () => {
    test("should return default pagination params", () => {
      const searchParams = new URLSearchParams();
      const params = getPaginationParams(searchParams);

      expect(params.page).toBe(1);
      expect(params.limit).toBe(10);
      expect(params.skip).toBe(0);
    });

    test("should parse custom page and limit", () => {
      const searchParams = new URLSearchParams({ page: "2", limit: "20" });
      const params = getPaginationParams(searchParams);

      expect(params.page).toBe(2);
      expect(params.limit).toBe(20);
      expect(params.skip).toBe(20);
    });

    test("should enforce minimum page of 1", () => {
      const searchParams = new URLSearchParams({ page: "0" });
      const params = getPaginationParams(searchParams);

      expect(params.page).toBe(1);
    });

    test("should enforce maximum limit of 100", () => {
      const searchParams = new URLSearchParams({ limit: "200" });
      const params = getPaginationParams(searchParams);

      expect(params.limit).toBe(100);
    });

    test("should enforce minimum limit of 1", () => {
      const searchParams = new URLSearchParams({ limit: "0" });
      const params = getPaginationParams(searchParams);

      expect(params.limit).toBe(1);
    });
  });

  describe("createPaginatedResponse", () => {
    test("should create paginated response with correct structure", () => {
      const data = [{ id: 1 }, { id: 2 }];
      const total = 25;
      const page = 2;
      const limit = 10;

      const response = createPaginatedResponse(data, total, page, limit);

      expect(response.data).toEqual(data);
      expect(response.pagination).toEqual({
        page: 2,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNext: true,
        hasPrev: true,
      });
    });

    test("should correctly calculate hasNext and hasPrev", () => {
      const data = [{ id: 1 }];
      const total = 10;
      const page = 1;
      const limit = 10;

      const response = createPaginatedResponse(data, total, page, limit);

      expect(response.pagination.hasNext).toBe(false);
      expect(response.pagination.hasPrev).toBe(false);
    });

    test("should handle empty data", () => {
      const response = createPaginatedResponse([], 0, 1, 10);

      expect(response.data).toEqual([]);
      expect(response.pagination.total).toBe(0);
      expect(response.pagination.totalPages).toBe(0);
    });
  });
});
