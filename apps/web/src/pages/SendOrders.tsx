import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { emailOrders, fetchOrdersToday, lockOrder, type LocationOrder } from "../data/orders";
import { PageHeader } from "../ui/PageHeader";

export function SendOrders() {
  const [searchParams] = useSearchParams();
  const highlightedLocationId = searchParams.get("location");
  const [orders, setOrders] = useState<LocationOrder[]>([]);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    fetchOrdersToday({})
      .then((response) => {
        if (!isCurrent) return;
        setOrders(
          response.items.filter(
            (order) =>
              order.breakfast !== "not_ordered" || order.supper !== "not_ordered",
          ),
        );
      })
      .catch((loadError) => {
        if (!isCurrent) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load staged orders.",
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

  const visibleOrders = useMemo(() => {
    if (!highlightedLocationId) return orders;

    return [...orders].sort((a, b) => {
      if (a.locationId === highlightedLocationId) return -1;
      if (b.locationId === highlightedLocationId) return 1;
      return 0;
    });
  }, [highlightedLocationId, orders]);

  const sentCount = sentIds.size;
  const readyCount = visibleOrders.length - sentCount;
  const highlightedLocationName = highlightedLocationId
    ? orders.find((order) => order.locationId === highlightedLocationId)?.locationName ?? null
    : null;

  const markSent = async (order: LocationOrder) => {
    try {
      await emailOrders([order.locationId]);
      await lockOrder(order.id);
      setSentIds((prev) => new Set(prev).add(order.id));
      setOrders((current) =>
        current.map((row) =>
          row.id === order.id ? { ...row, isLocked: true } : row,
        ),
      );
      setLastAction(`${order.locationName} sent and locked`);
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "Unable to send invoice.",
      );
    }
  };

  const sendAll = async () => {
    try {
      await emailOrders(visibleOrders.map((order) => order.locationId));
      await Promise.all(visibleOrders.map((order) => lockOrder(order.id)));
      setSentIds(new Set(visibleOrders.map((order) => order.id)));
      setOrders((current) => current.map((row) => ({ ...row, isLocked: true })));
      setLastAction(`All ${visibleOrders.length} invoices sent and locked`);
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "Unable to send all invoices.",
      );
    }
  };

  return (
    <div className="stack">
      <PageHeader
        title="Send Orders"
        description="Review each location before sending its separate invoice. This keeps every store's order trackable on its own."
        actions={
          <div className="button-row">
            <button className="button primary" type="button" onClick={() => void sendAll()}>
              Send all and lock
            </button>
            <Link className="button ghost" to="/orders">
              Back to orders
            </Link>
          </div>
        }
        meta={
          <>
            <span className="pill">Ready: {readyCount}</span>
            <span className="pill subtle">Sent: {sentCount}</span>
            {highlightedLocationName ? (
              <span className="pill subtle">Focused: {highlightedLocationName}</span>
            ) : null}
            {lastAction ? <span className="pill subtle">{lastAction}</span> : null}
          </>
        }
      />

      {error ? <div className="form-error">{error}</div> : null}

      <div className="grid grid-3">
        <div className="card stat-card">
          <div className="stat">{visibleOrders.length}</div>
          <div className="muted">Invoices staged</div>
        </div>
        <div className="card stat-card">
          <div className="stat">{readyCount}</div>
          <div className="muted">Still ready to send</div>
        </div>
        <div className="card stat-card">
          <div className="stat">{sentCount}</div>
          <div className="muted">Already sent</div>
        </div>
      </div>

      <section className="stack">
        {isLoading ? (
          <section className="panel">
            <div className="muted">Loading staged orders...</div>
          </section>
        ) : (
          visibleOrders.map((order) => {
            const isSent = sentIds.has(order.id);
            return (
              <section
                key={order.id}
                className={isSent ? "panel order-card sent" : "panel order-card"}
              >
                <div className="card-head">
                  <div>
                    <h2>{order.locationName}</h2>
                    <div className="muted">
                      Manager: {order.managerName} | {order.managerPhone}
                    </div>
                  </div>
                  <div className="button-row">
                    <span className={isSent ? "pill success" : "pill warning"}>
                      {isSent ? "Sent" : "Ready"}
                    </span>
                    <button
                      className="button primary"
                      type="button"
                      onClick={() => {
                        void markSent(order);
                      }}
                      disabled={isSent}
                    >
                      {isSent ? "Sent" : "Send invoice"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-2">
                  <div className="list">
                    <div className="list-item compact">
                      <div className="muted">Breakfast status</div>
                      <div className="item-title">{order.breakfast}</div>
                    </div>
                    <div className="list-item compact">
                      <div className="muted">Supper status</div>
                      <div className="item-title">{order.supper}</div>
                    </div>
                  </div>
                  <div className="list">
                    <div className="list-item compact">
                      <div className="muted">Last update</div>
                      <div className="item-title">{order.updatedAt}</div>
                    </div>
                    <div className="list-item compact">
                      <div className="muted">Note</div>
                      <div className="item-title">{order.note}</div>
                    </div>
                  </div>
                </div>

                <div className="data-table order-lines">
                  <div
                    className="data-row header"
                    style={{ "--cols": "0.9fr 1.6fr 0.8fr 0.7fr" } as React.CSSProperties}
                  >
                    <div>Meal</div>
                    <div>Item</div>
                    <div>Unit</div>
                    <div>Qty</div>
                  </div>
                  {order.lines.map((line) => (
                    <div
                      key={`${order.id}-${line.meal}-${line.item}`}
                      className="data-row"
                      style={{ "--cols": "0.9fr 1.6fr 0.8fr 0.7fr" } as React.CSSProperties}
                    >
                      <div className="muted">{line.meal}</div>
                      <div className="item-title">{line.item}</div>
                      <div>{line.unit}</div>
                      <div>{line.quantity}</div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })
        )}
      </section>
    </div>
  );
}
