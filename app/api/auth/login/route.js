// app/api/auth/login/route.js
import { connectDB } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import { validateRequired, validateEmail } from "@/lib/validation";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, password } = body;

    // Validate required fields
    const requiredCheck = validateRequired(body, ["email", "password"]);
    if (!requiredCheck.valid) {
      return errorResponse(requiredCheck.error, 400);
    }

    // Validate email format
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      return errorResponse("Invalid email format", 400);
    }

    // Find user by email (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return errorResponse("Invalid email or password", 401);
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse("Invalid email or password", 401);
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set(process.env.COOKIE_NAME, token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return successResponse({
      message: "Login successful",
      role: user.role,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("Something went wrong", 500);
  }
}
