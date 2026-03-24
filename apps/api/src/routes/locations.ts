import { Router } from "express";
import {
  db,
  getContactsForLocation,
  getDonationsForLocation,
  getDonorById,
  getLocationById,
  getLocationHistory,
} from "../data/mockDb.js";

const router = Router();

router.get("/locations", (req, res) => {
  const status =
    typeof req.query.status === "string" ? req.query.status.toLowerCase() : "";
  const q = typeof req.query.q === "string" ? req.query.q.trim().toLowerCase() : "";

  const items = db.locations.filter((location) => {
    const matchesStatus =
      !status || status === "all" || location.status.toLowerCase() === status;
    const matchesQuery =
      !q ||
      location.name.toLowerCase().includes(q) ||
      location.address.city.toLowerCase().includes(q) ||
      location.managers.some((manager) => manager.name.toLowerCase().includes(q));

    return matchesStatus && matchesQuery;
  });

  res.json({ items });
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

router.get("/locations/:id/orders", (req, res) => {
  res.json({ items: getLocationHistory(req.params.id) });
});

router.get("/locations/:id/contacts", (req, res) => {
  res.json({ items: getContactsForLocation(req.params.id) });
});

router.get("/locations/:id/fundraising", (req, res) => {
  const location = getLocationById(req.params.id);

  if (!location) {
    res.status(404).json({ error: "Location not found" });
    return;
  }

  const donations = getDonationsForLocation(req.params.id).map((donation) => ({
    ...donation,
    donor: getDonorById(donation.donorId)?.name ?? "Unknown donor",
  }));

  res.json({
    targetAmount: location.fundraisingTarget,
    totalRaised: location.fundraisingRaised,
    donations,
  });
});

export default router;
