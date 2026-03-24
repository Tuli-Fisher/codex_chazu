import { Router } from "express";
import { db } from "../data/mockDb.js";

const router = Router();

router.get("/settings", (_req, res) => {
  res.json(db.settings);
});

router.patch("/settings", (req, res) => {
  db.settings = { ...db.settings, ...(req.body ?? {}) };
  res.json(db.settings);
});

export default router;
