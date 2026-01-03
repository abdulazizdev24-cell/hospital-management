// app/api/patients/route.js
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/middleware";
import { errorResponse, successResponse } from "@/lib/response";
import { validateRequired, validateEmail, sanitizeString } from "@/lib/validation";
import { getPaginationParams, createPaginatedResponse } from "@/lib/pagination";
import Patient from "@/models/Patient";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const user = await requireAuth(["admin", "doctor"]);

    const body = await req.json();
    const { name, email, age, gender, medicalHistory, password } = body;

    // Validate required fields
    const requiredCheck = validateRequired(body, ["name", "email", "age", "gender"]);
    if (!requiredCheck.valid) {
      return errorResponse(requiredCheck.error, 400);
    }

    // Validate email
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      return errorResponse(emailCheck.error, 400);
    }

    // Validate gender
    if (!["male", "female", "other"].includes(gender)) {
      return errorResponse("Invalid gender. Must be male, female, or other", 400);
    }

    // Check if patient already exists
    const existingPatient = await Patient.findOne({ email: email.toLowerCase() });
    if (existingPatient) {
      return errorResponse("Patient with this email already exists", 400);
    }

    // If password is provided (admin creating patient with login access), create User account
    if (password && password.trim() !== "" && user.role === "admin") {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return errorResponse("User with this email already exists", 400);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        name: sanitizeString(name),
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "patient",
      });
    }

    const newPatient = await Patient.create({
      name: sanitizeString(name),
      email: email.toLowerCase(),
      age: parseInt(age, 10),
      gender,
      medicalHistory: Array.isArray(medicalHistory) ? medicalHistory : [],
      createdBy: user.id,
    });

    return successResponse(newPatient, 201);
  } catch (err) {
    if (err instanceof Response) return err; // Re-throw auth errors
    console.error("Error creating patient:", err);
    return errorResponse("Server error", 500);
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const user = await requireAuth(["admin", "doctor"]);

    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPaginationParams(searchParams);

    const query = {};
    
    // Optional search by name or email
    const search = searchParams?.get("search");
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [patients, total] = await Promise.all([
      Patient.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "name email"),
      Patient.countDocuments(query),
    ]);

    const paginatedResponse = createPaginatedResponse(patients, total, page, limit);
    return successResponse(paginatedResponse);
  } catch (err) {
    if (err instanceof Response) return err; // Re-throw auth errors
    console.error("Error fetching patients:", err);
    return errorResponse("Server error", 500);
  }
}
