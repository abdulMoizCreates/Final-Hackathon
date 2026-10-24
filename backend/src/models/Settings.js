import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: "HCM Lite Corp" },
    timezone: { type: String, default: "Asia/Karachi" },
    officeStart: { type: String, default: "09:00" },
    graceMinutes: { type: Number, default: 15 },
    halfDayHours: { type: Number, default: 5 },
    weekendDays: { type: [String], default: ["Saturday", "Sunday"] },
    latitude: { type: String, default: "24.8607" },
    longitude: { type: String, default: "67.0011" },
    radiusMeters: { type: Number, default: 150 },
    setupComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
