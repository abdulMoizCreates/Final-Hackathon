import mongoose from "mongoose";

const payrollRunSchema = new mongoose.Schema(
  {
    month: { type: String, required: true, unique: true }, // "YYYY-MM"
    status: { type: String, enum: ["draft", "finalized"], default: "draft" },
    employeeCount: { type: Number, default: 0 },
    totalGross: { type: Number, default: 0 },
    totalDeductions: { type: Number, default: 0 },
    totalTax: { type: Number, default: 0 },
    totalNet: { type: Number, default: 0 },
    finalizedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("PayrollRun", payrollRunSchema);
