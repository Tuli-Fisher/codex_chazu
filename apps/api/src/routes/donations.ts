import { Router } from "express";
import {
  createDonation,
  createDonor,
  getActiveSeason,
  getDonationRows,
} from "../data/mockDb.js";

const router = Router();

router.post("/donations", (req, res) => {
  const donorName =
    typeof req.body?.donorName === "string" ? req.body.donorName.trim() : "";
  const donorEmail =
    typeof req.body?.donorEmail === "string" ? req.body.donorEmail.trim() : "";
  const amount = Number(req.body?.amount);

  if (!donorName) {
    res.status(400).json({ error: "Donor name is required" });
    return;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    res.status(400).json({ error: "Amount must be greater than zero" });
    return;
  }

  const donor = createDonor({
    name: donorName,
    email: donorEmail || `${donorName.toLowerCase().replace(/[^a-z0-9]+/g, ".")}@example.org`,
  });

  const donation = createDonation({
    donorId: donor.id,
    locationId:
      typeof req.body?.locationId === "string" && req.body.locationId !== "general"
        ? req.body.locationId
        : null,
    amount,
    date:
      typeof req.body?.date === "string" && req.body.date
        ? req.body.date
        : new Date().toISOString().slice(0, 10),
    method:
      req.body?.method === "cash" ||
      req.body?.method === "check" ||
      req.body?.method === "credit card" ||
      req.body?.method === "other"
        ? req.body.method
        : "cash",
    note: typeof req.body?.note === "string" ? req.body.note.trim() : undefined,
    seasonId:
      typeof req.body?.seasonId === "string"
        ? req.body.seasonId
        : getActiveSeason()?.id,
  });

  const item = getDonationRows({}).find((row) => row.id === donation.id);
  res.status(201).json({ item });
});

router.get("/donations", (req, res) => {
  const locationId =
    typeof req.query.location_id === "string" ? req.query.location_id : null;
  const seasonId =
    typeof req.query.season_id === "string" ? req.query.season_id : null;
  const q = typeof req.query.q === "string" ? req.query.q : null;
  const dateFrom =
    typeof req.query.date_from === "string" ? req.query.date_from : null;
  const dateTo = typeof req.query.date_to === "string" ? req.query.date_to : null;
  const items = getDonationRows({ locationId, seasonId, q, dateFrom, dateTo });

  res.json({
    filters: req.query,
    items,
  });
});

export default router;
