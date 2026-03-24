import { PageHeader } from "../ui/PageHeader";

const breakfastMenu = [
  { name: "Bagels", status: "Available" },
  { name: "Fresh fruit", status: "Available" },
  { name: "Yogurt cups", status: "Available" },
];

const supperMenu = [
  { name: "Chicken chili", status: "Available" },
  { name: "Cornbread", status: "Available" },
  { name: "Green salad", status: "Available" },
];

const availableItems = [
  { name: "Turkey sandwiches", defaultMeal: "Supper" },
  { name: "Granola bars", defaultMeal: "Breakfast" },
  { name: "Milk cartons", defaultMeal: "Breakfast" },
  { name: "Veggie tray", defaultMeal: "Supper" },
  { name: "Apple slices", defaultMeal: "Breakfast" },
  { name: "Juice boxes", defaultMeal: "Breakfast" },
];

export function TodaySetup() {
  const menuCols = "1.6fr 1fr 0.8fr";
  const availableCols = "1.8fr 1fr 1.2fr";

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
              <div className="muted">{breakfastMenu.length} items</div>
            </div>
          </div>
          <div className="data-table">
            <div className="data-row header" style={{ "--cols": menuCols } as React.CSSProperties}>
              <div>Name</div>
              <div>Status</div>
              <div>Action</div>
            </div>
            {breakfastMenu.map((item) => (
              <div key={item.name} className="data-row" style={{ "--cols": menuCols } as React.CSSProperties}>
                <div className="item-title">{item.name}</div>
                <div>{item.status}</div>
                <div>
                  <button className="button ghost small" type="button">
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
              <div className="muted">{supperMenu.length} items</div>
            </div>
          </div>
          <div className="data-table">
            <div className="data-row header" style={{ "--cols": menuCols } as React.CSSProperties}>
              <div>Name</div>
              <div>Status</div>
              <div>Action</div>
            </div>
            {supperMenu.map((item) => (
              <div key={item.name} className="data-row" style={{ "--cols": menuCols } as React.CSSProperties}>
                <div className="item-title">{item.name}</div>
                <div>{item.status}</div>
                <div>
                  <button className="button ghost small" type="button">
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
        </div>
        <div className="data-table">
          <div className="data-row header" style={{ "--cols": availableCols } as React.CSSProperties}>
            <div>Name</div>
            <div>Default meal</div>
            <div>Add to today</div>
          </div>
          {availableItems.map((item) => (
            <div key={item.name} className="data-row" style={{ "--cols": availableCols } as React.CSSProperties}>
              <div className="item-title">{item.name}</div>
              <div>{item.defaultMeal}</div>
              <div className="button-row">
                <button className="button ghost small" type="button">
                  Add breakfast
                </button>
                <button className="button ghost small" type="button">
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
