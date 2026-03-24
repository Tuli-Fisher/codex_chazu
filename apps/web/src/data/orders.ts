import { apiRequest } from "./api";

export type MealStatus = "submitted" | "missing" | "late" | "not_ordered";

export type OrderLine = {
  meal: "Breakfast" | "Supper";
  item: string;
  unit: string;
  quantity: number;
};

export type LocationOrder = {
  id: string;
  locationId: string;
  locationName: string;
  managerName: string;
  managerPhone: string;
  updatedAt: string;
  breakfast: MealStatus;
  supper: MealStatus;
  note: string;
  lines: OrderLine[];
  isLocked: boolean;
};

export type AggregateRow = {
  item: string;
  meal: "Breakfast" | "Supper";
  unit: string;
  total: number;
};

export async function fetchOrdersToday(filters: {
  locationId?: string | null;
  missingOnly?: boolean;
}) {
  const params = new URLSearchParams();

  if (filters.locationId) {
    params.set("location_id", filters.locationId);
  }

  if (filters.missingOnly) {
    params.set("missing_only", "true");
  }

  const query = params.toString();
  const response = await apiRequest<{ date: string; items: LocationOrder[] }>(
    `/orders/today/by-location${query ? `?${query}` : ""}`,
  );

  return response;
}

export async function fetchTodayAggregateTotals() {
  const response = await apiRequest<{ date: string; items: AggregateRow[] }>(
    "/orders/today/aggregate",
  );

  return response.items;
}

export async function sendOrderReminders(locationIds?: string[]) {
  return apiRequest<{ ok: true; sent: number; locationIds: string[] }>(
    "/orders/today/remind",
    {
      method: "POST",
      body: locationIds ? { locationIds } : {},
    },
  );
}

export async function lockAllOrders(date?: string) {
  return apiRequest<{ ok: true; date: string }>("/orders/lock", {
    method: "POST",
    body: date ? { date } : {},
  });
}

export async function lockOrder(id: string) {
  return apiRequest<{ ok: true; orderId: string }>(`/orders/${id}/lock`, {
    method: "POST",
  });
}

export async function unlockOrder(id: string) {
  return apiRequest<{ ok: true; orderId: string }>(`/orders/${id}/unlock`, {
    method: "POST",
  });
}

export async function emailOrders(locationIds?: string[]) {
  return apiRequest<{ ok: true; sent: number; locationIds: string[] }>(
    "/orders/today/email",
    {
      method: "POST",
      body: locationIds ? { locationIds } : {},
    },
  );
}

export async function exportOrders(format: "csv" | "pdf") {
  return apiRequest<{ ok: true; format: "csv" | "pdf" }>(
    `/orders/today/export?format=${format}`,
  );
}
