// app/api/lab-tests/route.js
import { connectDB } from "@/lib/db";
import LabTest from "@/models/LabTest";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.COOKIE_NAME)?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (user.role !== "doctor") {
      return new Response(JSON.stringify({ error: "Access Denied" }), { status: 403 });
    }

    const body = await req.json();
    const { patient, testName, testType, notes } = body;

    const newLabTest = await LabTest.create({
      patient,
      doctor: user.id,
      testName,
      testType,
      notes: notes || "",
    });

    return new Response(JSON.stringify(newLabTest), { status: 201 });
  } catch (err) {
    console.error("Error creating lab test:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.COOKIE_NAME)?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);

    let labTests;
    if (user.role === "patient") {
      const Patient = (await import("@/models/Patient")).default;
      const patient = await Patient.findOne({ email: user.email });
      if (patient) {
        labTests = await LabTest.find({ patient: patient._id })
          .populate("doctor", "name email")
          .populate("patient", "name email")
          .populate("uploadedBy", "name")
          .sort({ createdAt: -1 });
      } else {
        labTests = [];
      }
    } else if (user.role === "lab_technician") {
      labTests = await LabTest.find({ status: { $in: ["ordered", "in_progress"] } })
        .populate("doctor", "name email")
        .populate("patient", "name email")
        .sort({ createdAt: -1 });
    } else {
      labTests = await LabTest.find()
        .populate("doctor", "name email")
        .populate("patient", "name email")
        .populate("uploadedBy", "name")
        .sort({ createdAt: -1 });
    }

    return new Response(JSON.stringify(labTests), { status: 200 });
  } catch (err) {
    console.error("Error fetching lab tests:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

