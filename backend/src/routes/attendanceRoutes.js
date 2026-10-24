import { Router } from "express";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import auth from "../middlewares/auth.js";

const router = Router();

const getTodayDate = () => new Date().toISOString().split("T")[0];
const getCurrentTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
};

router.post("/check-in", auth, async (req, res) => {
  try {
    const today = getTodayDate();
    const time = getCurrentTime();

    let employee = null;
    if (req.user?.userId) {
      const u = await User.findById(req.user.userId);
      if (u?.employeeId) {
        employee = await Employee.findById(u.employeeId);
      }
    }

    const filter = employee ? { employeeId: employee._id, date: today } : { date: today };
    let record = await Attendance.findOne(filter);

    if (record && record.checkIn) {
      return res.status(409).json({ message: "Already checked in today" });
    }

    const [h, m] = time.split(":").map(Number);
    const isLate = h > 9 || (h === 9 && m > 15);
    const status = isLate ? "late" : "present";

    if (!record) {
      record = new Attendance({
        employeeId: employee?._id || null,
        employeeName: employee?.name || "Staff Member",
        employeeCode: employee?.employeeCode || "EMP-001",
        department: employee?.department || "Operations",
        date: today,
      });
    }

    record.checkIn = time;
    record.status = status;
    record.isLate = isLate;
    await record.save();

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/check-out", auth, async (req, res) => {
  try {
    const today = getTodayDate();
    const time = getCurrentTime();

    let employee = null;
    if (req.user?.userId) {
      const u = await User.findById(req.user.userId);
      if (u?.employeeId) {
        employee = await Employee.findById(u.employeeId);
      }
    }

    const filter = employee ? { employeeId: employee._id, date: today } : { date: today };
    let record = await Attendance.findOne(filter);

    if (!record || !record.checkIn) {
      return res.status(422).json({ message: "No active check-in record found for today" });
    }

    record.checkOut = time;
    const [inH, inM] = record.checkIn.split(":").map(Number);
    const [outH, outM] = time.split(":").map(Number);
    const workedMin = (outH * 60 + outM) - (inH * 60 + inM);
    record.workedMinutes = Math.max(workedMin, 0);

    if (workedMin < 300) {
      record.status = "half_day";
    }

    await record.save();
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/today", auth, async (req, res) => {
  try {
    const today = getTodayDate();
    let employee = null;
    if (req.user?.userId) {
      const u = await User.findById(req.user.userId);
      if (u?.employeeId) {
        employee = await Employee.findById(u.employeeId);
      }
    }

    const filter = employee ? { employeeId: employee._id, date: today } : { date: today };
    const record = await Attendance.findOne(filter);
    res.json(record || { date: today, checkIn: null, checkOut: null, status: "absent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/my", auth, async (req, res) => {
  try {
    const { month } = req.query;
    let employee = null;
    if (req.user?.userId) {
      const u = await User.findById(req.user.userId);
      if (u?.employeeId) {
        employee = await Employee.findById(u.employeeId);
      }
    }

    const filter = {};
    if (employee) filter.employeeId = employee._id;
    if (month) filter.date = { $regex: `^${month}` };

    const records = await Attendance.find(filter).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const { date, department } = req.query;
    const filter = {};
    if (date) filter.date = date;
    if (department) filter.department = department;

    const records = await Attendance.find(filter).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
