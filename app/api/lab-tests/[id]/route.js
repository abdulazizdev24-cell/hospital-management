// app/api/lab-tests/[id]/route.js
import { connectDB } from "@/lib/db";
import LabTest from "@/models/LabTest";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.COOKIE_NAME)?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (user.role !== "lab_technician") {
      return new Response(JSON.stringify({ error: "Access Denied" }), { status: 403 });
    }

    const body = await req.json();
    const { status, results, notes } = body;

    const updateData = {
      status,
      results: results || "",
      notes: notes || "",
    };

    if (status === "completed") {
      updateData.uploadedBy = user.id;
      updateData.completedDate = new Date();
    }

    const labTest = await LabTest.findByIdAndUpdate(id, updateData, { new: true })
      .populate("doctor", "name email")
      .populate("patient", "name email")
      .populate("uploadedBy", "name");

    if (!labTest) {
      return new Response(JSON.stringify({ error: "Lab test not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(labTest), { status: 200 });
  } catch (err) {
    console.error("Error updating lab test:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

