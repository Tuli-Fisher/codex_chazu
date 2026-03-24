import { apiRequest } from "./api";

export type LocationRecord = {
  id: string;
  name: string;
  status: "Active" | "Seasonal" | "Inactive";
  type: "School" | "Community";
  managers: {
    id: string;
    name: string;
    phone: string;
    email: string;
    role: string;
    isPrimary: boolean;
  }[];
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

export type LocationHistoryRow = {
  date: string;
  breakfast: string;
  supper: string;
  status: string;
};

export type LocationFundraisingRow = {
  id: string;
  donorId: string;
  donor: string;
  amount: number;
  date: string;
  note?: string;
};

export async function fetchLocations(filters: {
  search?: string;
  status?: string;
}) {
  const params = new URLSearchParams();

  if (filters.search?.trim()) {
    params.set("q", filters.search.trim());
  }

  if (filters.status && filters.status !== "All") {
    params.set("status", filters.status.toLowerCase());
  }

  const query = params.toString();
  const response = await apiRequest<{ items: LocationRecord[] }>(
    `/locations${query ? `?${query}` : ""}`,
  );

  return response.items;
}

export async function fetchLocationById(id: string) {
  const response = await apiRequest<{ item: LocationRecord }>(`/locations/${id}`);
  return response.item;
}

export async function fetchLocationHistory(id: string) {
  const response = await apiRequest<{ items: LocationHistoryRow[] }>(
    `/locations/${id}/orders`,
  );
  return response.items;
}

export async function fetchLocationFundraising(id: string) {
  return apiRequest<{
    targetAmount: number;
    totalRaised: number;
    donations: LocationFundraisingRow[];
  }>(`/locations/${id}/fundraising`);
}
