import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    actor: { type: String, default: "System" },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    before: { type: mongoose.Schema.Types.Mixed, default: null },
    after: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);
