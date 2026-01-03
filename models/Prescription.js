// models/Prescription.js
import mongoose from "mongoose";

const PrescriptionSchema = new mongoose.Schema(
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
    medicines: [
      {
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    notes: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "dispensed", "delivered"],
      default: "pending",
      index: true,
    },
    dispensedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dispensedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Compound indexes for common queries
PrescriptionSchema.index({ patient: 1, createdAt: -1 });
PrescriptionSchema.index({ doctor: 1, status: 1, createdAt: -1 });
PrescriptionSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Prescription ||
  mongoose.model("Prescription", PrescriptionSchema);

