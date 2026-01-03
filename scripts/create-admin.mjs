// scripts/create-admin.mjs
// Run this script to create an admin user
// Usage: node scripts/create-admin.mjs

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
try {
  const envPath = join(__dirname, "../.env.local");
  const envFile = readFileSync(envPath, "utf8");
  envFile.split("\n").forEach(line => {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length) {
      process.env[key.trim()] = valueParts.join("=").trim();
    }
  });
} catch (err) {
  console.log("⚠️  .env.local not found, using default MongoDB URI");
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/hospital-management";

// Define User schema inline
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "doctor", "patient", "pharmacist", "lab_technician"], default: "patient" },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@hospital.com" });
    if (existingAdmin) {
      console.log("❌ Admin user already exists!");
      console.log("Email: admin@hospital.com");
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    const admin = new User({
      name: "Admin User",
      email: "admin@hospital.com",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin user created successfully!");
    console.log("\n📋 Admin Credentials:");
    console.log("Email: admin@hospital.com");
    console.log("Password: admin123");
    console.log("\n⚠️  Please change the password after first login!");
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createAdmin();

