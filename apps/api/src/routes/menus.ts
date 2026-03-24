import { Router } from "express";
import { db } from "../data/mockDb.js";

const router = Router();

router.get("/menus/today", (_req, res) => {
  res.json({
    date: db.todayDate,
    lockAt: db.settings.lockTime,
    items: db.todayMenu,
  });
});

router.get("/menu-basics", (_req, res) => {
  res.json({ items: db.menuBasics });
});

router.post("/menu-basics", (req, res) => {
  const next = {
    id: `basic-${db.menuBasics.length + 1}`,
    name: req.body?.name ?? "New item",
    defaultUnit: req.body?.defaultUnit ?? "unit",
    active: req.body?.active ?? true,
  };
  db.menuBasics.push(next);
  res.status(201).json({ item: next });
});

router.patch("/menu-basics/:id", (req, res) => {
  const item = db.menuBasics.find((basic) => basic.id === req.params.id);
  if (!item) {
    res.status(404).json({ error: "Basic template not found" });
    return;
  }
  Object.assign(item, req.body ?? {});
  res.json({ item });
});

router.post("/menus", (req, res) => {
  res.status(201).json({ item: req.body ?? {} });
});

router.patch("/menus/:id", (req, res) => {
  res.json({ id: req.params.id, updates: req.body ?? {} });
});

export default router;
