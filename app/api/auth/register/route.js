// app/api/auth/register/route.js
import { connectDB } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import { validateRequired, validateEmail, validatePassword, sanitizeString } from "@/lib/validation";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, password } = body;

    // Validate required fields
    const requiredCheck = validateRequired(body, ["name", "email", "password"]);
    if (!requiredCheck.valid) {
      return errorResponse(requiredCheck.error, 400);
    }

    // Validate email format
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      return errorResponse(emailCheck.error, 400);
    }

    // Validate password strength
    const passwordCheck = validatePassword(password, 6);
    if (!passwordCheck.valid) {
      return errorResponse(passwordCheck.error, 400);
    }

    // Check if user already exists (case-insensitive)
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse("User already exists", 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name: sanitizeString(name),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "patient", // default role
    });

    return successResponse(
      {
        message: "User registered successfully",
        user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
      },
      201
    );
  } catch (error) {
    console.error("Register error:", error);
    // Handle duplicate key error
    if (error.code === 11000) {
      return errorResponse("User already exists", 400);
    }
    return errorResponse("Something went wrong", 500);
  }
}
