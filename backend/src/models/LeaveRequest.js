import mongoose from "mongoose";

const leaveRequestSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", default: null },
    employeeName: { type: String, default: "" },
    type: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    days: { type: Number, default: 1 },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },
    decisionComment: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("LeaveRequest", leaveRequestSchema);
