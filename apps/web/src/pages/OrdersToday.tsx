import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  emailOrders,
  exportOrders,
  fetchOrdersToday,
  fetchTodayAggregateTotals,
  lockAllOrders,
  lockOrder,
  sendOrderReminders,
  unlockOrder,
  type AggregateRow,
  type LocationOrder,
} from "../data/orders";
import { PageHeader } from "../ui/PageHeader";

type ManagerPopup = {
  name: string;
  phone: string;
  locationName: string;
} | null;

const statusMeta: Record<LocationOrder["breakfast"], { label: string; tone: string }> = {
  submitted: { label: "Submitted", tone: "success" },
  late: { label: "Late", tone: "warning" },
  missing: { label: "Missing", tone: "danger" },
  not_ordered: { label: "Not ordered", tone: "subtle" },
};

function statusPill(status: LocationOrder["breakfast"]) {
  const meta = statusMeta[status];
  return <span className={`pill ${meta.tone}`}>{meta.label}</span>;
}

export function OrdersToday() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const focusedLocationId = searchParams.get("location");
  const [missingOnly, setMissingOnly] = useState(false);
  const [selectedManager, setSelectedManager] = useState<ManagerPopup>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [orders, setOrders] = useState<LocationOrder[]>([]);
  const [totals, setTotals] = useState<AggregateRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    Promise.all([
      fetchOrdersToday({
        locationId: focusedLocationId,
        missingOnly,
      }),
      fetchTodayAggregateTotals(),
    ])
      .then(([ordersResponse, totalsResponse]) => {
        if (!isCurrent) return;
        setOrders(ordersResponse.items);
        setTotals(totalsResponse);
      })
      .catch((loadError) => {
        if (!isCurrent) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load todays orders.",
        );
      })
      .finally(() => {
        if (!isCurrent) return;
        setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [focusedLocationId, missingOnly]);

  useEffect(() => {
    if (!selectedManager) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedManager(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedManager]);

  const breakfastTotals = useMemo(
    () => totals.filter((row) => row.meal === "Breakfast"),
    [totals],
  );
  const supperTotals = useMemo(
    () => totals.filter((row) => row.meal === "Supper"),
    [totals],
  );
  const focusedLocationName = focusedLocationId
    ? orders.find((order) => order.locationId === focusedLocationId)?.locationName ?? null
    : null;
  const breakfastSubmitted = orders.filter(
    (row) => row.breakfast === "submitted" || row.breakfast === "late",
  ).length;
  const supperSubmitted = orders.filter(
    (row) => row.supper === "submitted" || row.supper === "late",
  ).length;
  const missingEither = orders.filter(
    (row) => row.breakfast === "missing" || row.supper === "missing",
  ).length;
  const lateCount = orders.filter(
    (row) => row.breakfast === "late" || row.supper === "late",
  ).length;

  const toggleLock = async (order: LocationOrder) => {
    try {
      if (order.isLocked) {
        await unlockOrder(order.id);
      } else {
        await lockOrder(order.id);
      }

      setOrders((current) =>
        current.map((row) =>
          row.id === order.id ? { ...row, isLocked: !row.isLocked } : row,
        ),
      );
      setLastAction(`${order.locationName} ${order.isLocked ? "unlocked" : "locked"}`);
    } catch (actionError) {
      setError(
        actionError instanceof Error ? actionError.message : "Unable to update lock state.",
      );
    }
  };

  const lockAll = async () => {
    try {
      await lockAllOrders();
      setOrders((current) => current.map((row) => ({ ...row, isLocked: true })));
      setLastAction("All locations locked for today");
    } catch (actionError) {
      setError(
        actionError instanceof Error ? actionError.message : "Unable to lock all orders.",
      );
    }
  };

  const sendReminders = async (locationIds?: string[], label?: string) => {
    try {
      const response = await sendOrderReminders(locationIds);
      setLastAction(label ?? `Reminders sent to ${response.sent} locations`);
    } catch (actionError) {
      setError(
        actionError instanceof Error ? actionError.message : "Unable to send reminders.",
      );
    }
  };

  const runExport = async (label: string, format: "csv" | "pdf" = "csv") => {
    try {
      await exportOrders(format);
      setLastAction(`${label} export prepared`);
    } catch (actionError) {
      setError(
        actionError instanceof Error ? actionError.message : "Unable to export orders.",
      );
    }
  };

  const reviewAndSend = () => {
    navigate("/orders/send");
  };

  const clearFocus = () => {
    navigate("/orders", { replace: true });
  };

  const sendInvoiceBatch = async () => {
    try {
      const response = await emailOrders();
      setLastAction(`Prepared ${response.sent} location emails`);
    } catch (actionError) {
      setError(
        actionError instanceof Error ? actionError.message : "Unable to queue emails.",
      );
    }
  };

  return (
    <div className="stack">
      <PageHeader
        title="Orders Today"
        description="Breakfast and supper orders are collected separately. Each location can submit one or both."
        actions={
          <div className="button-row">
            <button
              className="button"
              type="button"
              onClick={() => {
                void runExport("Breakfast totals");
              }}
            >
              Export breakfast
            </button>
            <button
              className="button"
              type="button"
              onClick={() => {
                void runExport("Supper totals");
              }}
            >
              Export supper
            </button>
            <button
              className="button"
              type="button"
              onClick={() => {
                void sendInvoiceBatch();
              }}
            >
              Export by location
            </button>
            <button className="button primary" type="button" onClick={reviewAndSend}>
              Review and send
            </button>
          </div>
        }
        meta={
          <>
            <span className="pill">Breakfast: {breakfastSubmitted} submitted</span>
            <span className="pill">Supper: {supperSubmitted} submitted</span>
            <span className="pill warning">{missingEither} missing</span>
            <span className="pill warning">{lateCount} late</span>
            {focusedLocationName ? (
              <span className="pill subtle">Focused: {focusedLocationName}</span>
            ) : null}
            {lastAction ? <span className="pill subtle">{lastAction}</span> : null}
          </>
        }
      />

      {error ? <div className="form-error">{error}</div> : null}

      <div className="grid grid-4 stagger">
        <div className="card stat-card" style={{ "--i": 0 } as React.CSSProperties}>
          <div className="stat">{orders.length}</div>
          <div className="muted">Active locations</div>
        </div>
        <div className="card stat-card" style={{ "--i": 1 } as React.CSSProperties}>
          <div className="stat">{breakfastSubmitted}</div>
          <div className="muted">Breakfast submitted</div>
        </div>
        <div className="card stat-card" style={{ "--i": 2 } as React.CSSProperties}>
          <div className="stat">{supperSubmitted}</div>
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
            {focusedLocationName ? (
              <button className="button ghost" type="button" onClick={clearFocus}>
                Show all locations
              </button>
            ) : null}
            <button
              className="button ghost"
              type="button"
              onClick={() => {
                setIsLoading(true);
                setError(null);
                setMissingOnly((current) => !current);
              }}
            >
              {missingOnly ? "Show all" : "Show missing only"}
            </button>
            <button
              className="button ghost"
              type="button"
              onClick={() => {
                void sendReminders();
              }}
            >
              Send reminders
            </button>
            <button className="button ghost" type="button" onClick={() => void lockAll()}>
              Lock all
            </button>
          </div>
        </div>
        {isLoading ? (
          <div className="muted">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="muted">No orders match the current filters.</div>
        ) : (
          <div className="data-table">
            <div
              className="data-row header"
              style={{ "--cols": "2fr 1fr 1fr 1fr 1.2fr 1.2fr 1.4fr" } as React.CSSProperties}
            >
              <div>Location</div>
              <div>Breakfast</div>
              <div>Supper</div>
              <div>Last update</div>
              <div>Manager</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            {orders.map((row) => (
              <div
                key={row.id}
                className="data-row"
                style={{ "--cols": "2fr 1fr 1fr 1fr 1.2fr 1.2fr 1.4fr" } as React.CSSProperties}
              >
                <div>
                  <Link
                    className="item-title inline-link"
                    to={`/locations/${row.locationId}?tab=overview`}
                  >
                    {row.locationName}
                  </Link>
                  <div className="muted">{row.note}</div>
                  {row.isLocked ? (
                    <div className="pill-row">
                      <span className="pill subtle">Locked</span>
                    </div>
                  ) : null}
                </div>
                <div>{statusPill(row.breakfast)}</div>
                <div>{statusPill(row.supper)}</div>
                <div>{row.updatedAt}</div>
                <div>
                  <button
                    className="text-button"
                    type="button"
                    onClick={() =>
                      setSelectedManager({
                        name: row.managerName,
                        phone: row.managerPhone,
                        locationName: row.locationName,
                      })
                    }
                  >
                    {row.managerName}
                  </button>
                  <div className="muted">Tap for number</div>
                </div>
                <div>
                  {row.breakfast === "missing" || row.supper === "missing" ? (
                    <span className="pill danger">Needs follow-up</span>
                  ) : (
                    <span className="pill success">Ready</span>
                  )}
                </div>
                <div className="button-row">
                  <Link className="button ghost small" to={`/locations/${row.locationId}?tab=overview`}>
                    View
                  </Link>
                  <button
                    className="button ghost small"
                    type="button"
                    onClick={() => {
                      void sendReminders([row.locationId], `Reminder sent to ${row.locationName}`);
                    }}
                  >
                    Reminder
                  </button>
                  <button
                    className="button ghost small"
                    type="button"
                    onClick={() => {
                      void toggleLock(row);
                    }}
                  >
                    {row.isLocked ? "Unlock" : "Lock"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="grid grid-2">
        <section className="card">
          <div className="card-head">
            <h2>Breakfast totals</h2>
            <button
              className="button ghost"
              type="button"
              onClick={() => {
                void runExport("Breakfast by location");
              }}
            >
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
              <div key={`${row.item}-${row.unit}`} className="table-row">
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
            <button
              className="button ghost"
              type="button"
              onClick={() => {
                void runExport("Supper by location");
              }}
            >
              View supper by location
            </button>
          </div>
          <div className="table">
            <div className="table-row table-head">
              <div>Item</div>
              <div>Unit</div>
              <div>Total</div>
            </div>
            {supperTotals.map((row) => (
              <div key={`${row.item}-${row.unit}`} className="table-row">
                <div>{row.item}</div>
                <div className="muted">{row.unit}</div>
                <div>{row.total}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {selectedManager ? (
        <div
          className="modal-backdrop"
          aria-label="Close manager details"
          role="presentation"
          onClick={() => setSelectedManager(null)}
        >
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="manager-details-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="card-head">
              <div>
                <h2 id="manager-details-title">{selectedManager.locationName}</h2>
                <div className="muted">Manager contact</div>
              </div>
              <button
                className="button ghost small"
                type="button"
                onClick={() => setSelectedManager(null)}
              >
                Close
              </button>
            </div>
            <div className="list">
              <div className="list-item compact">
                <div className="muted">Name</div>
                <div className="item-title">{selectedManager.name}</div>
              </div>
              <div className="list-item compact">
                <div className="muted">Phone</div>
                <div className="item-title">{selectedManager.phone}</div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
