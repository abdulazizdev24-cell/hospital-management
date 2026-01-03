// models/Patient.js
import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    medicalHistory: {
      type: [String], // array of medical issues like ["Diabetes", "Allergy"]
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, // doctor/admin who created the patient record
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound indexes for common queries
PatientSchema.index({ createdAt: -1 });
PatientSchema.index({ email: 1, createdBy: 1 });

export default mongoose.models.Patient ||
  mongoose.model("Patient", PatientSchema);
