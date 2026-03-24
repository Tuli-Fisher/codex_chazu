import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "./app.js";

describe("api health", () => {
  it("returns ok", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });
});

describe("auth endpoints", () => {
  it("returns a token and user", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: "admin@example.org", password: "password123" });
    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe("admin@example.org");
    expect(typeof response.body.token).toBe("string");
  });

  it("returns the current session", async () => {
    const login = await request(app)
      .post("/auth/login")
      .send({ email: "admin@example.org", password: "password123" });

    const response = await request(app)
      .get("/auth/session")
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe("admin@example.org");
  });

  it("allows logout", async () => {
    const response = await request(app).post("/auth/logout");
    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });
});

describe("locations", () => {
  it("returns locations", async () => {
    const response = await request(app).get("/locations");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.items)).toBe(true);
    expect(response.body.items[0]).toHaveProperty("id");
  });

  it("returns a location by id", async () => {
    const response = await request(app).get("/locations/riverside");
    expect(response.status).toBe(200);
    expect(response.body.item.id).toBe("riverside");
  });

  it("returns 404 for missing location", async () => {
    const response = await request(app).get("/locations/unknown");
    expect(response.status).toBe(404);
  });

  it("creates a location", async () => {
    const response = await request(app)
      .post("/locations")
      .send({ name: "New Site" });
    expect(response.status).toBe(201);
    expect(response.body.item.name).toBe("New Site");
  });

  it("patches a location", async () => {
    const response = await request(app)
      .patch("/locations/riverside")
      .send({ status: "inactive" });
    expect(response.status).toBe(200);
    expect(response.body.id).toBe("riverside");
    expect(response.body.updates.status).toBe("inactive");
  });

  it("returns location orders", async () => {
    const response = await request(app).get("/locations/riverside/orders");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.items)).toBe(true);
  });

  it("returns fundraising details", async () => {
    const response = await request(app).get("/locations/riverside/fundraising");
    expect(response.status).toBe(200);
    expect(response.body.targetAmount).toBeGreaterThan(0);
  });
});

describe("menus", () => {
  it("returns today's menu", async () => {
    const response = await request(app).get("/menus/today");
    expect(response.status).toBe(200);
    expect(response.body.items.length).toBeGreaterThan(0);
    expect(response.body.id).toBeDefined();
  });

  it("creates a menu item", async () => {
    const response = await request(app)
      .post("/menu-basics")
      .send({ name: "Sample item", defaultUnit: "trays", defaultMeal: "Breakfast" });
    expect(response.status).toBe(201);
    expect(response.body.item.name).toBe("Sample item");
  });

  it("patches a menu item", async () => {
    const response = await request(app)
      .patch("/menu-basics/bagels")
      .send({ name: "Updated item" });
    expect(response.status).toBe(200);
    expect(response.body.item.name).toBe("Updated item");
  });
});

describe("orders", () => {
  it("creates an order", async () => {
    const response = await request(app)
      .post("/orders")
      .send({ locationId: "riverside" });
    expect(response.status).toBe(201);
    expect(response.body.item.locationId).toBe("riverside");
  });

  it("patches an order", async () => {
    const response = await request(app)
      .patch("/orders/order-1")
      .send({ status: "locked" });
    expect(response.status).toBe(200);
    expect(response.body.id).toBe("order-1");
    expect(response.body.updates.status).toBe("locked");
  });

  it("locks orders by date", async () => {
    const response = await request(app)
      .post("/orders/lock")
      .send({ date: "2026-03-31" });
    expect(response.status).toBe(200);
    expect(response.body.date).toBe("2026-03-31");
  });

  it("locks a single order", async () => {
    const response = await request(app).post("/orders/riverside/lock");
    expect(response.status).toBe(200);
    expect(response.body.orderId).toBe("riverside");
  });

  it("unlocks a single order", async () => {
    const response = await request(app).post("/orders/riverside/unlock");
    expect(response.status).toBe(200);
    expect(response.body.orderId).toBe("riverside");
  });

  it("returns aggregate totals for today", async () => {
    const response = await request(app).get("/orders/today/aggregate");
    expect(response.status).toBe(200);
    expect(response.body.items.length).toBeGreaterThan(0);
  });

  it("returns per-location totals for today", async () => {
    const response = await request(app).get("/orders/today/by-location");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.items)).toBe(true);
  });

  it("exports today orders in pdf format", async () => {
    const response = await request(app).get("/orders/today/export?format=pdf");
    expect(response.status).toBe(200);
    expect(response.body.format).toBe("pdf");
  });

  it("emails selected locations", async () => {
    const response = await request(app)
      .post("/orders/today/email")
      .send({ locationIds: ["riverside", "northside-ms"] });
    expect(response.status).toBe(200);
    expect(response.body.sent).toBe(2);
  });

  it("sends reminders", async () => {
    const response = await request(app).post("/orders/today/remind");
    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });

  it("returns orders with filters", async () => {
    const response = await request(app).get("/orders?status=missing");
    expect(response.status).toBe(200);
    expect(response.body.filters.status).toBe("missing");
  });
});

describe("aggregates", () => {
  it("returns aggregate data grouped by query", async () => {
    const response = await request(app).get("/aggregates?group_by=location");
    expect(response.status).toBe(200);
    expect(response.body.groupBy).toBe("location");
  });
});

describe("fundraising", () => {
  it("creates fundraising targets", async () => {
    const response = await request(app)
      .post("/fundraising/targets")
      .send({ target: 12000 });
    expect(response.status).toBe(201);
    expect(response.body.item.target).toBe(12000);
  });
});

describe("donations", () => {
  it("creates a donation", async () => {
    const response = await request(app)
      .post("/donations")
      .send({ donorName: "Test Donor", donorEmail: "test@example.org", amount: 200 });
    expect(response.status).toBe(201);
    expect(response.body.item.amount).toBe(200);
  });

  it("returns donation log", async () => {
    const response = await request(app).get("/donations");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.items)).toBe(true);
  });
});

describe("participants", () => {
  it("records daily participants", async () => {
    const response = await request(app)
      .post("/participants/daily")
      .send({ locationId: "riverside", total: 100 });
    expect(response.status).toBe(201);
    expect(response.body.item.total).toBe(100);
  });

  it("returns daily participants", async () => {
    const response = await request(app).get("/participants/daily?date=2026-03-23");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.items)).toBe(true);
  });

  it("returns weekly participants", async () => {
    const response = await request(app).get("/participants/weekly?week=2026-W13");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.items)).toBe(true);
  });
});
