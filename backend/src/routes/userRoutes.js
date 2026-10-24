import { Router } from "express";
import User from "../models/User.js";
import Employee from "../models/Employee.js";
import AuditLog from "../models/AuditLog.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshToken").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { name, email, role, employeeCode, basicSalary } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const tempPassword = `Temp@${Math.floor(100000 + Math.random() * 900000)}`;

    const user = await User.create({
      name,
      email,
      password: tempPassword,
      role: role || "HR",
      mustChangePassword: true,
    });

    if (employeeCode) {
      const emp = await Employee.create({
        name,
        email,
        employeeCode,
        department: "Human Resources",
        joinDate: new Date().toISOString().split("T")[0],
        basicSalary: basicSalary || 80000,
        userId: user._id,
      });
      user.employeeId = emp._id;
      await user.save();
    }

    await AuditLog.create({
      actor: req.user?.email || "Admin",
      action: "CREATE",
      entity: `User ${user.email} (${user.role})`,
      after: { email, role: user.role, name },
    });

    res.status(201).json({
      user,
      temporaryPassword: tempPassword,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:id/reset-password", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const tempPassword = `Reset@${Math.floor(100000 + Math.random() * 900000)}`;
    user.password = tempPassword;
    user.mustChangePassword = true;
    await user.save();

    await AuditLog.create({
      actor: req.user?.email || "Admin",
      action: "RESET",
      entity: `Password for ${user.email}`,
    });

    res.json({ message: "Password reset", temporaryPassword: tempPassword });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = status === "active";
    await user.save();

    res.json({ message: "Status updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
