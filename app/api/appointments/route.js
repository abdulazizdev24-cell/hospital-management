// app/api/appointments/route.js
import { connectDB } from "@/lib/db";
import { requireAuth, authenticateUser } from "@/lib/middleware";
import { errorResponse, successResponse } from "@/lib/response";
import { validateRequired, validateDate, sanitizeString } from "@/lib/validation";
import { getPaginationParams, createPaginatedResponse } from "@/lib/pagination";
import Appointment from "@/models/Appointment";
import Patient from "@/models/Patient";

export async function POST(req) {
  try {
    await connectDB();
    const user = await requireAuth(["admin", "doctor"]);

    const body = await req.json();
    const { patient, doctor, date, time, reason, status } = body;

    // Validate required fields
    const requiredCheck = validateRequired(body, ["patient", "date", "time", "reason"]);
    if (!requiredCheck.valid) {
      return errorResponse(requiredCheck.error, 400);
    }

    // Validate date
    const dateCheck = validateDate(date);
    if (!dateCheck.valid) {
      return errorResponse(dateCheck.error, 400);
    }

    // Validate patient exists
    const patientExists = await Patient.findById(patient);
    if (!patientExists) {
      return errorResponse("Patient not found", 404);
    }

    // Validate status
    const validStatuses = ["scheduled", "completed", "cancelled"];
    const appointmentStatus = status && validStatuses.includes(status) ? status : "scheduled";

    const newAppointment = await Appointment.create({
      patient,
      doctor: doctor || user.id,
      date: dateCheck.date,
      time: sanitizeString(time),
      reason: sanitizeString(reason),
      status: appointmentStatus,
      assignedBy: user.role === "admin" ? user.id : undefined,
    });

    await newAppointment.populate([
      { path: "doctor", select: "name email" },
      { path: "patient", select: "name email" },
    ]);

    return successResponse(newAppointment, 201);
  } catch (err) {
    if (err instanceof Response) return err; // Re-throw auth errors
    console.error("Error creating appointment:", err);
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
    let sortOptions = { date: -1 };

    if (user.role === "patient") {
      // Patients can only see their own appointments
      const patient = await Patient.findOne({ email: user.email });
      if (!patient) {
        return successResponse(createPaginatedResponse([], 0, page, limit));
      }
      query.patient = patient._id;
      sortOptions = { date: 1, time: 1 };
    } else if (user.role === "doctor") {
      // Doctors see their appointments, upcoming first
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query.doctor = user.id;
      query.date = { $gte: today };
      sortOptions = { date: 1, time: 1 };
    }
    // Admins can see all appointments (no query filter)

    // Optional status filter
    const status = searchParams?.get("status");
    if (status && ["scheduled", "completed", "cancelled"].includes(status)) {
      query.status = status;
    }

    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .populate("doctor", "name email")
        .populate("patient", "name email age gender")
        .populate("assignedBy", "name")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit),
      Appointment.countDocuments(query),
    ]);

    const paginatedResponse = createPaginatedResponse(appointments, total, page, limit);
    return successResponse(paginatedResponse);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    return errorResponse("Server error", 500);
  }
}

