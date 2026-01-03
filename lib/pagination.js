// lib/pagination.js

/**
 * Parse pagination parameters from request
 */
export function getPaginationParams(searchParams) {
  const page = Math.max(1, parseInt(searchParams?.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams?.get("limit") || "10", 10)));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Create paginated response
 */
export function createPaginatedResponse(data, total, page, limit) {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
}
