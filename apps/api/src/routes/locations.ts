import { Router } from "express";
import { db, getContactsForLocation, getLocationById } from "../data/mockDb.js";

const router = Router();

router.get("/locations", (_req, res) => {
  res.json({ items: db.locations });
});

router.get("/locations/:id", (req, res) => {
  const location = getLocationById(req.params.id);
  if (!location) {
    res.status(404).json({ error: "Location not found" });
    return;
  }
  res.json({ item: location });
});

router.post("/locations", (req, res) => {
  res.status(201).json({ item: req.body ?? {} });
});

router.patch("/locations/:id", (req, res) => {
  res.json({ id: req.params.id, updates: req.body ?? {} });
});

router.get("/locations/:id/orders", (_req, res) => {
  res.json({ items: db.locationOrders });
});

router.get("/locations/:id/contacts", (req, res) => {
  const contacts = getContactsForLocation(req.params.id);
  res.json({ items: contacts });
});

router.get("/locations/:id/fundraising", (_req, res) => {
  res.json({
    targetAmount: 15000,
    totalRaised: 10350,
    donations: [
      { donor: "Lydia Ross", amount: 250, date: "2026-03-20" },
      { donor: "Darren Cook", amount: 100, date: "2026-03-18" },
    ],
  });
});

export default router;
