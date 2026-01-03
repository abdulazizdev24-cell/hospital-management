// lib/response.js

/**
 * Create a standardized JSON response
 */
export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Create an error response
 */
export function errorResponse(message, status = 500) {
  return jsonResponse({ error: message }, status);
}

/**
 * Create a success response
 */
export function successResponse(data, status = 200) {
  return jsonResponse(data, status);
}
