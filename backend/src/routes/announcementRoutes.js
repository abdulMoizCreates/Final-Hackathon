import { Router } from "express";
import Announcement from "../models/Announcement.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.get("/", auth, async (req, res) => {
  try {
    const list = await Announcement.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) return res.status(400).json({ message: "Title and body are required" });

    const item = await Announcement.create({
      title,
      body,
      authorName: req.user?.name || "Management",
      authorRole: req.user?.role || "Admin",
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
