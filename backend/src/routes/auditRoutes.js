import { Router } from "express";
import AuditLog from "../models/AuditLog.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.get("/", auth, async (req, res) => {
  try {
    const { action, search } = req.query;
    const filter = {};
    if (action) filter.action = action;
    if (search) {
      filter.$or = [
        { actor: { $regex: search, $options: "i" } },
        { entity: { $regex: search, $options: "i" } },
      ];
    }

    const logs = await AuditLog.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
