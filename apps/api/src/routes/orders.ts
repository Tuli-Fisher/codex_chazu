import { Router } from "express";
import {
  db,
  getAggregateTotals,
  getOrderById,
  getOrdersByLocation,
} from "../data/mockDb.js";

const router = Router();

router.post("/orders", (req, res) => {
  res.status(201).json({ item: req.body ?? {} });
});

router.patch("/orders/:id", (req, res) => {
  res.json({ id: req.params.id, updates: req.body ?? {} });
});

router.post("/orders/lock", (req, res) => {
  db.todayOrders.forEach((order) => {
    order.isLocked = true;
  });

  res.json({ ok: true, date: req.body?.date ?? db.todayDate });
});

router.post("/orders/:id/lock", (req, res) => {
  const order = getOrderById(req.params.id);

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  order.isLocked = true;
  res.json({ ok: true, orderId: req.params.id });
});

router.post("/orders/:id/unlock", (req, res) => {
  const order = getOrderById(req.params.id);

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  order.isLocked = false;
  res.json({ ok: true, orderId: req.params.id });
});

router.post("/orders/today/remind", (req, res) => {
  const fallbackIds = getOrdersByLocation()
    .filter(
      (order) =>
        order.breakfast === "missing" ||
        order.breakfast === "late" ||
        order.supper === "missing" ||
        order.supper === "late",
    )
    .map((order) => order.locationId);

  const locationIds = Array.isArray(req.body?.locationIds)
    ? req.body.locationIds
    : fallbackIds;

  res.json({ ok: true, sent: locationIds.length, locationIds });
});

router.get("/orders/today/aggregate", (_req, res) => {
  res.json({ date: db.todayDate, items: getAggregateTotals() });
});

router.get("/orders/today/by-location", (req, res) => {
  const locationId =
    typeof req.query.location_id === "string" ? req.query.location_id : null;
  const missingOnly = req.query.missing_only === "true";

  let items = getOrdersByLocation();

  if (locationId) {
    items = items.filter((order) => order.locationId === locationId);
  }

  if (missingOnly) {
    items = items.filter(
      (order) => order.breakfast === "missing" || order.supper === "missing",
    );
  }

  res.json({ date: db.todayDate, items });
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
  const locationId =
    typeof req.query.location_id === "string" ? req.query.location_id : null;

  const items = locationId
    ? getOrdersByLocation().filter((order) => order.locationId === locationId)
    : getOrdersByLocation();

  res.json({
    filters: req.query,
    items,
  });
});

router.get("/aggregates", (req, res) => {
  const groupBy =
    req.query.group_by === "location" || req.query.group_by === "date"
      ? req.query.group_by
      : "item";
  const locationId =
    typeof req.query.location_id === "string"
      ? req.query.location_id.toLowerCase()
      : "";
  const q = typeof req.query.q === "string" ? req.query.q.toLowerCase() : "";
  const includeLate = req.query.include_late !== "false";
  const meal = typeof req.query.meal === "string" ? req.query.meal : "All";

  let items: unknown[] = [];

  if (groupBy === "item") {
    items = db.history.items
      .filter((row) => meal === "All" || row.meal === meal)
      .filter((row) => (!q ? true : row.item.toLowerCase().includes(q)));
  } else if (groupBy === "location") {
    items = db.history.locations.filter((row) => {
      if (locationId) {
        return row.location.toLowerCase().includes(locationId);
      }
      if (q) {
        return row.location.toLowerCase().includes(q);
      }
      return true;
    });
  } else {
    items = db.history.dates.filter((row) => (includeLate ? true : row.late === "0"));
  }

  res.json({
    groupBy,
    items,
    summary: {
      mealsServed: 2840,
      onTimeSubmissions: "92%",
      fundraising: 18430,
    },
  });
});

export default router;
