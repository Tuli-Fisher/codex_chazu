import { useEffect, useMemo, useState } from "react";
import {
  addTodayMenuItem,
  createMenuBasic,
  fetchMenuBasics,
  fetchTodayMenu,
  removeTodayMenuItem,
  type MealLabel,
  type MenuBasic,
  type TodayMenu,
} from "../data/menu";
import { PageHeader } from "../ui/PageHeader";

export function TodaySetup() {
  const [menuBasics, setMenuBasics] = useState<MenuBasic[]>([]);
  const [todayMenu, setTodayMenu] = useState<TodayMenu | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDefaultMeal, setNewItemDefaultMeal] = useState<MealLabel>("Breakfast");
  const [newItemError, setNewItemError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    Promise.all([fetchTodayMenu(), fetchMenuBasics()])
      .then(([menu, basics]) => {
        if (!isCurrent) return;
        setTodayMenu(menu);
        setMenuBasics(basics);
      })
      .catch((loadError) => {
        if (!isCurrent) return;
        setError(
          loadError instanceof Error ? loadError.message : "Unable to load menu data.",
        );
      })
      .finally(() => {
        if (!isCurrent) return;
        setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const breakfastItems = useMemo(
    () => todayMenu?.items.filter((item) => item.mealType === "breakfast") ?? [],
    [todayMenu],
  );
  const supperItems = useMemo(
    () => todayMenu?.items.filter((item) => item.mealType === "supper") ?? [],
    [todayMenu],
  );
  const selectedBasicIds = new Set(
    todayMenu?.items.map((item) => item.basicId).filter(Boolean) ?? [],
  );
  const availableItems = menuBasics.filter((item) => !selectedBasicIds.has(item.id));
  const menuCols = "1.6fr 1fr 0.8fr";
  const availableCols = "1.8fr 1fr 1.2fr";

  const addToMeal = async (basic: MenuBasic, mealType: "breakfast" | "supper") => {
    if (!todayMenu) return;

    setError(null);

    try {
      const item = await addTodayMenuItem(todayMenu.id, {
        basicId: basic.id,
        name: basic.name,
        mealType,
        unit: basic.defaultUnit,
      });

      setTodayMenu((current) =>
        current
          ? {
              ...current,
              items: [...current.items, item],
            }
          : current,
      );
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "Unable to add menu item.",
      );
    }
  };

  const removeFromMeal = async (itemId: string) => {
    if (!todayMenu) return;

    setError(null);

    try {
      await removeTodayMenuItem(todayMenu.id, itemId);
      setTodayMenu((current) =>
        current
          ? {
              ...current,
              items: current.items.filter((item) => item.id !== itemId),
            }
          : current,
      );
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "Unable to remove menu item.",
      );
    }
  };

  const addAvailableItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = newItemName.trim();

    if (!trimmedName) {
      setNewItemError("Enter an item name.");
      return;
    }

    const alreadyExists = menuBasics.some(
      (item) => item.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (alreadyExists) {
      setNewItemError("That item already exists.");
      return;
    }

    try {
      const item = await createMenuBasic({
        name: trimmedName,
        defaultUnit: "unit",
        defaultMeal: newItemDefaultMeal,
      });

      setMenuBasics((current) => [...current, item]);
      setNewItemName("");
      setNewItemDefaultMeal("Breakfast");
      setNewItemError("");
      setIsAddMealOpen(false);
    } catch (createError) {
      setNewItemError(
        createError instanceof Error
          ? createError.message
          : "Unable to add menu basic.",
      );
    }
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

      {error ? <div className="form-error">{error}</div> : null}

      <div className="grid grid-2">
        <section className="panel">
          <div className="card-head">
            <div>
              <h2>Breakfast</h2>
              <div className="muted">{breakfastItems.length} items</div>
            </div>
          </div>
          {isLoading ? (
            <div className="muted">Loading breakfast items...</div>
          ) : (
            <div className="data-table">
              <div
                className="data-row header"
                style={{ "--cols": menuCols } as React.CSSProperties}
              >
                <div>Name</div>
                <div>Status</div>
                <div>Action</div>
              </div>
              {breakfastItems.map((item) => (
                <div
                  key={item.id}
                  className="data-row"
                  style={{ "--cols": menuCols } as React.CSSProperties}
                >
                  <div className="item-title">{item.name}</div>
                  <div>Available</div>
                  <div>
                    <button
                      className="button ghost small"
                      type="button"
                      onClick={() => {
                        void removeFromMeal(item.id);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel">
          <div className="card-head">
            <div>
              <h2>Supper</h2>
              <div className="muted">{supperItems.length} items</div>
            </div>
          </div>
          {isLoading ? (
            <div className="muted">Loading supper items...</div>
          ) : (
            <div className="data-table">
              <div
                className="data-row header"
                style={{ "--cols": menuCols } as React.CSSProperties}
              >
                <div>Name</div>
                <div>Status</div>
                <div>Action</div>
              </div>
              {supperItems.map((item) => (
                <div
                  key={item.id}
                  className="data-row"
                  style={{ "--cols": menuCols } as React.CSSProperties}
                >
                  <div className="item-title">{item.name}</div>
                  <div>Available</div>
                  <div>
                    <button
                      className="button ghost small"
                      type="button"
                      onClick={() => {
                        void removeFromMeal(item.id);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
        {isLoading ? (
          <div className="muted">Loading available menu items...</div>
        ) : availableItems.length === 0 ? (
          <div className="muted">All available items are already on today's menu.</div>
        ) : (
          <div className="data-table">
            <div
              className="data-row header"
              style={{ "--cols": availableCols } as React.CSSProperties}
            >
              <div>Name</div>
              <div>Default meal</div>
              <div>Add to today</div>
            </div>
            {availableItems.map((item) => (
              <div
                key={item.id}
                className="data-row"
                style={{ "--cols": availableCols } as React.CSSProperties}
              >
                <div className="item-title">{item.name}</div>
                <div>{item.defaultMeal}</div>
                <div className="button-row">
                  <button
                    className="button ghost small"
                    type="button"
                    onClick={() => {
                      void addToMeal(item, "breakfast");
                    }}
                  >
                    Add breakfast
                  </button>
                  <button
                    className="button ghost small"
                    type="button"
                    onClick={() => {
                      void addToMeal(item, "supper");
                    }}
                  >
                    Add supper
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
