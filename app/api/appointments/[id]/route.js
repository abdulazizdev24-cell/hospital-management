// app/api/appointments/[id]/route.js
import { connectDB } from "@/lib/db";
import Appointment from "@/models/Appointment";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Update appointment (mark checked/completed or cancel)
export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.COOKIE_NAME)?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized - No token found" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError);
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Only admin or doctor can update an appointment
    if (user.role !== "admin" && user.role !== "doctor") {
      return new Response(
        JSON.stringify({ error: `Access Denied - Current role: ${user.role}, Required: admin or doctor` }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { status } = body;

    const validStatuses = ["scheduled", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return new Response(JSON.stringify({ error: "Invalid status" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updated = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("doctor", "name email")
      .populate("patient", "name email age gender");

    if (!updated) {
      return new Response(JSON.stringify({ error: "Appointment not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error updating appointment:", err);
    return new Response(JSON.stringify({ error: "Server error", details: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


