import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    employeeCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    gender: { type: String, enum: ["Male", "Female", "Other", ""], default: "" },
    department: { type: String, required: true },
    designation: { type: String, default: "" },
    joinDate: { type: String, required: true },
    status: { type: String, enum: ["active", "probation", "exited"], default: "active" },
    basicSalary: { type: Number, required: true },
    grossSalary: { type: Number, default: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

employeeSchema.pre("save", function () {
  if (this.basicSalary) {
    this.grossSalary = Math.round(this.basicSalary * 1.5);
  }
});

export default mongoose.model("Employee", employeeSchema);
