import { PageHeader } from "../ui/PageHeader";

const breakfastTotals = [
  { item: "Bagels", unit: "dozen", total: "96" },
  { item: "Yogurt cups", unit: "cases", total: "180" },
  { item: "Fresh fruit", unit: "trays", total: "28" },
];

const lunchTotals = [
  { item: "Chicken chili", unit: "pans", total: "42" },
  { item: "Cornbread", unit: "loaves", total: "38" },
  { item: "Green salad", unit: "bags", total: "26" },
];

export function OrdersToday() {
  const missingCols = "2fr 1fr 1fr 1fr 1fr";

  return (
    <div className="stack">
      <PageHeader
        title="Orders Today"
        description="Breakfast and lunch orders are collected separately. Each location can submit one or both."
        actions={
          <div className="button-row">
            <button className="button">Export breakfast</button>
            <button className="button">Export lunch</button>
            <button className="button primary">Send and lock</button>
          </div>
        }
        meta={
          <div className="meta-row">
            <span className="pill">Breakfast: 9 of 14 submitted</span>
            <span className="pill">Lunch: 7 of 14 submitted</span>
            <span className="pill warning">3 missing (either meal)</span>
          </div>
        }
      />

      <div className="grid grid-3 stagger">
        <div className="card stat-card" style={{ "--i": 0 } as React.CSSProperties}>
          <div className="stat">14</div>
          <div className="muted">Active locations</div>
        </div>
        <div className="card stat-card" style={{ "--i": 1 } as React.CSSProperties}>
          <div className="stat">9</div>
          <div className="muted">Breakfast submitted</div>
        </div>
        <div className="card stat-card" style={{ "--i": 2 } as React.CSSProperties}>
          <div className="stat">7</div>
          <div className="muted">Lunch submitted</div>
        </div>
      </div>

      <div className="grid grid-2">
        <section className="card">
          <div className="card-head">
            <h2>Breakfast totals</h2>
            <button className="button ghost" type="button">
              View breakfast by location
            </button>
          </div>
          <div className="table">
            <div className="table-row table-head">
              <div>Item</div>
              <div>Unit</div>
              <div>Total</div>
            </div>
            {breakfastTotals.map((row) => (
              <div key={row.item} className="table-row">
                <div>{row.item}</div>
                <div className="muted">{row.unit}</div>
                <div>{row.total}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="card-head">
            <h2>Lunch totals</h2>
            <button className="button ghost" type="button">
              View lunch by location
            </button>
          </div>
          <div className="table">
            <div className="table-row table-head">
              <div>Item</div>
              <div>Unit</div>
              <div>Total</div>
            </div>
            {lunchTotals.map((row) => (
              <div key={row.item} className="table-row">
                <div>{row.item}</div>
                <div className="muted">{row.unit}</div>
                <div>{row.total}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="card">
        <div className="card-head">
          <h2>Missing submissions</h2>
          <button className="button ghost" type="button">
            Send reminder
          </button>
        </div>
        <div className="data-table">
          <div className="data-row header" style={{ "--cols": missingCols } as React.CSSProperties}>
            <div>Location</div>
            <div>Breakfast</div>
            <div>Lunch</div>
            <div>Last update</div>
            <div>Status</div>
          </div>
          <div className="data-row" style={{ "--cols": missingCols } as React.CSSProperties}>
            <div>Oak Hill Library</div>
            <div className="muted">Missing</div>
            <div className="muted">Submitted</div>
            <div>1 hr ago</div>
            <div>Late</div>
          </div>
          <div className="data-row" style={{ "--cols": missingCols } as React.CSSProperties}>
            <div>Southridge Family Hub</div>
            <div className="muted">Submitted</div>
            <div className="muted">Missing</div>
            <div>35 min ago</div>
            <div>Open</div>
          </div>
        </div>
      </section>
    </div>
  );
}
