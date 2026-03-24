import express from "express";

type MealType = "breakfast" | "supper";

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

type LocationContact = {
  id: string;
  locationId: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  isPrimary: boolean;
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

type Season = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

type MenuBasic = {
  id: string;
  name: string;
  defaultUnit: string;
  active: boolean;
};

type Settings = {
  lockTime: string;
  timezone: string;
  lateThresholdMinutes: number;
};

export const app = express();

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
    mealType: "supper",
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

const locationContacts: LocationContact[] = [
  {
    id: "contact-1",
    locationId: "loc-1",
    name: "Taylor Lee",
    phone: "(555) 212-8871",
    email: "taylor.lee@example.org",
    role: "Program Lead",
    isPrimary: true,
  },
  {
    id: "contact-2",
    locationId: "loc-1",
    name: "Maya Chen",
    phone: "(555) 212-8833",
    email: "maya.chen@example.org",
    role: "Operations",
    isPrimary: false,
  },
  {
    id: "contact-3",
    locationId: "loc-2",
    name: "Jordan Smith",
    phone: "(555) 220-4459",
    email: "jordan.smith@example.org",
    role: "Site Coordinator",
    isPrimary: true,
  },
];

const seasons: Season[] = [
  {
    id: "season-2026-spring",
    name: "Spring 2026",
    startDate: "2026-03-01",
    endDate: "2026-05-31",
    isActive: true,
  },
  {
    id: "season-2025-winter",
    name: "Winter 2025",
    startDate: "2025-12-01",
    endDate: "2026-02-28",
    isActive: false,
  },
];

const menuBasics: MenuBasic[] = [
  { id: "basic-1", name: "Bagels", defaultUnit: "dozen", active: true },
  { id: "basic-2", name: "Cream cheese", defaultUnit: "tubs", active: true },
  { id: "basic-3", name: "Granola bars", defaultUnit: "cases", active: true },
];

let settings: Settings = {
  lockTime: "16:30",
  timezone: "America/New_York",
  lateThresholdMinutes: 30,
};

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
        mealType: "supper",
        unit: "pans",
        quantity: 3,
      },
    ],
  },
];

const aggregateTotals = [
  { item: "Bagels", meal: "Breakfast", total: 96 },
  { item: "Yogurt cups", meal: "Breakfast", total: 180 },
  { item: "Chicken chili", meal: "Supper", total: 42 },
  { item: "Cornbread", meal: "Supper", total: 38 },
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

app.get("/settings", (_req, res) => {
  res.json(settings);
});

app.patch("/settings", (req, res) => {
  settings = { ...settings, ...(req.body ?? {}) };
  res.json(settings);
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

app.get("/locations/:id/contacts", (req, res) => {
  const contacts = locationContacts.filter(
    (contact) => contact.locationId === req.params.id,
  );
  res.json({ items: contacts });
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

app.get("/menu-basics", (_req, res) => {
  res.json({ items: menuBasics });
});

app.post("/menu-basics", (req, res) => {
  const next = {
    id: `basic-${menuBasics.length + 1}`,
    name: req.body?.name ?? "New item",
    defaultUnit: req.body?.defaultUnit ?? "unit",
    active: req.body?.active ?? true,
  };
  menuBasics.push(next);
  res.status(201).json({ item: next });
});

app.patch("/menu-basics/:id", (req, res) => {
  const item = menuBasics.find((basic) => basic.id === req.params.id);
  if (!item) {
    res.status(404).json({ error: "Basic template not found" });
    return;
  }
  Object.assign(item, req.body ?? {});
  res.json({ item });
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

app.get("/seasons", (_req, res) => {
  res.json({ items: seasons });
});

app.get("/seasons/active", (_req, res) => {
  const active = seasons.find((season) => season.isActive);
  res.json({ item: active ?? null });
});

app.post("/seasons", (req, res) => {
  const next = {
    id: `season-${seasons.length + 1}`,
    name: req.body?.name ?? "New season",
    startDate: req.body?.startDate ?? todayDate,
    endDate: req.body?.endDate ?? todayDate,
    isActive: Boolean(req.body?.isActive),
  };
  seasons.push(next);
  res.status(201).json({ item: next });
});

app.patch("/seasons/:id", (req, res) => {
  const season = seasons.find((item) => item.id === req.params.id);
  if (!season) {
    res.status(404).json({ error: "Season not found" });
    return;
  }
  Object.assign(season, req.body ?? {});
  res.json({ item: season });
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
