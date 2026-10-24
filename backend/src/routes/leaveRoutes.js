import { Router } from "express";
import LeaveRequest from "../models/LeaveRequest.js";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.get("/balance", auth, async (req, res) => {
  try {
    let employee = null;
    if (req.user?.userId) {
      const u = await User.findById(req.user.userId);
      if (u?.employeeId) employee = await Employee.findById(u.employeeId);
    }

    const filter = employee ? { employeeId: employee._id, status: "approved" } : { status: "approved" };
    const approved = await LeaveRequest.find(filter);

    let annualUsed = 0, sickUsed = 0, casualUsed = 0;
    approved.forEach((l) => {
      if (l.type?.toLowerCase().includes("annual")) annualUsed += l.days;
      if (l.type?.toLowerCase().includes("sick")) sickUsed += l.days;
      if (l.type?.toLowerCase().includes("casual")) casualUsed += l.days;
    });

    res.json([
      { type: "Annual", remaining: Math.max(14 - annualUsed, 0), quota: 14 },
      { type: "Sick", remaining: Math.max(8 - sickUsed, 0), quota: 8 },
      { type: "Casual", remaining: Math.max(10 - casualUsed, 0), quota: 10 },
      { type: "Unpaid", remaining: "No limit", quota: "∞" },
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/preview", auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    res.json({ days: Math.max(days, 1) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;

    let employee = null;
    if (req.user?.userId) {
      const u = await User.findById(req.user.userId);
      if (u?.employeeId) employee = await Employee.findById(u.employeeId);
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const request = await LeaveRequest.create({
      employeeId: employee?._id || null,
      employeeName: employee?.name || "Staff Member",
      type,
      startDate,
      endDate,
      days: Math.max(days, 1),
      reason,
      status: "pending",
    });

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/my", auth, async (req, res) => {
  try {
    let employee = null;
    if (req.user?.userId) {
      const u = await User.findById(req.user.userId);
      if (u?.employeeId) employee = await Employee.findById(u.employeeId);
    }

    const filter = employee ? { employeeId: employee._id } : {};
    const list = await LeaveRequest.find(filter).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const list = await LeaveRequest.find(filter).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id/approve", auth, async (req, res) => {
  try {
    const { comment } = req.body;
    const item = await LeaveRequest.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Request not found" });

    item.status = "approved";
    item.decisionComment = comment || "Approved by HR";
    await item.save();

    await AuditLog.create({
      actor: req.user?.email || "HR",
      action: "APPROVE",
      entity: `Leave #${item._id} for ${item.employeeName}`,
      after: { status: "approved", comment },
    });

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id/reject", auth, async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment) return res.status(400).json({ message: "Rejection comment is mandatory" });

    const item = await LeaveRequest.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Request not found" });

    item.status = "rejected";
    item.decisionComment = comment;
    await item.save();

    await AuditLog.create({
      actor: req.user?.email || "HR",
      action: "REJECT",
      entity: `Leave #${item._id} for ${item.employeeName}`,
      after: { status: "rejected", comment },
    });

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
