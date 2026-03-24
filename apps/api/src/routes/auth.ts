import { Router } from "express";
import { createSession, deleteSession, getSession } from "../data/mockDb.js";

const router = Router();

function getBearerToken(headerValue: string | undefined) {
  if (!headerValue?.startsWith("Bearer ")) {
    return null;
  }

  return headerValue.slice("Bearer ".length).trim();
}

router.post("/auth/login", (req, res) => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
  const password =
    typeof req.body?.password === "string" ? req.body.password.trim() : "";

  if (!email) {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  if (!password) {
    res.status(400).json({ error: "Password is required" });
    return;
  }

  res.json(createSession(email));
});

router.get("/auth/session", (req, res) => {
  const user = getSession(getBearerToken(req.headers.authorization));

  if (!user) {
    res.status(401).json({ error: "Session not found" });
    return;
  }

  res.json({ user });
});

router.post("/auth/logout", (req, res) => {
  const bodyToken =
    typeof req.body?.token === "string" ? req.body.token : null;
  const headerToken = getBearerToken(req.headers.authorization);

  deleteSession(bodyToken ?? headerToken);
  res.json({ ok: true });
});

export default router;
