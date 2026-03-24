import type { KeyboardEvent, MouseEvent } from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchLocations, type LocationRecord } from "../data/locations";
import { PageHeader } from "../ui/PageHeader";

export function Locations() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [seasonFilter, setSeasonFilter] = useState("Spring 2026");
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [locations, setLocations] = useState<LocationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    fetchLocations({ search, status: statusFilter })
      .then((items) => {
        if (!isCurrent) return;
        setLocations(items);
      })
      .catch((loadError) => {
        if (!isCurrent) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load locations.",
        );
      })
      .finally(() => {
        if (!isCurrent) return;
        setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [search, statusFilter]);

  const openLocation = (locationId: string) => {
    navigate(`/locations/${locationId}`);
  };

  const locationCols = "1.5fr 0.8fr 0.8fr 1.2fr 1.2fr 0.8fr 1fr 0.7fr";

  const handleRowKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    locationId: string,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLocation(locationId);
    }
  };

  return (
    <div className="stack">
      <PageHeader
        title="Locations"
        description="Search and manage active meal sites. Open a location to view contacts, fundraising, and history."
        actions={
          <div className="button-row">
            <button
              className="button"
              type="button"
              onClick={() => setLastAction("Export prepared")}
            >
              Export
            </button>
            <button
              className="button primary"
              type="button"
              onClick={() => setLastAction("Add location flow opened")}
            >
              Add location
            </button>
          </div>
        }
        meta={
          <>
            <span className="pill subtle">
              Showing {locations.length} locations
            </span>
            {statusFilter !== "All" ? (
              <span className="pill">Status: {statusFilter}</span>
            ) : null}
            {seasonFilter ? (
              <span className="pill subtle">Season: {seasonFilter}</span>
            ) : null}
            {lastAction ? <span className="pill subtle">{lastAction}</span> : null}
          </>
        }
      />

      <div className="toolbar panel">
        <label className="field compact">
          <span>Search</span>
          <input
            type="text"
            placeholder="Search by name or city"
            value={search}
            onChange={(event) => {
              setIsLoading(true);
              setError(null);
              setSearch(event.target.value);
            }}
          />
        </label>
        <label className="field compact">
          <span>Status</span>
          <select
            value={statusFilter}
            onChange={(event) => {
              setIsLoading(true);
              setError(null);
              setStatusFilter(event.target.value);
            }}
          >
            <option>All</option>
            <option>Active</option>
            <option>Seasonal</option>
            <option>Inactive</option>
          </select>
        </label>
        <label className="field compact">
          <span>Season</span>
          <select
            value={seasonFilter}
            onChange={(event) => setSeasonFilter(event.target.value)}
          >
            <option>Spring 2026</option>
            <option>Winter 2025</option>
          </select>
        </label>
        <button
          className="button ghost"
          type="button"
          onClick={() => {
            setIsLoading(true);
            setError(null);
            setSearch("");
            setStatusFilter("All");
            setSeasonFilter("Spring 2026");
            setLastAction("Filters cleared");
          }}
        >
          Clear filters
        </button>
      </div>

      <section className="panel">
        {isLoading ? (
          <div className="muted">Loading locations...</div>
        ) : error ? (
          <div className="form-error">{error}</div>
        ) : locations.length === 0 ? (
          <div className="muted">No locations match the current filters.</div>
        ) : (
          <div className="data-table">
            <div
              className="data-row header"
              style={{ "--cols": locationCols } as React.CSSProperties}
            >
              <div>Location</div>
              <div>Status</div>
              <div>Type</div>
              <div>Managers</div>
              <div>Primary contact</div>
              <div>Weekly participants</div>
              <div>Fundraising</div>
              <div>Action</div>
            </div>
            {locations.map((location) => (
              <div
                key={location.id}
                className="data-row clickable"
                style={{ "--cols": locationCols } as React.CSSProperties}
                role="button"
                tabIndex={0}
                aria-label={`Open ${location.name}`}
                onClick={() => openLocation(location.id)}
                onKeyDown={(event) => handleRowKeyDown(event, location.id)}
              >
                <div>
                  <div className="item-title">{location.name}</div>
                  <div className="muted">
                    {location.address.city}, {location.address.state}
                  </div>
                </div>
                <div>
                  <span className="pill subtle">{location.status}</span>
                </div>
                <div>{location.type}</div>
                <div>
                  <div className="item-title">
                    {location.managers[0]?.name}
                    {location.managers.length > 1
                      ? ` +${location.managers.length - 1}`
                      : ""}
                  </div>
                  <div className="muted">
                    {location.managers.map((manager) => manager.name).join(", ")}
                  </div>
                </div>
                <div>
                  <div>{location.contact.name}</div>
                  <div className="muted">{location.contact.phone}</div>
                </div>
                <div>{location.weeklyParticipants}</div>
                <div>
                  ${location.fundraisingRaised.toLocaleString()} / $
                  {location.fundraisingTarget.toLocaleString()}
                </div>
                <div>
                  <Link
                    className="button ghost"
                    to={`/locations/${location.id}`}
                    onClick={(event: MouseEvent<HTMLAnchorElement>) =>
                      event.stopPropagation()
                    }
                  >
                    Open
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
