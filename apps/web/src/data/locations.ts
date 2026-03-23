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

export const donationsByLocation: Record<
  string,
  { donor: string; amount: string; date: string; note?: string }[]
> = {
  riverside: [
    { donor: "Lydia Ross", amount: "$250", date: "Mar 20" },
    { donor: "Darren Cook", amount: "$100", date: "Mar 18" },
    { donor: "K. Patel", amount: "$500", date: "Mar 12" },
  ],
  "northside-ms": [
    { donor: "M. Hernandez", amount: "$300", date: "Mar 19" },
    { donor: "City PTA", amount: "$1,200", date: "Mar 10" },
  ],
  "oak-hill": [
    { donor: "Community Fund", amount: "$900", date: "Mar 05" },
  ],
  southridge: [
    { donor: "R. Coleman", amount: "$150", date: "Mar 17" },
    { donor: "Neighborhood Assoc.", amount: "$400", date: "Mar 08" },
  ],
};

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
