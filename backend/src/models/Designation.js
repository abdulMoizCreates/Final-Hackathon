import mongoose from "mongoose";

const designationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Designation", designationSchema);
