import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { PageHeader } from "../ui/PageHeader";
import {
  getDonationsForLocation,
  getDonorById,
  getLocationById,
  orderHistoryByLocation,
} from "../data/locations";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "history", label: "History" },
  { id: "donations", label: "Donations" },
] as const;

export function LocationDetail() {
  const { locationId } = useParams();
  const [searchParams] = useSearchParams();
  const location = locationId ? getLocationById(locationId) : null;
  const activeTab =
    tabs.find((tab) => tab.id === searchParams.get("tab"))?.id ?? "overview";
  const [lastAction, setLastAction] = useState<string | null>(null);

  if (!location) {
    return (
      <div className="stack">
        <PageHeader
          title="Location not found"
          description="We couldn't locate that site."
          actions={
            <Link className="button primary" to="/locations">
              Back to locations
            </Link>
          }
        />
      </div>
    );
  }

  const donationRows = getDonationsForLocation(location.id).map((donation) => {
    const donor = getDonorById(donation.donorId);
    return {
      id: donation.id,
      donor: donor?.name ?? "Unknown donor",
      amount: `$${donation.amount.toLocaleString()}`,
      date: donation.date,
    };
  });
  const historyRows = orderHistoryByLocation[location.id] ?? [];
  const historyCols = "1.2fr 1fr 1fr 1fr";
  const donationCols = "1.6fr 1fr 1fr";

  return (
    <div className="stack">
      <PageHeader
        title={location.name}
        description={`${location.address.line1}, ${location.address.city} ${location.address.state}`}
        actions={
          <div className="button-row">
            <Link
              className="button"
              to={`/history?location=${location.id}`}
            >
              Open history
            </Link>
            <Link
              className="button"
              to={`/donations?location=${location.id}`}
            >
              Open donations
            </Link>
            <button
              className="button primary"
              type="button"
              onClick={() => setLastAction("Edit location flow opened (mock)")}
            >
              Edit location
            </button>
          </div>
        }
        meta={
          <div className="meta-row">
            <span className="pill">{location.status}</span>
            <span className="pill subtle">{location.type}</span>
            <span className="pill subtle">
              Weekly participants: {location.weeklyParticipants}
            </span>
            {lastAction ? <span className="pill subtle">{lastAction}</span> : null}
          </div>
        }
      />

      <div className="tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            to={`/locations/${location.id}${
              tab.id === "overview" ? "" : `?tab=${tab.id}`
            }`}
            className={activeTab === tab.id ? "tab active" : "tab"}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {activeTab === "overview" ? (
        <div className="grid grid-3">
          <section className="panel">
            <h2>Primary contact</h2>
            <div className="list">
              <div className="list-item compact">
                <div>
                  <div className="item-title">{location.contact.name}</div>
                  <div className="muted">{location.contact.email}</div>
                </div>
                <div>{location.contact.phone}</div>
              </div>
            </div>
          </section>

          <section className="panel">
            <h2>Operations</h2>
            <div className="list">
              <div className="list-item compact">
                <div className="muted">Delivery window</div>
                <div className="item-title">{location.deliveryWindow}</div>
              </div>
              <div className="list-item compact">
                <div className="muted">Pickup notes</div>
                <div className="item-title">{location.pickupNotes}</div>
              </div>
              <div className="list-item compact">
                <div className="muted">Dietary notes</div>
                <div className="item-title">{location.dietaryNotes}</div>
              </div>
            </div>
          </section>

          <section className="panel">
            <h2>Fundraising</h2>
            <div className="list">
              <div className="list-item compact">
                <div className="muted">Target</div>
                <div className="item-title">
                  ${location.fundraisingTarget.toLocaleString()}
                </div>
              </div>
              <div className="list-item compact">
                <div className="muted">Raised</div>
                <div className="item-title">
                  ${location.fundraisingRaised.toLocaleString()}
                </div>
              </div>
              <div className="list-item compact">
                <div className="muted">Remaining</div>
                <div className="item-title">
                  ${
                    (location.fundraisingTarget - location.fundraisingRaised).toLocaleString()
                  }
                </div>
              </div>
            </div>
          </section>

          <section className="panel">
            <h2>Address</h2>
            <div className="list">
              <div className="list-item compact">
                <div>
                  <div className="item-title">{location.address.line1}</div>
                  {location.address.line2 ? (
                    <div className="muted">{location.address.line2}</div>
                  ) : null}
                  <div className="muted">
                    {location.address.city}, {location.address.state} {location.address.zip}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="panel">
            <h2>Participation</h2>
            <div className="list">
              <div className="list-item compact">
                <div className="muted">Weekly average</div>
                <div className="item-title">{location.weeklyParticipants}</div>
              </div>
              <div className="list-item compact">
                <div className="muted">Season coverage</div>
                <div className="item-title">92% reporting</div>
              </div>
            </div>
          </section>

          <section className="panel">
            <h2>Notes</h2>
            <p className="muted">
              Add delivery constraints, staffing notes, or reminders for this
              location.
            </p>
            <button
              className="button ghost"
              type="button"
              onClick={() => setLastAction("Note editor opened (mock)")}
            >
              Add note
            </button>
          </section>
        </div>
      ) : null}

      {activeTab === "history" ? (
        <div className="stack">
          <section className="panel">
            <div className="card-head">
              <h2>Recent orders</h2>
              <button
                className="button ghost"
                type="button"
                onClick={() => setLastAction("Full order log opened (mock)")}
              >
                View full log
              </button>
            </div>
            <div className="data-table">
              <div className="data-row header" style={{ "--cols": historyCols } as React.CSSProperties}>
                <div>Date</div>
                <div>Breakfast</div>
                <div>Supper</div>
                <div>Status</div>
              </div>
              {historyRows.map((row) => (
                <div key={row.date} className="data-row" style={{ "--cols": historyCols } as React.CSSProperties}>
                  <div>{row.date}</div>
                  <div>{row.breakfast}</div>
                  <div>{row.supper}</div>
                  <div>{row.status}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <h2>Season summary</h2>
            <div className="chart">
              <div className="chart-line" />
              <div className="chart-line" />
              <div className="chart-line" />
              <div className="chart-caption">Orders per week (placeholder)</div>
            </div>
          </section>
        </div>
      ) : null}

      {activeTab === "donations" ? (
        <div className="grid grid-2">
          <section className="panel">
            <div className="card-head">
              <h2>Donation log</h2>
              <button
                className="button ghost"
                type="button"
                onClick={() => setLastAction("Add donation flow opened (mock)")}
              >
                Add donation
              </button>
            </div>
            <div className="data-table">
              <div className="data-row header" style={{ "--cols": donationCols } as React.CSSProperties}>
                <div>Donor</div>
                <div>Amount</div>
                <div>Date</div>
              </div>
              {donationRows.map((row) => (
                <div key={row.id} className="data-row" style={{ "--cols": donationCols } as React.CSSProperties}>
                  <div>{row.donor}</div>
                  <div>{row.amount}</div>
                  <div>{row.date}</div>
                </div>
              ))}
            </div>
          </section>
          <section className="panel">
            <h2>Fundraising snapshot</h2>
            <div className="list">
              <div className="list-item compact">
                <div className="muted">Target</div>
                <div className="item-title">
                  ${location.fundraisingTarget.toLocaleString()}
                </div>
              </div>
              <div className="list-item compact">
                <div className="muted">Raised</div>
                <div className="item-title">
                  ${location.fundraisingRaised.toLocaleString()}
                </div>
              </div>
              <div className="list-item compact">
                <div className="muted">Remaining</div>
                <div className="item-title">
                  ${
                    (location.fundraisingTarget - location.fundraisingRaised).toLocaleString()
                  }
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
