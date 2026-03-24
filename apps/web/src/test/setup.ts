import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

type MealType = "breakfast" | "supper";

const baseMenuBasics = [
  { id: "bagels", name: "Bagels", defaultUnit: "dozen", defaultMeal: "Breakfast", active: true },
  { id: "fresh-fruit", name: "Fresh fruit", defaultUnit: "trays", defaultMeal: "Breakfast", active: true },
  { id: "yogurt-cups", name: "Yogurt cups", defaultUnit: "cases", defaultMeal: "Breakfast", active: true },
  { id: "chicken-chili", name: "Chicken chili", defaultUnit: "pans", defaultMeal: "Supper", active: true },
  { id: "cornbread", name: "Cornbread", defaultUnit: "loaves", defaultMeal: "Supper", active: true },
  { id: "green-salad", name: "Green salad", defaultUnit: "bags", defaultMeal: "Supper", active: true },
  { id: "granola-bars", name: "Granola bars", defaultUnit: "cases", defaultMeal: "Breakfast", active: true },
];

const baseTodayMenu = {
  id: "menu-today-2026-03-24",
  date: "2026-03-24",
  lockAt: "16:30",
  items: [
    { id: "today-bagels", basicId: "bagels", mealType: "breakfast" as MealType, name: "Bagels", unit: "dozen", packSize: "12" },
    { id: "today-fresh-fruit", basicId: "fresh-fruit", mealType: "breakfast" as MealType, name: "Fresh fruit", unit: "trays", packSize: "1" },
    { id: "today-yogurt-cups", basicId: "yogurt-cups", mealType: "breakfast" as MealType, name: "Yogurt cups", unit: "cases", packSize: "24" },
    { id: "today-chicken-chili", basicId: "chicken-chili", mealType: "supper" as MealType, name: "Chicken chili", unit: "pans", packSize: "1" },
    { id: "today-cornbread", basicId: "cornbread", mealType: "supper" as MealType, name: "Cornbread", unit: "loaves", packSize: "1" },
    { id: "today-green-salad", basicId: "green-salad", mealType: "supper" as MealType, name: "Green salad", unit: "bags", packSize: "1" },
  ],
};

const baseLocations = [
  {
    id: "riverside",
    name: "Riverside Community Center",
    status: "Active",
    type: "Community",
    managers: [
      { id: "manager-riverside-1", name: "Taylor Lee", phone: "(555) 212-8871", email: "taylor.lee@riverside.org", role: "Program Lead", isPrimary: true },
    ],
    contact: { name: "Taylor Lee", phone: "(555) 212-8871", email: "taylor.lee@riverside.org" },
    address: { line1: "120 Harbor Ave", city: "Wilmington", state: "DE", zip: "19801" },
    deliveryWindow: "7:30 AM - 9:00 AM",
    pickupNotes: "Dock entrance, call upon arrival",
    dietaryNotes: "Nut-free preference",
    weeklyParticipants: 310,
    fundraisingTarget: 20000,
    fundraisingRaised: 15420,
    todayOrder: { breakfast: "84 units", supper: "56 units", status: "Submitted", updatedAt: "1:10 PM", note: "Ready to send to vendor" },
  },
  {
    id: "northside-ms",
    name: "Northside Middle School",
    status: "Active",
    type: "School",
    managers: [
      { id: "manager-northside-1", name: "Jordan Smith", phone: "(555) 220-4459", email: "j.smith@northside.edu", role: "Site Coordinator", isPrimary: true },
    ],
    contact: { name: "Jordan Smith", phone: "(555) 220-4459", email: "j.smith@northside.edu" },
    address: { line1: "82 Lakeview Dr", city: "Newark", state: "DE", zip: "19711" },
    deliveryWindow: "6:45 AM - 8:00 AM",
    pickupNotes: "Deliver to cafeteria door",
    dietaryNotes: "Gluten-free options weekly",
    weeklyParticipants: 425,
    fundraisingTarget: 25000,
    fundraisingRaised: 18200,
    todayOrder: { breakfast: "130 units", supper: "Pending", status: "Late", updatedAt: "12:48 PM", note: "Supper order still outstanding" },
  },
];

const baseOrders = [
  {
    id: "riverside",
    locationId: "riverside",
    locationName: "Riverside Community Center",
    managerName: "Taylor Lee",
    managerPhone: "(555) 212-8871",
    updatedAt: "1:10 PM",
    breakfast: "submitted",
    supper: "submitted",
    note: "On time",
    lines: [
      { meal: "Breakfast", item: "Bagels", unit: "dozen", quantity: 6 },
      { meal: "Supper", item: "Chicken chili", unit: "pans", quantity: 3 },
    ],
    isLocked: false,
  },
  {
    id: "northside-ms",
    locationId: "northside-ms",
    locationName: "Northside Middle School",
    managerName: "Jordan Smith",
    managerPhone: "(555) 220-4459",
    updatedAt: "12:48 PM",
    breakfast: "submitted",
    supper: "missing",
    note: "Supper pending",
    lines: [{ meal: "Breakfast", item: "Bagels", unit: "dozen", quantity: 10 }],
    isLocked: false,
  },
];

const baseDonations = [
  {
    id: "donation-1",
    donorId: "donor-1",
    donorName: "Lydia Ross",
    donorEmail: "lydia.ross@example.org",
    locationId: "riverside",
    locationName: "Riverside Community Center",
    amount: 250,
    date: "2026-03-20",
    method: "check",
    note: "Breakfast program support",
    seasonId: "season-2026-spring",
  },
];

const baseLocationHistory = {
  riverside: [{ date: "Mar 22", breakfast: "84", supper: "56", status: "Submitted" }],
};

type MockState = {
  menuBasics: typeof baseMenuBasics;
  todayMenu: typeof baseTodayMenu;
  locations: typeof baseLocations;
  orders: typeof baseOrders;
  donations: typeof baseDonations;
};

let state: MockState;

function resetState() {
  state = {
    menuBasics: structuredClone(baseMenuBasics),
    todayMenu: structuredClone(baseTodayMenu),
    locations: structuredClone(baseLocations),
    orders: structuredClone(baseOrders),
    donations: structuredClone(baseDonations),
  };
}

function jsonResponse(body: unknown, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

beforeEach(() => {
  resetState();

  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.toString();
      const parsed = new URL(url);
      const path = parsed.pathname;
      const method = (init?.method ?? "GET").toUpperCase();
      const body = init?.body ? JSON.parse(String(init.body)) : undefined;

      if (path === "/auth/login" && method === "POST") {
        return jsonResponse({
          token: "test-token",
          user: { email: body.email },
        });
      }

      if (path === "/auth/session") {
        return jsonResponse({ user: { email: "admin@example.org" } });
      }

      if (path === "/auth/logout" && method === "POST") {
        return jsonResponse({ ok: true });
      }

      if (path === "/menus/today") {
        return jsonResponse(state.todayMenu);
      }

      if (path === "/menu-basics" && method === "GET") {
        return jsonResponse({ items: state.menuBasics });
      }

      if (path === "/menu-basics" && method === "POST") {
        const next = {
          id: body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          name: body.name,
          defaultUnit: body.defaultUnit,
          defaultMeal: body.defaultMeal,
          active: true,
        };
        state.menuBasics.push(next);
        return jsonResponse({ item: next }, 201);
      }

      if (path === `/menus/${state.todayMenu.id}/items` && method === "POST") {
        const next = {
          id: `menu-item-${state.todayMenu.items.length + 1}`,
          basicId: body.basicId ?? null,
          mealType: body.mealType,
          name: body.name,
          unit: body.unit,
          packSize: body.packSize ?? "1",
        };
        state.todayMenu.items.push(next);
        return jsonResponse({ item: next }, 201);
      }

      if (path === `/menus/${state.todayMenu.id}/items/remove` && method === "POST") {
        state.todayMenu.items = state.todayMenu.items.filter((item) => item.id !== body.itemId);
        return jsonResponse({ ok: true, itemId: body.itemId });
      }

      if (path === "/locations") {
        return jsonResponse({ items: state.locations });
      }

      if (path.startsWith("/locations/") && path.endsWith("/orders")) {
        const id = path.split("/")[2];
        return jsonResponse({ items: baseLocationHistory[id as keyof typeof baseLocationHistory] ?? [] });
      }

      if (path.startsWith("/locations/") && path.endsWith("/fundraising")) {
        return jsonResponse({
          targetAmount: 20000,
          totalRaised: 15420,
          donations: [{ id: "donation-1", donorId: "donor-1", donor: "Lydia Ross", amount: 250, date: "2026-03-20" }],
        });
      }

      if (path.startsWith("/locations/")) {
        const id = path.split("/")[2];
        const item = state.locations.find((location) => location.id === id);
        return item ? jsonResponse({ item }) : jsonResponse({ error: "Location not found" }, 404);
      }

      if (path === "/orders/today/by-location") {
        return jsonResponse({ date: "2026-03-24", items: state.orders });
      }

      if (path === "/orders/today/aggregate") {
        return jsonResponse({
          date: "2026-03-24",
          items: [
            { item: "Bagels", meal: "Breakfast", unit: "dozen", total: 16 },
            { item: "Chicken chili", meal: "Supper", unit: "pans", total: 3 },
          ],
        });
      }

      if (path === "/orders/today/remind" && method === "POST") {
        return jsonResponse({ ok: true, sent: body?.locationIds?.length ?? 1, locationIds: body?.locationIds ?? ["northside-ms"] });
      }

      if (path === "/orders/lock" && method === "POST") {
        state.orders = state.orders.map((order) => ({ ...order, isLocked: true }));
        return jsonResponse({ ok: true, date: "2026-03-24" });
      }

      if (path.startsWith("/orders/") && path.endsWith("/lock") && method === "POST") {
        return jsonResponse({ ok: true, orderId: path.split("/")[2] });
      }

      if (path.startsWith("/orders/") && path.endsWith("/unlock") && method === "POST") {
        return jsonResponse({ ok: true, orderId: path.split("/")[2] });
      }

      if (path === "/orders/today/email" && method === "POST") {
        return jsonResponse({ ok: true, sent: body?.locationIds?.length ?? state.orders.length, locationIds: body?.locationIds ?? state.orders.map((order) => order.locationId) });
      }

      if (path === "/orders/today/export") {
        return jsonResponse({ ok: true, format: parsed.searchParams.get("format") ?? "csv" });
      }

      if (path === "/donations" && method === "GET") {
        return jsonResponse({ items: state.donations });
      }

      if (path === "/donations" && method === "POST") {
        const next = {
          id: `donation-${state.donations.length + 1}`,
          donorId: `donor-${state.donations.length + 1}`,
          donorName: body.donorName,
          donorEmail: body.donorEmail || "new@example.org",
          locationId: body.locationId === "general" ? null : body.locationId,
          locationName:
            body.locationId === "general"
              ? "General Fund"
              : state.locations.find((location) => location.id === body.locationId)?.name ?? "Location",
          amount: body.amount,
          date: body.date,
          method: body.method,
          note: body.note,
          seasonId: "season-2026-spring",
        };
        state.donations.unshift(next);
        return jsonResponse({ item: next }, 201);
      }

      if (path === "/settings") {
        return jsonResponse({
          lockTime: "16:30",
          timezone: "America/New_York",
          lateThresholdMinutes: 30,
        });
      }

      if (path === "/aggregates") {
        const groupBy = parsed.searchParams.get("group_by");
        const items =
          groupBy === "location"
            ? [{ location: "Riverside Community Center", breakfast: 280, supper: 190, onTime: "96%", lastOrder: "Mar 22" }]
            : groupBy === "date"
              ? [{ date: "Mar 22", breakfast: 420, supper: 310, submissions: "12/14", late: "1" }]
              : [{ item: "Bagels", meal: "Breakfast", total: 620, avg: 44, trend: "+4%" }];

        return jsonResponse({
          items,
          summary: {
            mealsServed: 2840,
            onTimeSubmissions: "92%",
            fundraising: 18430,
          },
        });
      }

      return jsonResponse({ error: `Unhandled request for ${path}` }, 500);
    }),
  );
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.unstubAllGlobals();
});
