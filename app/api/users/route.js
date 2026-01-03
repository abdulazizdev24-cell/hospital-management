// app/api/users/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.COOKIE_NAME)?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized - No token found" }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError);
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (user.role !== "admin") {
      console.error("Access denied - User role:", user.role);
      return new Response(JSON.stringify({ error: `Access Denied - Current role: ${user.role}, Required: admin` }), { 
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }

    const body = await req.json();
    const { name, email, password, role } = body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return new Response(JSON.stringify({ error: "All fields are required" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!["doctor", "pharmacist", "lab_technician"].includes(role)) {
      return new Response(JSON.stringify({ error: "Invalid role. Must be doctor, pharmacist, or lab_technician" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User with this email already exists" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    return new Response(JSON.stringify({ 
      message: "User created successfully", 
      user: { id: newUser._id, name, email, role } 
    }), { 
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Error creating user:", err);
    return new Response(JSON.stringify({ 
      error: "Server error", 
      details: err.message 
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.COOKIE_NAME)?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized - No token found" }), { status: 401 });
    }

    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError);
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 401 });
    }

    if (user.role !== "admin") {
      console.error("Access denied - User role:", user.role);
      return new Response(JSON.stringify({ error: `Access Denied - Current role: ${user.role}, Required: admin` }), { status: 403 });
    }

    const users = await User.find({ role: { $in: ["doctor", "pharmacist", "lab_technician"] } })
      .select("-password")
      .sort({ createdAt: -1 });

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (err) {
    console.error("Error fetching users:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

