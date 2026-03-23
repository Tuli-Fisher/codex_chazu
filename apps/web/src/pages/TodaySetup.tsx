import { PageHeader } from "../ui/PageHeader";

const mealSections = [
  {
    title: "Breakfast",
    items: [
      { name: "Bagels", unit: "dozen", pack: "12" },
      { name: "Fresh fruit", unit: "trays", pack: "1" },
      { name: "Yogurt cups", unit: "cases", pack: "24" },
    ],
  },
  {
    title: "Supper",
    items: [
      { name: "Chicken chili", unit: "pans", pack: "1" },
      { name: "Cornbread", unit: "loaves", pack: "8" },
      { name: "Green salad", unit: "bags", pack: "6" },
    ],
  },
];

const basics = [
  "Milk cartons",
  "Turkey sandwiches",
  "Granola bars",
  "Veggie tray",
  "Apple slices",
  "Juice boxes",
];

export function TodaySetup() {
  return (
    <div className="stack">
      <PageHeader
        title="Today Setup"
        description="Build the daily menu for breakfast and supper. Items here drive all location orders."
        actions={
          <div className="button-row">
            <button className="button">Apply basic template</button>
            <button className="button primary">Save menu</button>
          </div>
        }
        meta={
          <div className="meta-row">
            <span className="pill">Date: Mar 23, 2026</span>
            <span className="pill subtle">Lock time: 4:30 PM</span>
          </div>
        }
      />

      <div className="grid grid-2 stagger">
        {mealSections.map((meal, index) => (
          <section
            key={meal.title}
            className="card"
            style={{ "--i": index } as React.CSSProperties}
          >
            <div className="card-head">
              <h2>{meal.title}</h2>
              <button className="button ghost" type="button">
                Add item
              </button>
            </div>
            <div className="list">
              {meal.items.map((item) => (
                <div key={item.name} className="list-item">
                  <div>
                    <div className="item-title">{item.name}</div>
                    <div className="muted">
                      Unit: {item.unit} · Pack size: {item.pack}
                    </div>
                  </div>
                  <button className="chip" type="button">
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="card">
        <div className="card-head">
          <h2>Basic templates</h2>
          <button className="button ghost" type="button">
            Manage templates
          </button>
        </div>
        <div className="pill-row">
          {basics.map((item) => (
            <span key={item} className="pill">
              {item}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

