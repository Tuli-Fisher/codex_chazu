import { PageHeader } from "../ui/PageHeader";
import { useSearchParams } from "react-router-dom";
import { getLocationById } from "../data/locations";

export function History() {
  const [searchParams] = useSearchParams();
  const locationId = searchParams.get("location");
  const location = locationId ? getLocationById(locationId) : null;

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

      <section className="card">
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
            <span>Group by</span>
            <select defaultValue="item">
              <option value="item">Item</option>
              <option value="location">Location</option>
              <option value="date">Date</option>
            </select>
          </label>
        </div>
        <div className="chart">
          <div className="chart-line" />
          <div className="chart-line" />
          <div className="chart-line" />
          <div className="chart-caption">Totals per week (placeholder)</div>
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h2>Highlights</h2>
        </div>
        <div className="grid grid-3">
          <div className="mini">
            <div className="stat">2,840</div>
            <div className="muted">Meals served this season</div>
          </div>
          <div className="mini">
            <div className="stat">$18,430</div>
            <div className="muted">Fundraising to date</div>
          </div>
          <div className="mini">
            <div className="stat">92%</div>
            <div className="muted">On-time submissions</div>
          </div>
        </div>
      </section>
    </div>
  );
}
