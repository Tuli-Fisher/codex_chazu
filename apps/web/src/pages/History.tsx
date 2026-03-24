import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  fetchHistory,
  type DrilldownTab,
  type HistoryDateRow,
  type HistoryItemRow,
  type HistoryLocationRow,
  type HistorySummary,
  type MealFilter,
} from "../data/history";
import { fetchLocationById, type LocationRecord } from "../data/locations";
import { PageHeader } from "../ui/PageHeader";

export function History() {
  const [searchParams, setSearchParams] = useSearchParams();
  const locationId = searchParams.get("location");
  const tab = (searchParams.get("group_by") as DrilldownTab | null) ?? "items";
  const season = searchParams.get("season") ?? "Spring 2026";
  const mealFilter = (searchParams.get("meal") as MealFilter | null) ?? "All";
  const locationSearch = searchParams.get("q") ?? "";
  const includeLate = searchParams.get("include_late") ?? "Yes";
  const [dateRange, setDateRange] = useState(searchParams.get("date_range") ?? "");
  const [location, setLocation] = useState<LocationRecord | null>(null);
  const [summary, setSummary] = useState<HistorySummary | null>(null);
  const [itemRows, setItemRows] = useState<HistoryItemRow[]>([]);
  const [locationRows, setLocationRows] = useState<HistoryLocationRow[]>([]);
  const [dateRows, setDateRows] = useState<HistoryDateRow[]>([]);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!locationId) return;

    let isCurrent = true;

    fetchLocationById(locationId)
      .then((item) => {
        if (!isCurrent) return;
        setLocation(item);
      })
      .catch(() => {
        if (!isCurrent) return;
        setLocation(null);
      });

    return () => {
      isCurrent = false;
    };
  }, [locationId]);

  useEffect(() => {
    let isCurrent = true;

    fetchHistory(tab, {
      meal: mealFilter,
      locationSearch: locationId ?? locationSearch,
      includeLate: includeLate !== "No",
    })
      .then((response) => {
        if (!isCurrent) return;
        setSummary(response.summary);
        setItemRows(tab === "items" ? (response.items as HistoryItemRow[]) : []);
        setLocationRows(
          tab === "locations" ? (response.items as HistoryLocationRow[]) : [],
        );
        setDateRows(tab === "dates" ? (response.items as HistoryDateRow[]) : []);
      })
      .catch((loadError) => {
        if (!isCurrent) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load history.",
        );
      })
      .finally(() => {
        if (!isCurrent) return;
        setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [includeLate, locationId, locationSearch, mealFilter, tab]);

  const updateFilters = (updates: Record<string, string>) => {
    const next = new URLSearchParams(searchParams);

    setIsLoading(true);
    setError(null);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
    });

    setSearchParams(next, { replace: true });
  };

  return (
    <div className="stack">
      <PageHeader
        title="History"
        description="Review totals across seasons, locations, and dates."
        actions={
          <div className="button-row">
            <button
              className="button"
              type="button"
              onClick={() => setLastAction("History export prepared")}
            >
              Export report
            </button>
            <button
              className="button ghost"
              type="button"
              onClick={() => setLastAction("Season comparison opened")}
            >
              Compare seasons
            </button>
          </div>
        }
        meta={
          <>
            {locationId && location ? <span className="pill">Filtered: {location.name}</span> : null}
            {season ? <span className="pill subtle">Season: {season}</span> : null}
            {lastAction ? <span className="pill subtle">{lastAction}</span> : null}
          </>
        }
      />

      {error ? <div className="form-error">{error}</div> : null}

      <div className="grid" style={{ gridTemplateColumns: "2fr 1fr" }}>
        <section className="panel">
          <div className="card-head">
            <h2>Filters</h2>
          </div>
          <div className="filter-row">
            <label className="field compact">
              <span>Season</span>
              <select
                value={season}
                onChange={(event) => updateFilters({ season: event.target.value })}
              >
                <option>Spring 2026</option>
                <option>Winter 2025</option>
              </select>
            </label>
            <label className="field compact">
              <span>Date range</span>
              <input
                type="text"
                placeholder="Mar 1 - May 31"
                value={dateRange}
                onChange={(event) => {
                  setDateRange(event.target.value);
                  updateFilters({ date_range: event.target.value });
                }}
              />
            </label>
            <label className="field compact">
              <span>Meal</span>
              <select
                value={mealFilter}
                onChange={(event) => updateFilters({ meal: event.target.value })}
              >
                <option>All</option>
                <option>Breakfast</option>
                <option>Supper</option>
              </select>
            </label>
          </div>
          <div
            className="filter-row"
            style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
          >
            <label className="field compact">
              <span>Location</span>
              <input
                type="text"
                placeholder="Search locations"
                value={locationSearch}
                onChange={(event) => updateFilters({ q: event.target.value })}
              />
            </label>
            <label className="field compact">
              <span>Group by</span>
              <select
                value={tab}
                onChange={(event) => updateFilters({ group_by: event.target.value })}
              >
                <option value="items">Item</option>
                <option value="locations">Location</option>
                <option value="dates">Date</option>
              </select>
            </label>
            <label className="field compact">
              <span>Include late</span>
              <select
                value={includeLate}
                onChange={(event) => updateFilters({ include_late: event.target.value })}
              >
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
              <div className="item-title">{summary?.mealsServed.toLocaleString() ?? "-"}</div>
            </div>
            <div className="list-item compact">
              <div className="muted">On-time submissions</div>
              <div className="item-title">{summary?.onTimeSubmissions ?? "-"}</div>
            </div>
            <div className="list-item compact">
              <div className="muted">Fundraising</div>
              <div className="item-title">
                {summary ? `$${summary.fundraising.toLocaleString()}` : "-"}
              </div>
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
              onClick={() => updateFilters({ group_by: "items" })}
            >
              By item
            </button>
            <button
              className={tab === "locations" ? "tab active" : "tab"}
              type="button"
              onClick={() => updateFilters({ group_by: "locations" })}
            >
              By location
            </button>
            <button
              className={tab === "dates" ? "tab active" : "tab"}
              type="button"
              onClick={() => updateFilters({ group_by: "dates" })}
            >
              By date
            </button>
          </div>
        </div>

        {isLoading ? <div className="muted">Loading history...</div> : null}

        {!isLoading && tab === "items" ? (
          <div className="data-table">
            <div
              className="data-row header"
              style={{ "--cols": "1.6fr 1fr 0.8fr 0.8fr 0.8fr" } as React.CSSProperties}
            >
              <div>Item</div>
              <div>Meal</div>
              <div>Total</div>
              <div>Avg/day</div>
              <div>Trend</div>
            </div>
            {itemRows.map((row) => (
              <div
                key={row.item}
                className="data-row"
                style={{ "--cols": "1.6fr 1fr 0.8fr 0.8fr 0.8fr" } as React.CSSProperties}
              >
                <div className="item-title">{row.item}</div>
                <div className="muted">{row.meal}</div>
                <div>{row.total}</div>
                <div>{row.avg}</div>
                <div className="muted">{row.trend}</div>
              </div>
            ))}
          </div>
        ) : null}

        {!isLoading && tab === "locations" ? (
          <div className="data-table">
            <div
              className="data-row header"
              style={{ "--cols": "1.8fr 1fr 1fr 0.9fr 0.9fr" } as React.CSSProperties}
            >
              <div>Location</div>
              <div>Breakfast</div>
              <div>Supper</div>
              <div>On-time</div>
              <div>Last order</div>
            </div>
            {locationRows.map((row) => (
              <div
                key={row.location}
                className="data-row"
                style={{ "--cols": "1.8fr 1fr 1fr 0.9fr 0.9fr" } as React.CSSProperties}
              >
                <div className="item-title">{row.location}</div>
                <div>{row.breakfast}</div>
                <div>{row.supper}</div>
                <div className="muted">{row.onTime}</div>
                <div>{row.lastOrder}</div>
              </div>
            ))}
          </div>
        ) : null}

        {!isLoading && tab === "dates" ? (
          <div className="data-table">
            <div
              className="data-row header"
              style={{ "--cols": "1.2fr 1fr 1fr 1fr 0.7fr" } as React.CSSProperties}
            >
              <div>Date</div>
              <div>Breakfast</div>
              <div>Supper</div>
              <div>Submissions</div>
              <div>Late</div>
            </div>
            {dateRows.map((row) => (
              <div
                key={row.date}
                className="data-row"
                style={{ "--cols": "1.2fr 1fr 1fr 1fr 0.7fr" } as React.CSSProperties}
              >
                <div className="item-title">{row.date}</div>
                <div>{row.breakfast}</div>
                <div>{row.supper}</div>
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
