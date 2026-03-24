import { Router } from "express";

const router = Router();

router.post("/fundraising/targets", (req, res) => {
  res.status(201).json({ item: req.body ?? {} });
});

router.patch("/fundraising/targets/:id", (req, res) => {
  res.json({ id: req.params.id, updates: req.body ?? {} });
});

export default router;
