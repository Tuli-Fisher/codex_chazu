import { useState } from "react";
import { PageHeader } from "../ui/PageHeader";
import { useSearchParams } from "react-router-dom";
import { getLocationById } from "../data/locations";

type DrilldownTab = "items" | "locations" | "dates";

const itemRows = [
  { item: "Bagels", meal: "Breakfast", total: "620", avg: "44", trend: "+4%" },
  { item: "Yogurt cups", meal: "Breakfast", total: "480", avg: "34", trend: "+2%" },
  { item: "Chicken chili", meal: "Lunch", total: "310", avg: "22", trend: "-3%" },
  { item: "Green salad", meal: "Lunch", total: "260", avg: "18", trend: "+1%" },
];

const locationRows = [
  {
    location: "Riverside Community Center",
    breakfast: "280",
    lunch: "190",
    onTime: "96%",
    lastOrder: "Mar 22",
  },
  {
    location: "Northside Middle School",
    breakfast: "340",
    lunch: "270",
    onTime: "92%",
    lastOrder: "Mar 22",
  },
  {
    location: "Oak Hill Library",
    breakfast: "140",
    lunch: "110",
    onTime: "88%",
    lastOrder: "Mar 19",
  },
];

const dateRows = [
  {
    date: "Mar 22",
    breakfast: "420",
    lunch: "310",
    submissions: "12/14",
    late: "1",
  },
  {
    date: "Mar 21",
    breakfast: "398",
    lunch: "298",
    submissions: "14/14",
    late: "0",
  },
  {
    date: "Mar 20",
    breakfast: "402",
    lunch: "285",
    submissions: "13/14",
    late: "2",
  },
];

export function History() {
  const [searchParams] = useSearchParams();
  const locationId = searchParams.get("location");
  const location = locationId ? getLocationById(locationId) : null;
  const [tab, setTab] = useState<DrilldownTab>("items");

  return (
    <div className="stack">
      <PageHeader
        title="History"
        description="Review totals across seasons, locations, and dates."
        actions={
          <div className="button-row">
            <button className="button">Export report</button>
            <button className="button ghost">Compare seasons</button>
          </div>
        }
        meta={
          location ? (
            <div className="meta-row">
              <span className="pill">Filtered: {location.name}</span>
            </div>
          ) : undefined
        }
      />

      <div className="grid" style={{ gridTemplateColumns: "2fr 1fr" }}>
        <section className="panel">
          <div className="card-head">
            <h2>Filters</h2>
          </div>
          <div className="filter-row">
            <label className="field compact">
              <span>Season</span>
              <select defaultValue="Spring 2026">
                <option>Spring 2026</option>
                <option>Winter 2025</option>
                <option>Fall 2025</option>
              </select>
            </label>
            <label className="field compact">
              <span>Date range</span>
              <input type="text" placeholder="Mar 1 - May 31" />
            </label>
            <label className="field compact">
              <span>Meal</span>
              <select defaultValue="All">
                <option>All</option>
                <option>Breakfast</option>
                <option>Lunch</option>
              </select>
            </label>
          </div>
          <div className="filter-row" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <label className="field compact">
              <span>Location</span>
              <input
                type="text"
                placeholder={location ? location.name : "Search locations"}
              />
            </label>
            <label className="field compact">
              <span>Group by</span>
              <select defaultValue="item">
                <option value="item">Item</option>
                <option value="location">Location</option>
                <option value="date">Date</option>
              </select>
            </label>
            <label className="field compact">
              <span>Include late</span>
              <select defaultValue="Yes">
                <option>Yes</option>
                <option>No</option>
              </select>
            </label>
          </div>
        </section>

        <section className="panel">
          <div className="card-head">
            <h2>Season summary</h2>
          </div>
          <div className="list">
            <div className="list-item compact">
              <div className="muted">Meals served</div>
              <div className="item-title">2,840</div>
            </div>
            <div className="list-item compact">
              <div className="muted">On-time submissions</div>
              <div className="item-title">92%</div>
            </div>
            <div className="list-item compact">
              <div className="muted">Fundraising</div>
              <div className="item-title">$18,430</div>
            </div>
          </div>
          <div className="chart" style={{ minHeight: "140px" }}>
            <div className="chart-line" />
            <div className="chart-line" />
            <div className="chart-line" />
            <div className="chart-caption">Totals per week (placeholder)</div>
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="card-head">
          <div>
            <h2>Drilldowns</h2>
            <div className="muted">Switch views to inspect trends.</div>
          </div>
          <div className="tabs">
            <button
              className={tab === "items" ? "tab active" : "tab"}
              type="button"
              onClick={() => setTab("items")}
            >
              By item
            </button>
            <button
              className={tab === "locations" ? "tab active" : "tab"}
              type="button"
              onClick={() => setTab("locations")}
            >
              By location
            </button>
            <button
              className={tab === "dates" ? "tab active" : "tab"}
              type="button"
              onClick={() => setTab("dates")}
            >
              By date
            </button>
          </div>
        </div>

        {tab === "items" ? (
          <div className="data-table">
            <div className="data-row header" style={{ "--cols": "1.6fr 1fr 0.8fr 0.8fr 0.8fr" } as React.CSSProperties}>
              <div>Item</div>
              <div>Meal</div>
              <div>Total</div>
              <div>Avg/day</div>
              <div>Trend</div>
            </div>
            {itemRows.map((row) => (
              <div key={row.item} className="data-row" style={{ "--cols": "1.6fr 1fr 0.8fr 0.8fr 0.8fr" } as React.CSSProperties}>
                <div className="item-title">{row.item}</div>
                <div className="muted">{row.meal}</div>
                <div>{row.total}</div>
                <div>{row.avg}</div>
                <div className="muted">{row.trend}</div>
              </div>
            ))}
          </div>
        ) : null}

        {tab === "locations" ? (
          <div className="data-table">
            <div className="data-row header" style={{ "--cols": "1.8fr 1fr 1fr 0.9fr 0.9fr" } as React.CSSProperties}>
              <div>Location</div>
              <div>Breakfast</div>
              <div>Lunch</div>
              <div>On-time</div>
              <div>Last order</div>
            </div>
            {locationRows.map((row) => (
              <div key={row.location} className="data-row" style={{ "--cols": "1.8fr 1fr 1fr 0.9fr 0.9fr" } as React.CSSProperties}>
                <div className="item-title">{row.location}</div>
                <div>{row.breakfast}</div>
                <div>{row.lunch}</div>
                <div className="muted">{row.onTime}</div>
                <div>{row.lastOrder}</div>
              </div>
            ))}
          </div>
        ) : null}

        {tab === "dates" ? (
          <div className="data-table">
            <div className="data-row header" style={{ "--cols": "1.2fr 1fr 1fr 1fr 0.7fr" } as React.CSSProperties}>
              <div>Date</div>
              <div>Breakfast</div>
              <div>Lunch</div>
              <div>Submissions</div>
              <div>Late</div>
            </div>
            {dateRows.map((row) => (
              <div key={row.date} className="data-row" style={{ "--cols": "1.2fr 1fr 1fr 1fr 0.7fr" } as React.CSSProperties}>
                <div className="item-title">{row.date}</div>
                <div>{row.breakfast}</div>
                <div>{row.lunch}</div>
                <div>{row.submissions}</div>
                <div className="muted">{row.late}</div>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
