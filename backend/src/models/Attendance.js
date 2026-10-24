import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", default: null },
    employeeName: { type: String, default: "" },
    employeeCode: { type: String, default: "" },
    department: { type: String, default: "" },
    date: { type: String, required: true }, // "YYYY-MM-DD"
    checkIn: { type: String, default: null }, // "HH:mm"
    checkOut: { type: String, default: null }, // "HH:mm"
    status: {
      type: String,
      enum: ["present", "late", "half_day", "absent", "on_leave", "missing_checkout"],
      default: "present",
    },
    isLate: { type: Boolean, default: false },
    workedMinutes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);
