import { apiRequest } from "./api";

export type DrilldownTab = "items" | "locations" | "dates";
export type MealFilter = "All" | "Breakfast" | "Supper";

export type HistoryItemRow = {
  item: string;
  meal: "Breakfast" | "Supper";
  total: number;
  avg: number;
  trend: string;
};

export type HistoryLocationRow = {
  location: string;
  breakfast: number;
  supper: number;
  onTime: string;
  lastOrder: string;
};

export type HistoryDateRow = {
  date: string;
  breakfast: number;
  supper: number;
  submissions: string;
  late: string;
};

export type HistorySummary = {
  mealsServed: number;
  onTimeSubmissions: string;
  fundraising: number;
};

export async function fetchHistory(
  tab: DrilldownTab,
  filters: {
    meal?: MealFilter;
    locationSearch?: string;
    includeLate?: boolean;
  },
) {
  const params = new URLSearchParams();
  params.set(
    "group_by",
    tab === "locations" ? "location" : tab === "dates" ? "date" : "item",
  );
  params.set("meal", filters.meal ?? "All");
  params.set("include_late", String(filters.includeLate ?? true));

  if (filters.locationSearch?.trim()) {
    params.set("q", filters.locationSearch.trim());
    params.set("location_id", filters.locationSearch.trim());
  }

  const response = await apiRequest<{
    items: HistoryItemRow[] | HistoryLocationRow[] | HistoryDateRow[];
    summary: HistorySummary;
  }>(`/aggregates?${params.toString()}`);

  return response;
}
