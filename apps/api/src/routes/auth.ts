import { Router } from "express";

const router = Router();

router.post("/auth/login", (req, res) => {
  const email = typeof req.body?.email === "string" ? req.body.email : "admin";
  res.json({ token: "mock-token", user: { email } });
});

router.post("/auth/logout", (_req, res) => {
  res.json({ ok: true });
});

export default router;
