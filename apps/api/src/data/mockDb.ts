export type MealType = "breakfast" | "supper";

export type MenuBasic = {
  id: string;
  name: string;
  defaultUnit: string;
  defaultMeal: "Breakfast" | "Supper";
  active: boolean;
};

export type DailyMenuItem = {
  id: string;
  basicId: string | null;
  mealType: MealType;
  name: string;
  unit: string;
  packSize: string;
  notes?: string;
};

export type DailyMenu = {
  id: string;
  date: string;
  lockAt: string;
  items: DailyMenuItem[];
};

export type LocationManager = {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  isPrimary: boolean;
};

export type LocationRecord = {
  id: string;
  name: string;
  status: "Active" | "Seasonal" | "Inactive";
  type: "School" | "Community";
  managers: LocationManager[];
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
  };
  deliveryWindow: string;
  pickupNotes: string;
  dietaryNotes: string;
  weeklyParticipants: number;
  fundraisingTarget: number;
  fundraisingRaised: number;
  todayOrder: {
    breakfast: string;
    supper: string;
    status: "Submitted" | "Late" | "Missing" | "Locked";
    updatedAt: string;
    note: string;
  };
};

export type DonorRecord = {
  id: string;
  name: string;
  email: string;
  phone?: string;
};

export type DonationRecord = {
  id: string;
  donorId: string;
  locationId: string | null;
  amount: number;
  date: string;
  method: "cash" | "check" | "credit card" | "other";
  note?: string;
  seasonId: string;
};

export type OrderLine = {
  meal: "Breakfast" | "Supper";
  item: string;
  unit: string;
  quantity: number;
};

export type TodayOrderRow = {
  id: string;
  locationId: string;
  locationName: string;
  managerName: string;
  managerPhone: string;
  updatedAt: string;
  breakfast: "submitted" | "missing" | "late" | "not_ordered";
  supper: "submitted" | "missing" | "late" | "not_ordered";
  note: string;
  lines: OrderLine[];
  isLocked: boolean;
};

export type Season = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

export type Settings = {
  lockTime: string;
  timezone: string;
  lateThresholdMinutes: number;
};

export type SessionUser = {
  email: string;
};

type HistoryItemRow = {
  item: string;
  meal: "Breakfast" | "Supper";
  total: number;
  avg: number;
  trend: string;
};

type HistoryLocationRow = {
  location: string;
  breakfast: number;
  supper: number;
  onTime: string;
  lastOrder: string;
};

type HistoryDateRow = {
  date: string;
  breakfast: number;
  supper: number;
  submissions: string;
  late: string;
};

export const db = {
  todayDate: "2026-03-24",
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
    {
      id: "bagels",
      name: "Bagels",
      defaultUnit: "dozen",
      defaultMeal: "Breakfast",
      active: true,
    },
    {
      id: "fresh-fruit",
      name: "Fresh fruit",
      defaultUnit: "trays",
      defaultMeal: "Breakfast",
      active: true,
    },
    {
      id: "yogurt-cups",
      name: "Yogurt cups",
      defaultUnit: "cases",
      defaultMeal: "Breakfast",
      active: true,
    },
    {
      id: "chicken-chili",
      name: "Chicken chili",
      defaultUnit: "pans",
      defaultMeal: "Supper",
      active: true,
    },
    {
      id: "cornbread",
      name: "Cornbread",
      defaultUnit: "loaves",
      defaultMeal: "Supper",
      active: true,
    },
    {
      id: "green-salad",
      name: "Green salad",
      defaultUnit: "bags",
      defaultMeal: "Supper",
      active: true,
    },
    {
      id: "turkey-sandwiches",
      name: "Turkey sandwiches",
      defaultUnit: "trays",
      defaultMeal: "Supper",
      active: true,
    },
    {
      id: "granola-bars",
      name: "Granola bars",
      defaultUnit: "cases",
      defaultMeal: "Breakfast",
      active: true,
    },
    {
      id: "milk-cartons",
      name: "Milk cartons",
      defaultUnit: "cases",
      defaultMeal: "Breakfast",
      active: true,
    },
    {
      id: "veggie-tray",
      name: "Veggie tray",
      defaultUnit: "trays",
      defaultMeal: "Supper",
      active: true,
    },
    {
      id: "apple-slices",
      name: "Apple slices",
      defaultUnit: "trays",
      defaultMeal: "Breakfast",
      active: true,
    },
    {
      id: "juice-boxes",
      name: "Juice boxes",
      defaultUnit: "cases",
      defaultMeal: "Breakfast",
      active: true,
    },
  ] as MenuBasic[],
  todayMenu: {
    id: "menu-today-2026-03-24",
    date: "2026-03-24",
    lockAt: "16:30",
    items: [
      {
        id: "today-bagels",
        basicId: "bagels",
        mealType: "breakfast",
        name: "Bagels",
        unit: "dozen",
        packSize: "12",
      },
      {
        id: "today-fresh-fruit",
        basicId: "fresh-fruit",
        mealType: "breakfast",
        name: "Fresh fruit",
        unit: "trays",
        packSize: "1",
      },
      {
        id: "today-yogurt-cups",
        basicId: "yogurt-cups",
        mealType: "breakfast",
        name: "Yogurt cups",
        unit: "cases",
        packSize: "24",
      },
      {
        id: "today-chicken-chili",
        basicId: "chicken-chili",
        mealType: "supper",
        name: "Chicken chili",
        unit: "pans",
        packSize: "1",
      },
      {
        id: "today-cornbread",
        basicId: "cornbread",
        mealType: "supper",
        name: "Cornbread",
        unit: "loaves",
        packSize: "1",
      },
      {
        id: "today-green-salad",
        basicId: "green-salad",
        mealType: "supper",
        name: "Green salad",
        unit: "bags",
        packSize: "1",
      },
    ] as DailyMenuItem[],
  } satisfies DailyMenu,
  locations: [
    {
      id: "riverside",
      name: "Riverside Community Center",
      status: "Active",
      type: "Community",
      managers: [
        {
          id: "manager-riverside-1",
          name: "Taylor Lee",
          phone: "(555) 212-8871",
          email: "taylor.lee@riverside.org",
          role: "Program Lead",
          isPrimary: true,
        },
        {
          id: "manager-riverside-2",
          name: "Maya Chen",
          phone: "(555) 212-8833",
          email: "maya.chen@riverside.org",
          role: "Operations",
          isPrimary: false,
        },
      ],
      contact: {
        name: "Taylor Lee",
        phone: "(555) 212-8871",
        email: "taylor.lee@riverside.org",
      },
      address: {
        line1: "120 Harbor Ave",
        city: "Wilmington",
        state: "DE",
        zip: "19801",
      },
      deliveryWindow: "7:30 AM - 9:00 AM",
      pickupNotes: "Dock entrance, call upon arrival",
      dietaryNotes: "Nut-free preference",
      weeklyParticipants: 310,
      fundraisingTarget: 20000,
      fundraisingRaised: 15420,
      todayOrder: {
        breakfast: "84 units",
        supper: "56 units",
        status: "Submitted",
        updatedAt: "1:10 PM",
        note: "Ready to send to vendor",
      },
    },
    {
      id: "northside-ms",
      name: "Northside Middle School",
      status: "Active",
      type: "School",
      managers: [
        {
          id: "manager-northside-1",
          name: "Jordan Smith",
          phone: "(555) 220-4459",
          email: "j.smith@northside.edu",
          role: "Site Coordinator",
          isPrimary: true,
        },
        {
          id: "manager-northside-2",
          name: "Alicia Gomez",
          phone: "(555) 220-4412",
          email: "alicia.gomez@northside.edu",
          role: "Assistant Coordinator",
          isPrimary: false,
        },
      ],
      contact: {
        name: "Jordan Smith",
        phone: "(555) 220-4459",
        email: "j.smith@northside.edu",
      },
      address: {
        line1: "82 Lakeview Dr",
        city: "Newark",
        state: "DE",
        zip: "19711",
      },
      deliveryWindow: "6:45 AM - 8:00 AM",
      pickupNotes: "Deliver to cafeteria door",
      dietaryNotes: "Gluten-free options weekly",
      weeklyParticipants: 425,
      fundraisingTarget: 25000,
      fundraisingRaised: 18200,
      todayOrder: {
        breakfast: "130 units",
        supper: "Pending",
        status: "Late",
        updatedAt: "12:48 PM",
        note: "Supper order still outstanding",
      },
    },
    {
      id: "oak-hill",
      name: "Oak Hill Library",
      status: "Seasonal",
      type: "Community",
      managers: [
        {
          id: "manager-oak-hill-1",
          name: "Riley Patel",
          phone: "(555) 310-9022",
          email: "riley.patel@oakhill.org",
          role: "Program Lead",
          isPrimary: true,
        },
      ],
      contact: {
        name: "Riley Patel",
        phone: "(555) 310-9022",
        email: "riley.patel@oakhill.org",
      },
      address: {
        line1: "5 Maple Court",
        city: "Dover",
        state: "DE",
        zip: "19901",
      },
      deliveryWindow: "8:15 AM - 9:30 AM",
      pickupNotes: "Use side entrance",
      dietaryNotes: "Vegetarian preference",
      weeklyParticipants: 180,
      fundraisingTarget: 12000,
      fundraisingRaised: 6400,
      todayOrder: {
        breakfast: "Missing",
        supper: "40 units",
        status: "Late",
        updatedAt: "1:34 PM",
        note: "Breakfast not received yet",
      },
    },
    {
      id: "southridge",
      name: "Southridge Family Hub",
      status: "Active",
      type: "Community",
      managers: [
        {
          id: "manager-southridge-1",
          name: "Morgan Price",
          phone: "(555) 443-7711",
          email: "mprice@southridge.org",
          role: "Family Services Lead",
          isPrimary: true,
        },
        {
          id: "manager-southridge-2",
          name: "Devon Hall",
          phone: "(555) 443-7754",
          email: "devon.hall@southridge.org",
          role: "Operations",
          isPrimary: false,
        },
      ],
      contact: {
        name: "Morgan Price",
        phone: "(555) 443-7711",
        email: "mprice@southridge.org",
      },
      address: {
        line1: "450 Pine St",
        city: "Middletown",
        state: "DE",
        zip: "19709",
      },
      deliveryWindow: "7:00 AM - 8:30 AM",
      pickupNotes: "Ring bell at admin office",
      dietaryNotes: "Low-sodium request",
      weeklyParticipants: 260,
      fundraisingTarget: 18000,
      fundraisingRaised: 9700,
      todayOrder: {
        breakfast: "72 units",
        supper: "54 units",
        status: "Missing",
        updatedAt: "-",
        note: "Supper not received",
      },
    },
    {
      id: "eastfield",
      name: "Eastfield Elementary",
      status: "Active",
      type: "School",
      managers: [
        {
          id: "manager-eastfield-1",
          name: "Casey Tran",
          phone: "(555) 319-4410",
          email: "casey.tran@eastfield.edu",
          role: "Site Coordinator",
          isPrimary: true,
        },
        {
          id: "manager-eastfield-2",
          name: "Avery Brooks",
          phone: "(555) 319-4411",
          email: "avery.brooks@eastfield.edu",
          role: "Assistant Coordinator",
          isPrimary: false,
        },
      ],
      contact: {
        name: "Casey Tran",
        phone: "(555) 319-4410",
        email: "casey.tran@eastfield.edu",
      },
      address: {
        line1: "31 Oak Avenue",
        city: "Middletown",
        state: "DE",
        zip: "19709",
      },
      deliveryWindow: "7:10 AM - 8:20 AM",
      pickupNotes: "Side door near office",
      dietaryNotes: "Allergy-aware prep",
      weeklyParticipants: 215,
      fundraisingTarget: 14000,
      fundraisingRaised: 8250,
      todayOrder: {
        breakfast: "62 units",
        supper: "Not scheduled",
        status: "Submitted",
        updatedAt: "11:52 AM",
        note: "Breakfast only today",
      },
    },
  ] as LocationRecord[],
  donors: [
    {
      id: "donor-1",
      name: "Lydia Ross",
      email: "lydia.ross@example.org",
      phone: "(555) 201-3321",
    },
    {
      id: "donor-2",
      name: "Darren Cook",
      email: "d.cook@example.org",
      phone: "(555) 201-4410",
    },
    {
      id: "donor-3",
      name: "K. Patel",
      email: "k.patel@example.org",
    },
    {
      id: "donor-4",
      name: "City PTA",
      email: "pta@example.org",
    },
    {
      id: "donor-5",
      name: "Community Fund",
      email: "fund@example.org",
    },
    {
      id: "donor-6",
      name: "Neighborhood Assoc.",
      email: "neighborhood@example.org",
    },
  ] as DonorRecord[],
  donations: [
    {
      id: "donation-1",
      donorId: "donor-1",
      locationId: "riverside",
      amount: 250,
      date: "2026-03-20",
      method: "check",
      note: "Breakfast program support",
      seasonId: "season-2026-spring",
    },
    {
      id: "donation-2",
      donorId: "donor-2",
      locationId: "riverside",
      amount: 100,
      date: "2026-03-18",
      method: "other",
      seasonId: "season-2026-spring",
    },
    {
      id: "donation-3",
      donorId: "donor-3",
      locationId: "riverside",
      amount: 500,
      date: "2026-03-12",
      method: "check",
      seasonId: "season-2026-spring",
    },
    {
      id: "donation-4",
      donorId: "donor-4",
      locationId: "northside-ms",
      amount: 1200,
      date: "2026-03-10",
      method: "check",
      note: "PTA spring drive",
      seasonId: "season-2026-spring",
    },
    {
      id: "donation-5",
      donorId: "donor-5",
      locationId: "oak-hill",
      amount: 900,
      date: "2026-03-05",
      method: "other",
      seasonId: "season-2026-spring",
    },
    {
      id: "donation-6",
      donorId: "donor-6",
      locationId: "southridge",
      amount: 400,
      date: "2026-03-08",
      method: "cash",
      note: "Community match",
      seasonId: "season-2026-spring",
    },
    {
      id: "donation-7",
      donorId: "donor-2",
      locationId: null,
      amount: 150,
      date: "2026-03-21",
      method: "other",
      note: "General fund",
      seasonId: "season-2026-spring",
    },
  ] as DonationRecord[],
  todayOrders: [
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
        { meal: "Breakfast", item: "Yogurt cups", unit: "cases", quantity: 8 },
        { meal: "Supper", item: "Chicken chili", unit: "pans", quantity: 3 },
        { meal: "Supper", item: "Green salad", unit: "bags", quantity: 2 },
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
      lines: [
        { meal: "Breakfast", item: "Bagels", unit: "dozen", quantity: 10 },
        { meal: "Breakfast", item: "Fresh fruit", unit: "trays", quantity: 6 },
        { meal: "Supper", item: "Chicken chili", unit: "pans", quantity: 5 },
        { meal: "Supper", item: "Cornbread", unit: "loaves", quantity: 4 },
      ],
      isLocked: false,
    },
    {
      id: "oak-hill",
      locationId: "oak-hill",
      locationName: "Oak Hill Library",
      managerName: "Riley Patel",
      managerPhone: "(555) 310-9022",
      updatedAt: "1:34 PM",
      breakfast: "missing",
      supper: "late",
      note: "Late supper order",
      lines: [
        { meal: "Breakfast", item: "Yogurt cups", unit: "cases", quantity: 4 },
        { meal: "Supper", item: "Chicken chili", unit: "pans", quantity: 2 },
        { meal: "Supper", item: "Green salad", unit: "bags", quantity: 2 },
      ],
      isLocked: false,
    },
    {
      id: "southridge",
      locationId: "southridge",
      locationName: "Southridge Family Hub",
      managerName: "Morgan Price",
      managerPhone: "(555) 443-7711",
      updatedAt: "-",
      breakfast: "not_ordered",
      supper: "missing",
      note: "Supper not received",
      lines: [
        { meal: "Breakfast", item: "Granola bars", unit: "cases", quantity: 7 },
        { meal: "Breakfast", item: "Milk cartons", unit: "cases", quantity: 9 },
        { meal: "Supper", item: "Chicken chili", unit: "pans", quantity: 4 },
      ],
      isLocked: false,
    },
    {
      id: "eastfield",
      locationId: "eastfield",
      locationName: "Eastfield Elementary",
      managerName: "Casey Tran",
      managerPhone: "(555) 319-4410",
      updatedAt: "11:52 AM",
      breakfast: "submitted",
      supper: "not_ordered",
      note: "Supper not scheduled",
      lines: [
        { meal: "Breakfast", item: "Apple slices", unit: "trays", quantity: 5 },
        { meal: "Breakfast", item: "Juice boxes", unit: "cases", quantity: 8 },
      ],
      isLocked: false,
    },
  ] as TodayOrderRow[],
  orderHistoryByLocation: {
    riverside: [
      { date: "Mar 22", breakfast: "84", supper: "56", status: "Submitted" },
      { date: "Mar 21", breakfast: "90", supper: "60", status: "Locked" },
      { date: "Mar 20", breakfast: "88", supper: "58", status: "Locked" },
    ],
    "northside-ms": [
      { date: "Mar 22", breakfast: "130", supper: "110", status: "Submitted" },
      { date: "Mar 21", breakfast: "124", supper: "104", status: "Locked" },
      { date: "Mar 20", breakfast: "118", supper: "98", status: "Locked" },
    ],
    "oak-hill": [
      { date: "Mar 19", breakfast: "60", supper: "40", status: "Locked" },
      { date: "Mar 18", breakfast: "58", supper: "39", status: "Locked" },
    ],
    southridge: [
      { date: "Mar 22", breakfast: "72", supper: "54", status: "Submitted" },
      { date: "Mar 21", breakfast: "70", supper: "52", status: "Locked" },
    ],
    eastfield: [
      { date: "Mar 22", breakfast: "62", supper: "0", status: "Submitted" },
      { date: "Mar 21", breakfast: "64", supper: "0", status: "Locked" },
    ],
  } as Record<
    string,
    { date: string; breakfast: string; supper: string; status: string }[]
  >,
  history: {
    items: [
      {
        item: "Bagels",
        meal: "Breakfast",
        total: 620,
        avg: 44,
        trend: "+4%",
      },
      {
        item: "Yogurt cups",
        meal: "Breakfast",
        total: 480,
        avg: 34,
        trend: "+2%",
      },
      {
        item: "Chicken chili",
        meal: "Supper",
        total: 310,
        avg: 22,
        trend: "-3%",
      },
      {
        item: "Green salad",
        meal: "Supper",
        total: 260,
        avg: 18,
        trend: "+1%",
      },
    ] as HistoryItemRow[],
    locations: [
      {
        location: "Riverside Community Center",
        breakfast: 280,
        supper: 190,
        onTime: "96%",
        lastOrder: "Mar 22",
      },
      {
        location: "Northside Middle School",
        breakfast: 340,
        supper: 270,
        onTime: "92%",
        lastOrder: "Mar 22",
      },
      {
        location: "Oak Hill Library",
        breakfast: 140,
        supper: 110,
        onTime: "88%",
        lastOrder: "Mar 19",
      },
    ] as HistoryLocationRow[],
    dates: [
      {
        date: "Mar 22",
        breakfast: 420,
        supper: 310,
        submissions: "12/14",
        late: "1",
      },
      {
        date: "Mar 21",
        breakfast: 398,
        supper: 298,
        submissions: "14/14",
        late: "0",
      },
      {
        date: "Mar 20",
        breakfast: 402,
        supper: 285,
        submissions: "13/14",
        late: "2",
      },
    ] as HistoryDateRow[],
  },
  sessions: new Map<string, SessionUser>(),
};

export function getActiveSeason() {
  return db.seasons.find((season) => season.isActive) ?? null;
}

export function getLocationById(id: string) {
  return db.locations.find((location) => location.id === id) ?? null;
}

export function getContactsForLocation(locationId: string) {
  return getLocationById(locationId)?.managers ?? [];
}

export function getOrdersByLocation() {
  return db.todayOrders.map((order) => ({ ...order }));
}

export function getOrderById(id: string) {
  return db.todayOrders.find((order) => order.id === id) ?? null;
}

export function getAggregateTotals() {
  const totals = new Map<
    string,
    { item: string; meal: "Breakfast" | "Supper"; unit: string; total: number }
  >();

  for (const order of db.todayOrders) {
    for (const line of order.lines) {
      const key = `${line.meal}|${line.item}|${line.unit}`;
      const existing = totals.get(key);
      if (existing) {
        existing.total += line.quantity;
      } else {
        totals.set(key, {
          item: line.item,
          meal: line.meal,
          unit: line.unit,
          total: line.quantity,
        });
      }
    }
  }

  return Array.from(totals.values());
}

export function getLocationHistory(locationId: string) {
  return db.orderHistoryByLocation[locationId] ?? [];
}

export function getDonorById(id: string) {
  return db.donors.find((donor) => donor.id === id) ?? null;
}

export function getDonationsForLocation(locationId: string) {
  return db.donations.filter((donation) => donation.locationId === locationId);
}

export function getDonationRows(filters: {
  locationId?: string | null;
  seasonId?: string | null;
  q?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
}) {
  const q = filters.q?.trim().toLowerCase() ?? "";

  return db.donations
    .filter((donation) => {
      if (filters.locationId === "general") {
        return donation.locationId === null;
      }
      if (filters.locationId && filters.locationId !== "all") {
        return donation.locationId === filters.locationId;
      }
      return true;
    })
    .filter((donation) =>
      filters.seasonId ? donation.seasonId === filters.seasonId : true,
    )
    .filter((donation) =>
      filters.dateFrom ? donation.date >= filters.dateFrom : true,
    )
    .filter((donation) => (filters.dateTo ? donation.date <= filters.dateTo : true))
    .map((donation) => {
      const donor = getDonorById(donation.donorId);
      const location = donation.locationId
        ? getLocationById(donation.locationId)
        : null;

      return {
        ...donation,
        donorName: donor?.name ?? "Unknown donor",
        donorEmail: donor?.email ?? "",
        locationName: location?.name ?? "General Fund",
      };
    })
    .filter((donation) => {
      if (!q) return true;
      return (
        donation.donorName.toLowerCase().includes(q) ||
        donation.donorEmail.toLowerCase().includes(q) ||
        donation.locationName.toLowerCase().includes(q)
      );
    });
}

export function createDonor(input: { name: string; email: string; phone?: string }) {
  const donor = {
    id: `donor-${db.donors.length + 1}`,
    name: input.name,
    email: input.email,
    phone: input.phone,
  };

  db.donors.push(donor);
  return donor;
}

export function createDonation(input: {
  donorId: string;
  locationId: string | null;
  amount: number;
  date: string;
  method: DonationRecord["method"];
  note?: string;
  seasonId?: string;
}) {
  const donation = {
    id: `donation-${db.donations.length + 1}`,
    donorId: input.donorId,
    locationId: input.locationId,
    amount: input.amount,
    date: input.date,
    method: input.method,
    note: input.note,
    seasonId: input.seasonId ?? getActiveSeason()?.id ?? "season-unknown",
  } satisfies DonationRecord;

  db.donations.unshift(donation);
  return donation;
}

export function createMenuBasic(input: {
  name: string;
  defaultUnit: string;
  defaultMeal: "Breakfast" | "Supper";
  active?: boolean;
}) {
  const slug = input.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const baseId = slug || `basic-${db.menuBasics.length + 1}`;
  const existingIds = new Set(db.menuBasics.map((basic) => basic.id));
  let nextId = baseId;
  let suffix = 2;

  while (existingIds.has(nextId)) {
    nextId = `${baseId}-${suffix}`;
    suffix += 1;
  }

  const basic = {
    id: nextId,
    name: input.name,
    defaultUnit: input.defaultUnit,
    defaultMeal: input.defaultMeal,
    active: input.active ?? true,
  } satisfies MenuBasic;

  db.menuBasics.push(basic);
  return basic;
}

export function addItemToTodayMenu(input: {
  basicId?: string | null;
  name: string;
  mealType: MealType;
  unit: string;
  packSize?: string;
  notes?: string;
}) {
  const item = {
    id: `menu-item-${db.todayMenu.items.length + 1}`,
    basicId: input.basicId ?? null,
    mealType: input.mealType,
    name: input.name,
    unit: input.unit,
    packSize: input.packSize ?? "1",
    notes: input.notes,
  } satisfies DailyMenuItem;

  db.todayMenu.items.push(item);
  return item;
}

export function removeItemFromTodayMenu(itemId: string) {
  const index = db.todayMenu.items.findIndex((item) => item.id === itemId);
  if (index === -1) {
    return false;
  }

  db.todayMenu.items.splice(index, 1);
  return true;
}

export function createSession(email: string) {
  const token = `token-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const user = { email };

  db.sessions.set(token, user);
  return { token, user };
}

export function getSession(token: string | null | undefined) {
  if (!token) return null;
  return db.sessions.get(token) ?? null;
}

export function deleteSession(token: string | null | undefined) {
  if (!token) return false;
  return db.sessions.delete(token);
}
