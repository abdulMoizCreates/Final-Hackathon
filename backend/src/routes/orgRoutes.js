import { Router } from "express";
import Settings from "../models/Settings.js";
import Department from "../models/Department.js";
import Designation from "../models/Designation.js";
import AuditLog from "../models/AuditLog.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});

    const departments = await Department.find().sort({ name: 1 });
    const designations = await Designation.find().sort({ name: 1 });

    res.json({
      settings,
      departments: departments.map((d) => d.name),
      designations: designations.map((d) => d.name),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/", auth, async (req, res) => {
  try {
    const { settings, departments, designations } = req.body;

    let current = await Settings.findOne();
    if (!current) current = new Settings();
    const beforeState = current.toObject();

    if (settings) {
      Object.assign(current, settings);
      await current.save();
    }

    if (Array.isArray(departments)) {
      await Department.deleteMany({});
      await Department.insertMany(departments.map((name) => ({ name })));
    }

    if (Array.isArray(designations)) {
      await Designation.deleteMany({});
      await Designation.insertMany(designations.map((name) => ({ name })));
    }

    await AuditLog.create({
      actor: req.user?.email || "Admin",
      action: "UPDATE",
      entity: "Organization Rules",
      before: beforeState,
      after: current.toObject(),
    });

    res.json({ message: "Organization updated successfully", settings: current });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/departments", async (req, res) => {
  try {
    const list = await Department.find().sort({ name: 1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/designations", async (req, res) => {
  try {
    const list = await Designation.find().sort({ name: 1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
