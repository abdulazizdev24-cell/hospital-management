// app/api/prescriptions/route.js
import { connectDB } from "@/lib/db";
import Prescription from "@/models/Prescription";
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
    const { patient, medicines, notes } = body;

    const newPrescription = await Prescription.create({
      patient,
      doctor: user.id,
      medicines,
      notes: notes || "",
    });

    return new Response(JSON.stringify(newPrescription), { status: 201 });
  } catch (err) {
    console.error("Error creating prescription:", err);
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

    let prescriptions;
    if (user.role === "patient") {
      const Patient = (await import("@/models/Patient")).default;
      const patient = await Patient.findOne({ email: user.email });
      if (patient) {
        prescriptions = await Prescription.find({ patient: patient._id })
          .populate("doctor", "name email")
          .populate("patient", "name email")
          .populate("dispensedBy", "name")
          .sort({ createdAt: -1 });
      } else {
        prescriptions = [];
      }
    } else if (user.role === "pharmacist") {
      prescriptions = await Prescription.find({ status: { $in: ["pending", "dispensed"] } })
        .populate("doctor", "name email")
        .populate("patient", "name email")
        .sort({ createdAt: -1 });
    } else {
      prescriptions = await Prescription.find()
        .populate("doctor", "name email")
        .populate("patient", "name email")
        .populate("dispensedBy", "name")
        .sort({ createdAt: -1 });
    }

    return new Response(JSON.stringify(prescriptions), { status: 200 });
  } catch (err) {
    console.error("Error fetching prescriptions:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

