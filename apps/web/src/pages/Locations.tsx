import type { KeyboardEvent, MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "../ui/PageHeader";
import { locations } from "../data/locations";

export function Locations() {
  const navigate = useNavigate();

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
            <button className="button">Export</button>
            <button className="button primary">Add location</button>
          </div>
        }
      />

      <div className="toolbar panel">
        <label className="field compact">
          <span>Search</span>
          <input type="text" placeholder="Search by name or city" />
        </label>
        <label className="field compact">
          <span>Status</span>
          <select defaultValue="All">
            <option>All</option>
            <option>Active</option>
            <option>Seasonal</option>
            <option>Inactive</option>
          </select>
        </label>
        <label className="field compact">
          <span>Season</span>
          <select defaultValue="Spring 2026">
            <option>Spring 2026</option>
            <option>Winter 2025</option>
            <option>Fall 2025</option>
          </select>
        </label>
        <button className="button ghost" type="button">
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
          {locations.map((location) => (
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
