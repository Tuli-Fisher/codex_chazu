import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../ui/PageHeader";

type MealStatus = "submitted" | "missing" | "late" | "not_ordered";

type LocationSubmission = {
  id: string;
  name: string;
  contact: string;
  updatedAt: string;
  breakfast: MealStatus;
  lunch: MealStatus;
  note: string;
};

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

const submissions: LocationSubmission[] = [
  {
    id: "riverside",
    name: "Riverside Community Center",
    contact: "Taylor Lee",
    updatedAt: "1:10 PM",
    breakfast: "submitted",
    lunch: "submitted",
    note: "On time",
  },
  {
    id: "northside-ms",
    name: "Northside Middle School",
    contact: "Jordan Smith",
    updatedAt: "12:48 PM",
    breakfast: "submitted",
    lunch: "missing",
    note: "Supper pending",
  },
  {
    id: "oak-hill",
    name: "Oak Hill Library",
    contact: "Riley Patel",
    updatedAt: "1:34 PM",
    breakfast: "missing",
    lunch: "late",
    note: "Late supper order",
  },
  {
    id: "southridge",
    name: "Southridge Family Hub",
    contact: "Morgan Price",
    updatedAt: "-",
    breakfast: "not_ordered",
    lunch: "missing",
    note: "Supper not received",
  },
  {
    id: "eastfield",
    name: "Eastfield Elementary",
    contact: "Casey Tran",
    updatedAt: "11:52 AM",
    breakfast: "submitted",
    lunch: "not_ordered",
    note: "Supper not scheduled",
  },
];

const statusMeta: Record<MealStatus, { label: string; tone: string }> = {
  submitted: { label: "Submitted", tone: "success" },
  late: { label: "Late", tone: "warning" },
  missing: { label: "Missing", tone: "danger" },
  not_ordered: { label: "Not ordered", tone: "subtle" },
};

function statusPill(status: MealStatus) {
  const meta = statusMeta[status];
  return <span className={`pill ${meta.tone}`}>{meta.label}</span>;
}

export function OrdersToday() {
  const perLocationCols = "2fr 1fr 1fr 1fr 1.2fr 1.5fr";
  const [missingOnly, setMissingOnly] = useState(false);
  const [remindedIds, setRemindedIds] = useState<Set<string>>(new Set());
  const [lockedIds, setLockedIds] = useState<Set<string>>(new Set());
  const [lastAction, setLastAction] = useState<string | null>(null);

  const breakfastSubmitted = submissions.filter(
    (row) => row.breakfast === "submitted" || row.breakfast === "late",
  ).length;
  const lunchSubmitted = submissions.filter(
    (row) => row.lunch === "submitted" || row.lunch === "late",
  ).length;
  const missingEither = submissions.filter(
    (row) => row.breakfast === "missing" || row.lunch === "missing",
  ).length;
  const lateCount = submissions.filter(
    (row) => row.breakfast === "late" || row.lunch === "late",
  ).length;

  const filteredSubmissions = missingOnly
    ? submissions.filter(
        (row) => row.breakfast === "missing" || row.lunch === "missing",
      )
    : submissions;

  const markReminded = (ids: string[], summary: string) => {
    setRemindedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
    setLastAction(summary);
  };

  const toggleLock = (id: string, name: string) => {
    setLockedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setLastAction(`${name} unlocked`);
      } else {
        next.add(id);
        setLastAction(`${name} locked`);
      }
      return next;
    });
  };

  const lockAll = () => {
    setLockedIds(new Set(submissions.map((row) => row.id)));
    setLastAction("All locations locked for today");
  };

  const exportMessage = (label: string) => {
    setLastAction(`${label} export prepared (mock)`);
  };

  return (
    <div className="stack">
      <PageHeader
        title="Orders Today"
        description="Breakfast and supper orders are collected separately. Each location can submit one or both."
        actions={
          <div className="button-row">
            <button className="button" type="button" onClick={() => exportMessage("Breakfast totals")}>
              Export breakfast
            </button>
            <button className="button" type="button" onClick={() => exportMessage("Supper totals")}>
              Export supper
            </button>
            <button className="button" type="button" onClick={() => exportMessage("Per-location orders")}>
              Export by location
            </button>
            <button className="button primary" type="button" onClick={lockAll}>
              Send and lock
            </button>
          </div>
        }
        meta={
          <div className="meta-row">
            <span className="pill">Breakfast: {breakfastSubmitted} submitted</span>
            <span className="pill">Supper: {lunchSubmitted} submitted</span>
            <span className="pill warning">{missingEither} missing</span>
            <span className="pill warning">{lateCount} late</span>
            {missingOnly ? (
              <span className="pill subtle">Showing missing only</span>
            ) : null}
            {lastAction ? <span className="pill subtle">{lastAction}</span> : null}
          </div>
        }
      />

      <div className="grid grid-4 stagger">
        <div className="card stat-card" style={{ "--i": 0 } as React.CSSProperties}>
          <div className="stat">{submissions.length}</div>
          <div className="muted">Active locations</div>
        </div>
        <div className="card stat-card" style={{ "--i": 1 } as React.CSSProperties}>
          <div className="stat">{breakfastSubmitted}</div>
          <div className="muted">Breakfast submitted</div>
        </div>
        <div className="card stat-card" style={{ "--i": 2 } as React.CSSProperties}>
          <div className="stat">{lunchSubmitted}</div>
          <div className="muted">Supper submitted</div>
        </div>
        <div className="card stat-card" style={{ "--i": 3 } as React.CSSProperties}>
          <div className="stat">{missingEither}</div>
          <div className="muted">Missing follow-ups</div>
        </div>
      </div>

      <section className="panel">
          <div className="card-head">
            <div>
              <h2>Per-location submissions</h2>
              <div className="muted">
                Breakfast cutoff 7:15 AM | Supper cutoff 11:00 AM
              </div>
            </div>
            <div className="button-row">
              <button
                className="button ghost"
                type="button"
                onClick={() =>
                  setMissingOnly((prev) => {
                    const next = !prev;
                    setLastAction(next ? "Filtered to missing orders" : "Showing all submissions");
                    return next;
                  })
                }
              >
                {missingOnly ? "Show all" : "Show missing only"}
              </button>
              <button
                className="button ghost"
                type="button"
                onClick={() => {
                  const needingReminder = submissions.filter(
                    (row) =>
                      row.breakfast === "missing" ||
                      row.breakfast === "late" ||
                      row.lunch === "missing" ||
                      row.lunch === "late",
                  );
                  markReminded(
                    needingReminder.map((row) => row.id),
                    `Reminders sent to ${needingReminder.length} locations`,
                  );
                }}
              >
                Send reminders
              </button>
            </div>
          </div>
          <div className="data-table">
            <div className="data-row header" style={{ "--cols": perLocationCols } as React.CSSProperties}>
              <div>Location</div>
              <div>Breakfast</div>
              <div>Supper</div>
              <div>Last update</div>
              <div>Contact</div>
              <div>Actions</div>
            </div>
            {filteredSubmissions.map((row) => {
              const reminded = remindedIds.has(row.id);
              const isLocked = lockedIds.has(row.id);
              return (
                <div key={row.id} className="data-row" style={{ "--cols": perLocationCols } as React.CSSProperties}>
                  <div>
                    <div className="item-title">{row.name}</div>
                    <div className="muted">{row.note}</div>
                    {isLocked ? (
                      <div className="pill-row">
                        <span className="pill subtle">Locked</span>
                      </div>
                    ) : null}
                  </div>
                  <div>{statusPill(row.breakfast)}</div>
                  <div>{statusPill(row.lunch)}</div>
                  <div>{row.updatedAt}</div>
                  <div className="muted">{row.contact}</div>
                  <div className="button-row">
                    <Link className="button ghost small" to={`/locations/${row.id}?tab=history`}>
                      View
                    </Link>
                    <button
                      className="button ghost small"
                      type="button"
                      onClick={() => markReminded([row.id], `Reminder sent to ${row.name}`)}
                      disabled={reminded}
                    >
                      {reminded ? "Reminder sent" : "Reminder"}
                    </button>
                    <button
                      className="button ghost small"
                      type="button"
                      onClick={() => toggleLock(row.id, row.name)}
                    >
                      {isLocked ? "Unlock" : "Lock"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

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
            <h2>Supper totals</h2>
            <button className="button ghost" type="button">
              View supper by location
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
    </div>
  );
}
