import { Router } from "express";

const router = Router();

router.post("/donations", (req, res) => {
  res.status(201).json({ item: req.body ?? {} });
});

router.get("/donations", (req, res) => {
  res.json({
    filters: req.query,
    items: [
      { donor: "Lydia Ross", amount: 250, date: "2026-03-20" },
      { donor: "Darren Cook", amount: 100, date: "2026-03-18" },
    ],
  });
});

export default router;
