import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import assistantRoutes from "./routes/assistantRoutes.js";
import setupRoutes from "./routes/setupRoutes.js";
import orgRoutes from "./routes/orgRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import payrollRoutes from "./routes/payrollRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import { seedDemoUser } from "./utils/seed.js";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Mount All 9 PRD Core Modules
app.use("/api/auth", authRoutes);
app.use("/api/setup", setupRoutes);
app.use("/api/organization", orgRoutes);
app.use("/api/departments", orgRoutes);
app.use("/api/designations", orgRoutes);
app.use("/api/users", userRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/payslips", payrollRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/audit-log", auditRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/assistant", assistantRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

connectDB().then(() => {
  seedDemoUser();
  app.listen(PORT, () => {
    console.log(`HCM Lite Backend API running on port ${PORT}`);
  });
});
