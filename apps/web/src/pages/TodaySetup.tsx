import { useState } from "react";
import { PageHeader } from "../ui/PageHeader";

type MealLabel = "Breakfast" | "Supper";

type MenuItem = {
  id: string;
  name: string;
  defaultMeal: MealLabel;
};

const initialMenuItems: MenuItem[] = [
  { id: "bagels", name: "Bagels", defaultMeal: "Breakfast" },
  { id: "fresh-fruit", name: "Fresh fruit", defaultMeal: "Breakfast" },
  { id: "yogurt-cups", name: "Yogurt cups", defaultMeal: "Breakfast" },
  { id: "chicken-chili", name: "Chicken chili", defaultMeal: "Supper" },
  { id: "cornbread", name: "Cornbread", defaultMeal: "Supper" },
  { id: "green-salad", name: "Green salad", defaultMeal: "Supper" },
  { id: "turkey-sandwiches", name: "Turkey sandwiches", defaultMeal: "Supper" },
  { id: "granola-bars", name: "Granola bars", defaultMeal: "Breakfast" },
  { id: "milk-cartons", name: "Milk cartons", defaultMeal: "Breakfast" },
  { id: "veggie-tray", name: "Veggie tray", defaultMeal: "Supper" },
  { id: "apple-slices", name: "Apple slices", defaultMeal: "Breakfast" },
  { id: "juice-boxes", name: "Juice boxes", defaultMeal: "Breakfast" },
];

const initialBreakfastIds = ["bagels", "fresh-fruit", "yogurt-cups"];
const initialSupperIds = ["chicken-chili", "cornbread", "green-salad"];
const initialAvailableIds = [
  "turkey-sandwiches",
  "granola-bars",
  "milk-cartons",
  "veggie-tray",
  "apple-slices",
  "juice-boxes",
];

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createUniqueItemId(name: string, existingIds: Set<string>) {
  const base = toSlug(name) || "menu-item";
  let candidate = base;
  let suffix = 2;

  while (existingIds.has(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

export function TodaySetup() {
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [breakfastIds, setBreakfastIds] = useState(initialBreakfastIds);
  const [supperIds, setSupperIds] = useState(initialSupperIds);
  const [availableIds, setAvailableIds] = useState(initialAvailableIds);
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDefaultMeal, setNewItemDefaultMeal] = useState<MealLabel>("Breakfast");
  const [newItemError, setNewItemError] = useState("");

  const itemsById = Object.fromEntries(
    menuItems.map((item) => [item.id, item])
  ) as Record<string, MenuItem>;

  const menuCols = "1.6fr 1fr 0.8fr";
  const availableCols = "1.8fr 1fr 1.2fr";
  const breakfastItems = breakfastIds.map((id) => itemsById[id]);
  const supperItems = supperIds.map((id) => itemsById[id]);
  const availableItems = availableIds.map((id) => itemsById[id]);

  const addToBreakfast = (id: string) => {
    setAvailableIds((prev) => prev.filter((itemId) => itemId !== id));
    setBreakfastIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const addToSupper = (id: string) => {
    setAvailableIds((prev) => prev.filter((itemId) => itemId !== id));
    setSupperIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeFromBreakfast = (id: string) => {
    setBreakfastIds((prev) => prev.filter((itemId) => itemId !== id));
    setAvailableIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeFromSupper = (id: string) => {
    setSupperIds((prev) => prev.filter((itemId) => itemId !== id));
    setAvailableIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const addAvailableItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = newItemName.trim();

    if (!trimmedName) {
      setNewItemError("Enter an item name.");
      return;
    }

    const alreadyExists = menuItems.some(
      (item) => item.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (alreadyExists) {
      setNewItemError("That item already exists.");
      return;
    }

    const id = createUniqueItemId(
      trimmedName,
      new Set(menuItems.map((item) => item.id))
    );
    const newItem: MenuItem = {
      id,
      name: trimmedName,
      defaultMeal: newItemDefaultMeal,
    };

    setMenuItems((prev) => [...prev, newItem]);
    setAvailableIds((prev) => [...prev, id]);
    setNewItemName("");
    setNewItemDefaultMeal("Breakfast");
    setNewItemError("");
    setIsAddMealOpen(false);
  };

  const openAddMealForm = () => {
    setIsAddMealOpen(true);
    setNewItemError("");
  };

  const closeAddMealForm = () => {
    setIsAddMealOpen(false);
    setNewItemName("");
    setNewItemDefaultMeal("Breakfast");
    setNewItemError("");
  };

  return (
    <div className="stack">
      <PageHeader
        title="Todays Menu"
        description="Only show what is available today."
      />

      <div className="grid grid-2">
        <section className="panel">
          <div className="card-head">
            <div>
              <h2>Breakfast</h2>
              <div className="muted">{breakfastItems.length} items</div>
            </div>
          </div>
          <div className="data-table">
            <div className="data-row header" style={{ "--cols": menuCols } as React.CSSProperties}>
              <div>Name</div>
              <div>Status</div>
              <div>Action</div>
            </div>
            {breakfastItems.map((item) => (
              <div key={item.id} className="data-row" style={{ "--cols": menuCols } as React.CSSProperties}>
                <div className="item-title">{item.name}</div>
                <div>Available</div>
                <div>
                  <button
                    className="button ghost small"
                    type="button"
                    onClick={() => removeFromBreakfast(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="card-head">
            <div>
              <h2>Supper</h2>
              <div className="muted">{supperItems.length} items</div>
            </div>
          </div>
          <div className="data-table">
            <div className="data-row header" style={{ "--cols": menuCols } as React.CSSProperties}>
              <div>Name</div>
              <div>Status</div>
              <div>Action</div>
            </div>
            {supperItems.map((item) => (
              <div key={item.id} className="data-row" style={{ "--cols": menuCols } as React.CSSProperties}>
                <div className="item-title">{item.name}</div>
                <div>Available</div>
                <div>
                  <button
                    className="button ghost small"
                    type="button"
                    onClick={() => removeFromSupper(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="card-head">
          <div>
            <h2>Available menu items</h2>
            <div className="muted">{availableItems.length} items</div>
          </div>
          {!isAddMealOpen ? (
            <button
              className="button primary small"
              type="button"
              onClick={openAddMealForm}
            >
              Add meal
            </button>
          ) : null}
        </div>
        {isAddMealOpen ? (
          <form className="form-grid" onSubmit={addAvailableItem}>
            <label className="field compact">
              <span>Item name</span>
              <input
                type="text"
                value={newItemName}
                onChange={(event) => setNewItemName(event.target.value)}
                placeholder="Oatmeal cups"
              />
            </label>
            <label className="field compact">
              <span>Default meal</span>
              <select
                value={newItemDefaultMeal}
                onChange={(event) =>
                  setNewItemDefaultMeal(event.target.value as MealLabel)
                }
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Supper">Supper</option>
              </select>
            </label>
            <div className="field compact">
              <span>Action</span>
              <div className="button-row">
                <button className="button primary" type="submit">
                  Add to available
                </button>
                <button
                  className="button ghost"
                  type="button"
                  onClick={closeAddMealForm}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        ) : null}
        {isAddMealOpen && newItemError ? (
          <div className="form-error">{newItemError}</div>
        ) : null}
        <div className="data-table">
          <div className="data-row header" style={{ "--cols": availableCols } as React.CSSProperties}>
            <div>Name</div>
            <div>Default meal</div>
            <div>Add to today</div>
          </div>
          {availableItems.map((item) => (
            <div key={item.id} className="data-row" style={{ "--cols": availableCols } as React.CSSProperties}>
              <div className="item-title">{item.name}</div>
              <div>{item.defaultMeal}</div>
              <div className="button-row">
                <button
                  className="button ghost small"
                  type="button"
                  onClick={() => addToBreakfast(item.id)}
                >
                  Add breakfast
                </button>
                <button
                  className="button ghost small"
                  type="button"
                  onClick={() => addToSupper(item.id)}
                >
                  Add supper
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
