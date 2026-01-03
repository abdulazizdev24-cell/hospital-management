// app/api/prescriptions/[id]/route.js
import { connectDB } from "@/lib/db";
import Prescription from "@/models/Prescription";
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

    if (user.role !== "pharmacist") {
      return new Response(JSON.stringify({ error: "Access Denied" }), { status: 403 });
    }

    const body = await req.json();
    const { status } = body;

    const updateData = { status };
    if (status === "dispensed" || status === "delivered") {
      updateData.dispensedBy = user.id;
      updateData.dispensedAt = new Date();
    }

    const prescription = await Prescription.findByIdAndUpdate(id, updateData, { new: true })
      .populate("doctor", "name email")
      .populate("patient", "name email");

    if (!prescription) {
      return new Response(JSON.stringify({ error: "Prescription not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(prescription), { status: 200 });
  } catch (err) {
    console.error("Error updating prescription:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

