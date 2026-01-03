// lib/auth.js
import jwt from "jsonwebtoken";

export const verifyUser = (req) => {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => c.split("="))
    );
    const token = cookies[process.env.COOKIE_NAME];
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // contains { id, role }
  } catch (err) {
    return null;
  }
};
