// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["admin", "doctor", "patient", "pharmacist", "lab_technician"],
      default: "patient",
      index: true,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite in development
export default mongoose.models.User || mongoose.model("User", UserSchema);
