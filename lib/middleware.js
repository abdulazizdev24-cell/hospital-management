// lib/middleware.js
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

/**
 * Authenticate user from JWT token in cookies
 * @returns {Promise<{id: string, role: string} | null>}
 */
export async function authenticateUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // contains { id, role, email? }
  } catch (err) {
    return null;
  }
}

/**
 * Require authentication - returns user or throws error response
 * @param {string[]} allowedRoles - Roles allowed to access (empty array = any authenticated user)
 * @returns {Promise<{id: string, role: string}>}
 */
export async function requireAuth(allowedRoles = []) {
  const user = await authenticateUser();

  if (!user) {
    throw new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    throw new Response(
      JSON.stringify({ error: "Access Denied" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  return user;
}
