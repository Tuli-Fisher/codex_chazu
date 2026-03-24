import express from "express";
import authRoutes from "./routes/auth.js";
import donationsRoutes from "./routes/donations.js";
import fundraisingRoutes from "./routes/fundraising.js";
import locationsRoutes from "./routes/locations.js";
import menusRoutes from "./routes/menus.js";
import ordersRoutes from "./routes/orders.js";
import participantsRoutes from "./routes/participants.js";
import seasonsRoutes from "./routes/seasons.js";
import settingsRoutes from "./routes/settings.js";

export const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use(authRoutes);
app.use(settingsRoutes);
app.use(seasonsRoutes);
app.use(menusRoutes);
app.use(locationsRoutes);
app.use(ordersRoutes);
app.use(fundraisingRoutes);
app.use(donationsRoutes);
app.use(participantsRoutes);
