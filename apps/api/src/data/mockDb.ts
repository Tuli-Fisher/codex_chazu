export type MealType = "breakfast" | "supper";

export type DailyMenuItem = {
  id: string;
  mealType: MealType;
  name: string;
  unit: string;
  packSize: string;
};

export type LocationSummary = {
  id: string;
  name: string;
  status: "active" | "seasonal" | "inactive";
  primaryContact: string;
  phone: string;
};

export type LocationContact = {
  id: string;
  locationId: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  isPrimary: boolean;
};

export type OrderItem = {
  menuItemId: string;
  name: string;
  mealType: MealType;
  unit: string;
  quantity: number;
};

export type LocationOrder = {
  locationId: string;
  locationName: string;
  status: "draft" | "submitted" | "locked" | "missing" | "late";
  updatedAt: string;
  items: OrderItem[];
};

export type Season = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

export type MenuBasic = {
  id: string;
  name: string;
  defaultUnit: string;
  active: boolean;
};

export type Settings = {
  lockTime: string;
  timezone: string;
  lateThresholdMinutes: number;
};

export const db = {
  todayDate: "2026-03-23",
  settings: {
    lockTime: "16:30",
    timezone: "America/New_York",
    lateThresholdMinutes: 30,
  } satisfies Settings,
  seasons: [
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
  ] as Season[],
  menuBasics: [
    { id: "basic-1", name: "Bagels", defaultUnit: "dozen", active: true },
    {
      id: "basic-2",
      name: "Cream cheese",
      defaultUnit: "tubs",
      active: true,
    },
    {
      id: "basic-3",
      name: "Granola bars",
      defaultUnit: "cases",
      active: true,
    },
  ] as MenuBasic[],
  todayMenu: [
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
  ] as DailyMenuItem[],
  locations: [
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
  ] as LocationSummary[],
  locationContacts: [
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
  ] as LocationContact[],
  locationOrders: [
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
  ] as LocationOrder[],
};

export function getActiveSeason() {
  return db.seasons.find((season) => season.isActive) ?? null;
}

export function getLocationById(id: string) {
  return db.locations.find((location) => location.id === id) ?? null;
}

export function getContactsForLocation(locationId: string) {
  return db.locationContacts.filter(
    (contact) => contact.locationId === locationId,
  );
}

export function getOrdersByLocation() {
  const orderMap = new Map(
    db.locationOrders.map((order) => [order.locationId, order]),
  );

  return db.locations
    .filter((location) => location.status !== "inactive")
    .map((location) =>
      orderMap.get(location.id) ?? {
        locationId: location.id,
        locationName: location.name,
        status: "missing",
        updatedAt: "-",
        items: [],
      },
    );
}

export function getAggregateTotals() {
  const totals = new Map<string, { item: string; meal: string; total: number }>();

  for (const order of db.locationOrders) {
    for (const item of order.items) {
      const key = `${item.name}|${item.mealType}`;
      const existing = totals.get(key);
      if (existing) {
        existing.total += item.quantity;
      } else {
        totals.set(key, {
          item: item.name,
          meal: item.mealType === "supper" ? "Supper" : "Breakfast",
          total: item.quantity,
        });
      }
    }
  }

  return Array.from(totals.values());
}
