import { Router } from "express";
import Settings from "../models/Settings.js";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";

const router = Router();

router.get("/status", async (req, res) => {
  try {
    const settings = await Settings.findOne();
    const adminCount = await User.countDocuments({ role: "Admin" });
    res.json({
      initialized: !!adminCount,
      setupComplete: settings?.setupComplete || false,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { companyName, timezone, adminName, adminEmail, adminPassword } = req.body;

    if (!companyName || !adminEmail || !adminPassword) {
      return res.status(400).json({ message: "Company name, email and password are required" });
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    settings.companyName = companyName;
    if (timezone) settings.timezone = timezone;
    settings.setupComplete = true;
    await settings.save();

    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      adminUser = await User.create({
        name: adminName || "Administrator",
        email: adminEmail,
        password: adminPassword,
        role: "Admin",
      });
    }

    await AuditLog.create({
      actor: adminEmail,
      action: "INITIALIZE",
      entity: "Company Settings",
      after: { companyName, timezone },
    });

    res.status(201).json({ message: "Setup completed successfully", setupComplete: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
