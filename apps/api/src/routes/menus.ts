import { Router } from "express";
import {
  addItemToTodayMenu,
  createMenuBasic,
  db,
  removeItemFromTodayMenu,
} from "../data/mockDb.js";

const router = Router();

router.get("/menus/today", (_req, res) => {
  res.json(db.todayMenu);
});

router.get("/menu-basics", (_req, res) => {
  res.json({ items: db.menuBasics });
});

router.post("/menu-basics", (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";

  if (!name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }

  const basic = createMenuBasic({
    name,
    defaultUnit:
      typeof req.body?.defaultUnit === "string" && req.body.defaultUnit.trim()
        ? req.body.defaultUnit.trim()
        : "unit",
    defaultMeal: req.body?.defaultMeal === "Supper" ? "Supper" : "Breakfast",
    active: req.body?.active ?? true,
  });

  res.status(201).json({ item: basic });
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

router.post("/menus", (_req, res) => {
  res.status(201).json({ item: db.todayMenu });
});

router.patch("/menus/:id", (req, res) => {
  if (req.params.id !== db.todayMenu.id) {
    res.status(404).json({ error: "Menu not found" });
    return;
  }

  db.todayMenu.lockAt =
    typeof req.body?.lockAt === "string" ? req.body.lockAt : db.todayMenu.lockAt;

  res.json({ item: db.todayMenu });
});

router.post("/menus/:id/items", (req, res) => {
  if (req.params.id !== db.todayMenu.id) {
    res.status(404).json({ error: "Menu not found" });
    return;
  }

  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const mealType = req.body?.mealType === "supper" ? "supper" : "breakfast";
  const unit =
    typeof req.body?.unit === "string" && req.body.unit.trim()
      ? req.body.unit.trim()
      : "unit";

  if (!name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }

  const item = addItemToTodayMenu({
    basicId: typeof req.body?.basicId === "string" ? req.body.basicId : null,
    name,
    mealType,
    unit,
    packSize:
      typeof req.body?.packSize === "string" ? req.body.packSize.trim() : "1",
    notes: typeof req.body?.notes === "string" ? req.body.notes.trim() : undefined,
  });

  res.status(201).json({ item });
});

router.post("/menus/:id/items/remove", (req, res) => {
  if (req.params.id !== db.todayMenu.id) {
    res.status(404).json({ error: "Menu not found" });
    return;
  }

  const itemId = typeof req.body?.itemId === "string" ? req.body.itemId : "";

  if (!itemId) {
    res.status(400).json({ error: "itemId is required" });
    return;
  }

  if (!removeItemFromTodayMenu(itemId)) {
    res.status(404).json({ error: "Menu item not found" });
    return;
  }

  res.json({ ok: true, itemId });
});

export default router;
