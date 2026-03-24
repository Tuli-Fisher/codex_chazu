import { apiRequest } from "./api";

export type MealLabel = "Breakfast" | "Supper";

export type MenuBasic = {
  id: string;
  name: string;
  defaultUnit: string;
  defaultMeal: MealLabel;
  active: boolean;
};

export type TodayMenuItem = {
  id: string;
  basicId: string | null;
  mealType: "breakfast" | "supper";
  name: string;
  unit: string;
  packSize: string;
  notes?: string;
};

export type TodayMenu = {
  id: string;
  date: string;
  lockAt: string;
  items: TodayMenuItem[];
};

export async function fetchTodayMenu() {
  return apiRequest<TodayMenu>("/menus/today");
}

export async function fetchMenuBasics() {
  const response = await apiRequest<{ items: MenuBasic[] }>("/menu-basics");
  return response.items;
}

export async function createMenuBasic(input: {
  name: string;
  defaultUnit: string;
  defaultMeal: MealLabel;
}) {
  const response = await apiRequest<{ item: MenuBasic }>("/menu-basics", {
    method: "POST",
    body: input,
  });

  return response.item;
}

export async function addTodayMenuItem(
  menuId: string,
  input: {
    basicId?: string | null;
    name: string;
    mealType: "breakfast" | "supper";
    unit: string;
    packSize?: string;
  },
) {
  const response = await apiRequest<{ item: TodayMenuItem }>(
    `/menus/${menuId}/items`,
    {
      method: "POST",
      body: input,
    },
  );

  return response.item;
}

export async function removeTodayMenuItem(menuId: string, itemId: string) {
  return apiRequest<{ ok: true; itemId: string }>(`/menus/${menuId}/items/remove`, {
    method: "POST",
    body: { itemId },
  });
}
