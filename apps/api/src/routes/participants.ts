import { Router } from "express";

const router = Router();

router.post("/participants/daily", (req, res) => {
  res.status(201).json({ item: req.body ?? {} });
});

router.get("/participants/daily", (req, res) => {
  res.json({ filters: req.query, items: [] });
});

router.get("/participants/weekly", (req, res) => {
  res.json({ filters: req.query, items: [] });
});

export default router;
