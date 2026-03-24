import { Router } from "express";
import { db, getAggregateTotals, getOrdersByLocation } from "../data/mockDb.js";

const router = Router();

router.post("/orders", (req, res) => {
  res.status(201).json({ item: req.body ?? {} });
});

router.patch("/orders/:id", (req, res) => {
  res.json({ id: req.params.id, updates: req.body ?? {} });
});

router.post("/orders/lock", (req, res) => {
  res.json({ ok: true, date: req.body?.date ?? db.todayDate });
});

router.post("/orders/:id/lock", (req, res) => {
  res.json({ ok: true, orderId: req.params.id });
});

router.post("/orders/:id/unlock", (req, res) => {
  res.json({ ok: true, orderId: req.params.id });
});

router.get("/orders/today/aggregate", (_req, res) => {
  res.json({ date: db.todayDate, items: getAggregateTotals() });
});

router.get("/orders/today/by-location", (_req, res) => {
  res.json({ date: db.todayDate, items: getOrdersByLocation() });
});

router.get("/orders/today/export", (req, res) => {
  const format = req.query.format === "pdf" ? "pdf" : "csv";
  res.json({ ok: true, format });
});

router.post("/orders/today/email", (req, res) => {
  const locationIds = Array.isArray(req.body?.locationIds)
    ? req.body.locationIds
    : getOrdersByLocation().map((order) => order.locationId);
  res.json({ ok: true, sent: locationIds.length, locationIds });
});

router.get("/orders", (req, res) => {
  res.json({
    filters: req.query,
    items: getOrdersByLocation(),
  });
});

router.get("/aggregates", (req, res) => {
  res.json({
    groupBy: req.query.group_by ?? "item",
    items: getAggregateTotals(),
  });
});

export default router;
