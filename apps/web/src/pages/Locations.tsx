import type { KeyboardEvent, MouseEvent } from "react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "../ui/PageHeader";
import { locations } from "../data/locations";

export function Locations() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [seasonFilter, setSeasonFilter] = useState("Spring 2026");
  const [lastAction, setLastAction] = useState<string | null>(null);

  const filteredLocations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return locations.filter((location) => {
      const matchesSearch =
        !normalizedSearch ||
        location.name.toLowerCase().includes(normalizedSearch) ||
        location.address.city.toLowerCase().includes(normalizedSearch);
      const matchesStatus =
        statusFilter === "All" || location.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const openLocation = (locationId: string) => {
    navigate(`/locations/${locationId}`);
  };

  const handleRowKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    locationId: string
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
            <button className="button" type="button" onClick={() => setLastAction("Export prepared (mock)")}>
              Export
            </button>
            <button className="button primary" type="button" onClick={() => setLastAction("Add location flow opened (mock)")}>
              Add location
            </button>
          </div>
        }
        meta={
          <>
            <span className="pill subtle">
              Showing {filteredLocations.length} of {locations.length}
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
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <label className="field compact">
          <span>Status</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
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
            <option>Fall 2025</option>
          </select>
        </label>
        <button
          className="button ghost"
          type="button"
          onClick={() => {
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
        <div className="data-table">
          <div className="data-row header">
            <div>Location</div>
            <div>Status</div>
            <div>Type</div>
            <div>Primary contact</div>
            <div>Weekly participants</div>
            <div>Fundraising</div>
            <div>Action</div>
          </div>
          {filteredLocations.map((location) => (
            <div
              key={location.id}
              className="data-row clickable"
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
      </section>
    </div>
  );
}
