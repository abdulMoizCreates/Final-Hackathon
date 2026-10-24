import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    authorName: { type: String, default: "Management" },
    authorRole: { type: String, default: "Admin" },
  },
  { timestamps: true }
);

export default mongoose.model("Announcement", announcementSchema);
