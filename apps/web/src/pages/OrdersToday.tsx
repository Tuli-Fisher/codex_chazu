import { PageHeader } from "../ui/PageHeader";

const totals = [
  { item: "Bagels", meal: "Breakfast", total: "96" },
  { item: "Yogurt cups", meal: "Breakfast", total: "180" },
  { item: "Chicken chili", meal: "Supper", total: "42" },
  { item: "Cornbread", meal: "Supper", total: "38" },
];

const locationRows = [
  {
    name: "Riverside Community Center",
    status: "Submitted",
    updatedAt: "1:10 PM",
    late: false,
  },
  {
    name: "Northside Middle School",
    status: "Missing",
    updatedAt: "—",
    late: false,
  },
  {
    name: "Oak Hill Library",
    status: "Submitted",
    updatedAt: "1:34 PM",
    late: true,
  },
];

export function OrdersToday() {
  return (
    <div className="stack">
      <PageHeader
        title="Orders Today"
        description="Track submissions, review totals, and email orders per location."
        actions={
          <div className="button-row">
            <button className="button">Export aggregate</button>
            <button className="button">Export by location</button>
            <button className="button primary">Email per location</button>
          </div>
        }
        meta={
          <div className="meta-row">
            <span className="pill">10 of 14 locations submitted</span>
            <span className="pill warning">3 missing</span>
            <span className="pill subtle">1 late</span>
          </div>
        }
      />

      <div className="grid grid-3">
        <div className="card stat-card">
          <div className="stat">14</div>
          <div className="muted">Active locations</div>
        </div>
        <div className="card stat-card">
          <div className="stat">10</div>
          <div className="muted">Submitted today</div>
        </div>
        <div className="card stat-card">
          <div className="stat">4</div>
          <div className="muted">Need follow-up</div>
        </div>
      </div>

      <section className="card">
        <div className="card-head">
          <h2>Aggregate totals</h2>
          <div className="button-row">
            <button className="chip" type="button">
              Breakfast
            </button>
            <button className="chip" type="button">
              Supper
            </button>
          </div>
        </div>
        <div className="table">
          <div className="table-row table-head">
            <div>Item</div>
            <div>Meal</div>
            <div>Total</div>
          </div>
          {totals.map((row) => (
            <div key={row.item} className="table-row">
              <div>{row.item}</div>
              <div className="muted">{row.meal}</div>
              <div>{row.total}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h2>Location submissions</h2>
          <button className="button ghost" type="button">
            Lock all
          </button>
        </div>
        <div className="table">
          <div className="table-row table-head four">
            <div>Location</div>
            <div>Status</div>
            <div>Last update</div>
            <div>Actions</div>
          </div>
          {locationRows.map((row) => (
            <div key={row.name} className="table-row four">
              <div>{row.name}</div>
              <div className={row.late ? "pill warning" : "pill subtle"}>
                {row.status}
              </div>
              <div className="muted">{row.updatedAt}</div>
              <div className="button-row">
                <button className="button" type="button">
                  Email
                </button>
                <button className="button ghost" type="button">
                  Lock
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}



