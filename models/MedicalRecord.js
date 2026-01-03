// models/MedicalRecord.js
import mongoose from "mongoose";

const MedicalRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    symptoms: {
      type: [String],
      default: [],
    },
    prescription: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    visitDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound indexes for common queries
MedicalRecordSchema.index({ patient: 1, visitDate: -1 });
MedicalRecordSchema.index({ doctor: 1, visitDate: -1 });

export default mongoose.models.MedicalRecord ||
  mongoose.model("MedicalRecord", MedicalRecordSchema);

