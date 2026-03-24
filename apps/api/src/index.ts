import express from "express";

type MealType = "breakfast" | "lunch";

type DailyMenuItem = {
  id: string;
  mealType: MealType;
  name: string;
  unit: string;
  packSize: string;
};

type LocationSummary = {
  id: string;
  name: string;
  status: "active" | "seasonal" | "inactive";
  primaryContact: string;
  phone: string;
};

type OrderItem = {
  menuItemId: string;
  name: string;
  mealType: MealType;
  unit: string;
  quantity: number;
};

type LocationOrder = {
  locationId: string;
  locationName: string;
  status: "draft" | "submitted" | "locked" | "missing" | "late";
  updatedAt: string;
  items: OrderItem[];
};

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

app.use(express.json());

const todayDate = "2026-03-23";
const todayMenu: DailyMenuItem[] = [
  {
    id: "menu-1",
    mealType: "breakfast",
    name: "Bagels",
    unit: "dozen",
    packSize: "12",
  },
  {
    id: "menu-2",
    mealType: "breakfast",
    name: "Cream cheese",
    unit: "tubs",
    packSize: "1",
  },
  {
    id: "menu-3",
    mealType: "lunch",
    name: "Chicken chili",
    unit: "pans",
    packSize: "1",
  },
];

const locations: LocationSummary[] = [
  {
    id: "loc-1",
    name: "Riverside Community Center",
    status: "active",
    primaryContact: "Taylor Lee",
    phone: "(555) 212-8871",
  },
  {
    id: "loc-2",
    name: "Northside Middle School",
    status: "active",
    primaryContact: "Jordan Smith",
    phone: "(555) 220-4459",
  },
  {
    id: "loc-3",
    name: "Oak Hill Library",
    status: "seasonal",
    primaryContact: "Riley Patel",
    phone: "(555) 310-9022",
  },
];

const locationOrders: LocationOrder[] = [
  {
    locationId: "loc-1",
    locationName: "Riverside Community Center",
    status: "submitted",
    updatedAt: "1:10 PM",
    items: [
      {
        menuItemId: "menu-1",
        name: "Bagels",
        mealType: "breakfast",
        unit: "dozen",
        quantity: 6,
      },
      {
        menuItemId: "menu-2",
        name: "Cream cheese",
        mealType: "breakfast",
        unit: "tubs",
        quantity: 10,
      },
    ],
  },
  {
    locationId: "loc-2",
    locationName: "Northside Middle School",
    status: "missing",
    updatedAt: "-",
    items: [],
  },
  {
    locationId: "loc-3",
    locationName: "Oak Hill Library",
    status: "late",
    updatedAt: "1:34 PM",
    items: [
      {
        menuItemId: "menu-3",
        name: "Chicken chili",
        mealType: "lunch",
        unit: "pans",
        quantity: 3,
      },
    ],
  },
];

const aggregateTotals = [
  { item: "Bagels", meal: "Breakfast", total: 96 },
  { item: "Yogurt cups", meal: "Breakfast", total: 180 },
  { item: "Chicken chili", meal: "Lunch", total: 42 },
  { item: "Cornbread", meal: "Lunch", total: 38 },
];

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/auth/login", (req, res) => {
  const email = typeof req.body?.email === "string" ? req.body.email : "admin";
  res.json({ token: "mock-token", user: { email } });
});

app.post("/auth/logout", (_req, res) => {
  res.json({ ok: true });
});

app.get("/locations", (_req, res) => {
  res.json({ items: locations });
});

app.get("/locations/:id", (req, res) => {
  const location = locations.find((item) => item.id === req.params.id);
  if (!location) {
    res.status(404).json({ error: "Location not found" });
    return;
  }
  res.json({ item: location });
});

app.post("/locations", (req, res) => {
  res.status(201).json({ item: req.body ?? {} });
});

app.patch("/locations/:id", (req, res) => {
  res.json({ id: req.params.id, updates: req.body ?? {} });
});

app.get("/locations/:id/orders", (_req, res) => {
  res.json({ items: locationOrders });
});

app.get("/locations/:id/fundraising", (_req, res) => {
  res.json({
    targetAmount: 15000,
    totalRaised: 10350,
    donations: [
      { donor: "Lydia Ross", amount: 250, date: "2026-03-20" },
      { donor: "Darren Cook", amount: 100, date: "2026-03-18" },
    ],
  });
});

app.get("/menus/today", (_req, res) => {
  res.json({
    date: todayDate,
    lockAt: "16:30",
    items: todayMenu,
  });
});

app.post("/menus", (req, res) => {
  res.status(201).json({ item: req.body ?? {} });
});

app.patch("/menus/:id", (req, res) => {
  res.json({ id: req.params.id, updates: req.body ?? {} });
});

app.post("/orders", (req, res) => {
  res.status(201).json({ item: req.body ?? {} });
});

app.patch("/orders/:id", (req, res) => {
  res.json({ id: req.params.id, updates: req.body ?? {} });
});

app.post("/orders/lock", (req, res) => {
  res.json({ ok: true, date: req.body?.date ?? todayDate });
});

app.post("/orders/:id/lock", (req, res) => {
  res.json({ ok: true, orderId: req.params.id });
});

app.post("/orders/:id/unlock", (req, res) => {
  res.json({ ok: true, orderId: req.params.id });
});

app.get("/orders/today/aggregate", (_req, res) => {
  res.json({ date: todayDate, items: aggregateTotals });
});

app.get("/orders/today/by-location", (_req, res) => {
  res.json({ date: todayDate, items: locationOrders });
});

app.get("/orders/today/export", (req, res) => {
  const format = req.query.format === "pdf" ? "pdf" : "csv";
  res.json({ ok: true, format });
});

app.post("/orders/today/email", (req, res) => {
  const locationIds = Array.isArray(req.body?.locationIds)
    ? req.body.locationIds
    : locationOrders.map((order) => order.locationId);
  res.json({ ok: true, sent: locationIds.length, locationIds });
});

app.get("/orders", (req, res) => {
  res.json({
    filters: req.query,
    items: locationOrders,
  });
});

app.get("/aggregates", (req, res) => {
  res.json({
    groupBy: req.query.group_by ?? "item",
    items: aggregateTotals,
  });
});

app.post("/fundraising/targets", (req, res) => {
  res.status(201).json({ item: req.body ?? {} });
});

app.patch("/fundraising/targets/:id", (req, res) => {
  res.json({ id: req.params.id, updates: req.body ?? {} });
});

app.post("/donations", (req, res) => {
  res.status(201).json({ item: req.body ?? {} });
});

app.get("/donations", (req, res) => {
  res.json({
    filters: req.query,
    items: [
      { donor: "Lydia Ross", amount: 250, date: "2026-03-20" },
      { donor: "Darren Cook", amount: 100, date: "2026-03-18" },
    ],
  });
});

app.post("/participants/daily", (req, res) => {
  res.status(201).json({ item: req.body ?? {} });
});

app.get("/participants/daily", (req, res) => {
  res.json({ filters: req.query, items: [] });
});

app.get("/participants/weekly", (req, res) => {
  res.json({ filters: req.query, items: [] });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
