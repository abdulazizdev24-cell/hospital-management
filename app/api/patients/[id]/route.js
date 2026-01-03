// app/api/patients/[id]/route.js
import { connectDB } from "@/lib/db";
import Patient from "@/models/Patient";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params; // ✅ await params

    const patient = await Patient.findById(id);
    if (!patient) {
      return new Response(JSON.stringify({ error: "Patient not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(patient), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = await params; // ✅ await params

    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.COOKIE_NAME)?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (user.role !== "doctor" && user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const data = await req.json();
    const updatedPatient = await Patient.findByIdAndUpdate(id, data, { new: true });

    if (!updatedPatient) {
      return new Response(JSON.stringify({ error: "Patient not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedPatient), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = await params; // ✅ await params

    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.COOKIE_NAME)?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const deleted = await Patient.findByIdAndDelete(id);
    if (!deleted) {
      return new Response(JSON.stringify({ error: "Patient not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Patient deleted" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
