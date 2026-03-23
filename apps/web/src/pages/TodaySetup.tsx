import { PageHeader } from "../ui/PageHeader";

const breakfastItems = [
  {
    name: "Bagels",
    unit: "dozen",
    pack: "12",
    cutoff: "7:15 AM",
    notes: "Plain + everything",
  },
  {
    name: "Fresh fruit",
    unit: "trays",
    pack: "1",
    cutoff: "7:15 AM",
    notes: "Seasonal mix",
  },
  {
    name: "Yogurt cups",
    unit: "cases",
    pack: "24",
    cutoff: "7:15 AM",
    notes: "Low sugar",
  },
];

const lunchItems = [
  {
    name: "Chicken chili",
    unit: "pans",
    pack: "1",
    cutoff: "11:00 AM",
    notes: "Mild",
  },
  {
    name: "Cornbread",
    unit: "loaves",
    pack: "8",
    cutoff: "11:00 AM",
    notes: "Butter on side",
  },
  {
    name: "Green salad",
    unit: "bags",
    pack: "6",
    cutoff: "11:00 AM",
    notes: "No tomatoes",
  },
];

const basicsLibrary = [
  { name: "Milk cartons", unit: "cases", pack: "24" },
  { name: "Turkey sandwiches", unit: "trays", pack: "12" },
  { name: "Granola bars", unit: "cases", pack: "48" },
  { name: "Veggie tray", unit: "trays", pack: "1" },
  { name: "Apple slices", unit: "bags", pack: "10" },
  { name: "Juice boxes", unit: "cases", pack: "40" },
];

export function TodaySetup() {
  const menuCols = "1.7fr 0.8fr 0.8fr 0.9fr 1.2fr 0.7fr";
  const basicsCols = "1.6fr 0.9fr 0.9fr 1fr";

  return (
    <div className="stack">
      <PageHeader
        title="Today Setup"
        description="Build the daily menu for breakfast and lunch. Items here drive all location orders."
        actions={
          <div className="button-row">
            <button className="button">Apply basic template</button>
            <button className="button primary">Save menu</button>
          </div>
        }
        meta={
          <div className="meta-row">
            <span className="pill">Date: Mar 23, 2026</span>
            <span className="pill subtle">Default lock time: 4:30 PM</span>
            <span className="pill subtle">Last saved: 2:05 PM</span>
          </div>
        }
      />

      <div className="grid" style={{ gridTemplateColumns: "2fr 1fr" }}>
        <div className="stack">
          <section className="panel">
            <div className="card-head">
              <div>
                <h2>Breakfast menu</h2>
                <div className="muted">{breakfastItems.length} items</div>
              </div>
              <div className="button-row">
                <button className="button ghost" type="button">
                  Add item
                </button>
                <button className="button ghost" type="button">
                  Apply basics
                </button>
              </div>
            </div>
            <div className="data-table">
              <div className="data-row header" style={{ "--cols": menuCols } as React.CSSProperties}>
                <div>Item</div>
                <div>Unit</div>
                <div>Pack</div>
                <div>Cutoff</div>
                <div>Notes</div>
                <div>Action</div>
              </div>
              {breakfastItems.map((item) => (
                <div key={item.name} className="data-row" style={{ "--cols": menuCols } as React.CSSProperties}>
                  <div className="item-title">{item.name}</div>
                  <div className="muted">{item.unit}</div>
                  <div>{item.pack}</div>
                  <div>{item.cutoff}</div>
                  <div className="muted">{item.notes}</div>
                  <div>
                    <button className="button ghost small" type="button">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="card-head">
              <div>
                <h2>Lunch menu</h2>
                <div className="muted">{lunchItems.length} items</div>
              </div>
              <div className="button-row">
                <button className="button ghost" type="button">
                  Add item
                </button>
                <button className="button ghost" type="button">
                  Apply basics
                </button>
              </div>
            </div>
            <div className="data-table">
              <div className="data-row header" style={{ "--cols": menuCols } as React.CSSProperties}>
                <div>Item</div>
                <div>Unit</div>
                <div>Pack</div>
                <div>Cutoff</div>
                <div>Notes</div>
                <div>Action</div>
              </div>
              {lunchItems.map((item) => (
                <div key={item.name} className="data-row" style={{ "--cols": menuCols } as React.CSSProperties}>
                  <div className="item-title">{item.name}</div>
                  <div className="muted">{item.unit}</div>
                  <div>{item.pack}</div>
                  <div>{item.cutoff}</div>
                  <div className="muted">{item.notes}</div>
                  <div>
                    <button className="button ghost small" type="button">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="stack">
          <section className="panel">
            <div className="card-head">
              <h2>Basics library</h2>
              <button className="button ghost" type="button">
                Manage basics
              </button>
            </div>
            <label className="field compact">
              <span>Search basics</span>
              <input type="text" placeholder="Search by item" />
            </label>
            <div className="data-table">
              <div className="data-row header" style={{ "--cols": basicsCols } as React.CSSProperties}>
                <div>Item</div>
                <div>Unit</div>
                <div>Pack</div>
                <div>Add</div>
              </div>
              {basicsLibrary.map((item) => (
                <div key={item.name} className="data-row" style={{ "--cols": basicsCols } as React.CSSProperties}>
                  <div>{item.name}</div>
                  <div className="muted">{item.unit}</div>
                  <div>{item.pack}</div>
                  <div className="button-row">
                    <button className="button ghost small" type="button">
                      Breakfast
                    </button>
                    <button className="button ghost small" type="button">
                      Lunch
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="card-head">
              <h2>Order timing</h2>
            </div>
            <div className="form">
              <label className="field">
                <span>Default lock time</span>
                <input type="time" defaultValue="16:30" />
              </label>
              <label className="field">
                <span>Breakfast cutoff</span>
                <input type="time" defaultValue="07:15" />
              </label>
              <label className="field">
                <span>Lunch cutoff</span>
                <input type="time" defaultValue="11:00" />
              </label>
              <button className="button primary" type="button">
                Update timing
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
