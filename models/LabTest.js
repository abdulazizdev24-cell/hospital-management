// models/LabTest.js
import mongoose from "mongoose";

const LabTestSchema = new mongoose.Schema(
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
    testName: {
      type: String,
      required: true,
    },
    testType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["ordered", "in_progress", "completed"],
      default: "ordered",
      index: true,
    },
    orderedDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    completedDate: {
      type: Date,
    },
    results: {
      type: String,
      default: "",
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Compound indexes for common queries
LabTestSchema.index({ patient: 1, orderedDate: -1 });
LabTestSchema.index({ doctor: 1, status: 1, orderedDate: -1 });

export default mongoose.models.LabTest ||
  mongoose.model("LabTest", LabTestSchema);

