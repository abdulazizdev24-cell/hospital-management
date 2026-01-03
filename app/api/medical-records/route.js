// app/api/medical-records/route.js
import { connectDB } from "@/lib/db";
import { requireAuth, authenticateUser } from "@/lib/middleware";
import { errorResponse, successResponse } from "@/lib/response";
import { validateRequired, sanitizeString } from "@/lib/validation";
import { getPaginationParams, createPaginatedResponse } from "@/lib/pagination";
import MedicalRecord from "@/models/MedicalRecord";
import Patient from "@/models/Patient";

export async function POST(req) {
  try {
    await connectDB();
    const user = await requireAuth(["admin", "doctor"]);

    const body = await req.json();
    const { patient, diagnosis, symptoms, prescription, notes } = body;

    // Validate required fields
    const requiredCheck = validateRequired(body, ["patient", "diagnosis"]);
    if (!requiredCheck.valid) {
      return errorResponse(requiredCheck.error, 400);
    }

    // Validate patient exists
    const patientExists = await Patient.findById(patient);
    if (!patientExists) {
      return errorResponse("Patient not found", 404);
    }

    const newRecord = await MedicalRecord.create({
      patient,
      doctor: user.id,
      diagnosis: sanitizeString(diagnosis),
      symptoms: Array.isArray(symptoms) 
        ? symptoms.map(s => sanitizeString(s)).filter(Boolean)
        : [sanitizeString(symptoms)].filter(Boolean),
      prescription: sanitizeString(prescription || ""),
      notes: sanitizeString(notes || ""),
    });

    await newRecord.populate([
      { path: "doctor", select: "name email" },
      { path: "patient", select: "name email" },
    ]);

    return successResponse(newRecord, 201);
  } catch (err) {
    if (err instanceof Response) return err; // Re-throw auth errors
    console.error("Error creating medical record:", err);
    return errorResponse("Server error", 500);
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const user = await authenticateUser();

    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPaginationParams(searchParams);

    let query = {};

    if (user.role === "patient") {
      // Patients can only see their own records
      const patient = await Patient.findOne({ email: user.email });
      if (!patient) {
        return successResponse(createPaginatedResponse([], 0, page, limit));
      }
      query.patient = patient._id;
    }
    // Doctors and admins can see all records (no query filter)

    // Optional patient filter for doctors/admins
    if ((user.role === "doctor" || user.role === "admin") && searchParams?.get("patient")) {
      query.patient = searchParams.get("patient");
    }

    const [records, total] = await Promise.all([
      MedicalRecord.find(query)
        .populate("doctor", "name email")
        .populate("patient", "name email age gender")
        .sort({ visitDate: -1 })
        .skip(skip)
        .limit(limit),
      MedicalRecord.countDocuments(query),
    ]);

    const paginatedResponse = createPaginatedResponse(records, total, page, limit);
    return successResponse(paginatedResponse);
  } catch (err) {
    console.error("Error fetching medical records:", err);
    return errorResponse("Server error", 500);
  }
}

