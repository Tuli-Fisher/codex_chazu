export type LocationRecord = {
  id: string;
  name: string;
  status: "Active" | "Seasonal" | "Inactive";
  type: "School" | "Community";
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
  method: "check" | "pledge" | "cash";
  note?: string;
};

export const locations: LocationRecord[] = [
  {
    id: "riverside",
    name: "Riverside Community Center",
    status: "Active",
    type: "Community",
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
  },
  {
    id: "northside-ms",
    name: "Northside Middle School",
    status: "Active",
    type: "School",
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
  },
  {
    id: "oak-hill",
    name: "Oak Hill Library",
    status: "Seasonal",
    type: "Community",
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
  },
  {
    id: "southridge",
    name: "Southridge Family Hub",
    status: "Active",
    type: "Community",
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
  },
];

export const donors: DonorRecord[] = [
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
];

export const donations: DonationRecord[] = [
  {
    id: "donation-1",
    donorId: "donor-1",
    locationId: "riverside",
    amount: 250,
    date: "2026-03-20",
    method: "check",
    note: "Breakfast program support",
  },
  {
    id: "donation-2",
    donorId: "donor-2",
    locationId: "riverside",
    amount: 100,
    date: "2026-03-18",
    method: "pledge",
  },
  {
    id: "donation-3",
    donorId: "donor-3",
    locationId: "riverside",
    amount: 500,
    date: "2026-03-12",
    method: "check",
  },
  {
    id: "donation-4",
    donorId: "donor-4",
    locationId: "northside-ms",
    amount: 1200,
    date: "2026-03-10",
    method: "check",
    note: "PTA spring drive",
  },
  {
    id: "donation-5",
    donorId: "donor-5",
    locationId: "oak-hill",
    amount: 900,
    date: "2026-03-05",
    method: "pledge",
  },
  {
    id: "donation-6",
    donorId: "donor-6",
    locationId: "southridge",
    amount: 400,
    date: "2026-03-08",
    method: "cash",
    note: "Community match",
  },
  {
    id: "donation-7",
    donorId: "donor-2",
    locationId: null,
    amount: 150,
    date: "2026-03-21",
    method: "pledge",
    note: "General fund",
  },
];

export const orderHistoryByLocation: Record<
  string,
  { date: string; breakfast: string; lunch: string; status: string }[]
> = {
  riverside: [
    { date: "Mar 22", breakfast: "84", lunch: "56", status: "Submitted" },
    { date: "Mar 21", breakfast: "90", lunch: "60", status: "Locked" },
    { date: "Mar 20", breakfast: "88", lunch: "58", status: "Locked" },
  ],
  "northside-ms": [
    { date: "Mar 22", breakfast: "130", lunch: "110", status: "Submitted" },
    { date: "Mar 21", breakfast: "124", lunch: "104", status: "Locked" },
    { date: "Mar 20", breakfast: "118", lunch: "98", status: "Locked" },
  ],
  "oak-hill": [
    { date: "Mar 19", breakfast: "60", lunch: "40", status: "Locked" },
    { date: "Mar 18", breakfast: "58", lunch: "39", status: "Locked" },
  ],
  southridge: [
    { date: "Mar 22", breakfast: "72", lunch: "54", status: "Submitted" },
    { date: "Mar 21", breakfast: "70", lunch: "52", status: "Locked" },
  ],
};

export function getLocationById(id: string) {
  return locations.find((location) => location.id === id) ?? null;
}

export function getDonorById(id: string) {
  return donors.find((donor) => donor.id === id) ?? null;
}

export function getDonationsForLocation(locationId: string) {
  return donations.filter((donation) => donation.locationId === locationId);
}
