import { apiRequest } from "./api";

export type DonationMethod = "cash" | "check" | "credit card" | "other";

export type DonationRow = {
  id: string;
  donorId: string;
  donorName: string;
  donorEmail: string;
  locationId: string | null;
  locationName: string;
  amount: number;
  date: string;
  method: DonationMethod;
  note?: string;
  seasonId: string;
};

export function formatDonationMethod(method: DonationMethod) {
  return method
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function fetchDonations(filters: {
  locationId?: string;
  seasonId?: string;
  q?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  const params = new URLSearchParams();

  if (filters.locationId && filters.locationId !== "all") {
    params.set("location_id", filters.locationId);
  }

  if (filters.seasonId) {
    params.set("season_id", filters.seasonId);
  }

  if (filters.q?.trim()) {
    params.set("q", filters.q.trim());
  }

  if (filters.dateFrom) {
    params.set("date_from", filters.dateFrom);
  }

  if (filters.dateTo) {
    params.set("date_to", filters.dateTo);
  }

  const query = params.toString();
  const response = await apiRequest<{ items: DonationRow[] }>(
    `/donations${query ? `?${query}` : ""}`,
  );

  return response.items;
}

export async function createDonation(input: {
  donorName: string;
  donorEmail: string;
  amount: number;
  locationId: string;
  method: DonationMethod;
  note?: string;
  date?: string;
  seasonId?: string;
}) {
  const response = await apiRequest<{ item: DonationRow }>("/donations", {
    method: "POST",
    body: input,
  });

  return response.item;
}
