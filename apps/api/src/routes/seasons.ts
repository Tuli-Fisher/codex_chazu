import { Router } from "express";
import { db, getActiveSeason } from "../data/mockDb.js";

const router = Router();

router.get("/seasons", (_req, res) => {
  res.json({ items: db.seasons });
});

router.get("/seasons/active", (_req, res) => {
  res.json({ item: getActiveSeason() });
});

router.post("/seasons", (req, res) => {
  const next = {
    id: `season-${db.seasons.length + 1}`,
    name: req.body?.name ?? "New season",
    startDate: req.body?.startDate ?? db.todayDate,
    endDate: req.body?.endDate ?? db.todayDate,
    isActive: Boolean(req.body?.isActive),
  };
  db.seasons.push(next);
  res.status(201).json({ item: next });
});

router.patch("/seasons/:id", (req, res) => {
  const season = db.seasons.find((item) => item.id === req.params.id);
  if (!season) {
    res.status(404).json({ error: "Season not found" });
    return;
  }
  Object.assign(season, req.body ?? {});
  res.json({ item: season });
});

export default router;
