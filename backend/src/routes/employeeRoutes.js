import { Router } from "express";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.get("/", auth, async (req, res) => {
  try {
    const { search, department, status } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { employeeCode: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (department) filter.department = department;
    if (status) filter.status = status;

    const employees = await Employee.find(filter).sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { name, email, phone, gender, employeeCode, department, designation, joinDate, basicSalary } = req.body;

    const existingCode = await Employee.findOne({ employeeCode });
    if (existingCode) return res.status(409).json({ message: "Employee code already in use" });

    const existingEmail = await Employee.findOne({ email });
    if (existingEmail) return res.status(409).json({ message: "Email already in use" });

    const tempPassword = `Pass@${Math.floor(100000 + Math.random() * 900000)}`;

    const user = await User.create({
      name,
      email,
      password: tempPassword,
      role: "Employee",
      mustChangePassword: true,
    });

    const employee = await Employee.create({
      name,
      email,
      phone,
      gender,
      employeeCode,
      department,
      designation,
      joinDate,
      basicSalary,
      userId: user._id,
    });

    user.employeeId = employee._id;
    await user.save();

    await AuditLog.create({
      actor: req.user?.email || "HR",
      action: "REGISTER",
      entity: `Employee ${name} (${employeeCode})`,
      after: { employeeCode, department, basicSalary },
    });

    res.status(201).json({
      employee,
      temporaryPassword: tempPassword,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
