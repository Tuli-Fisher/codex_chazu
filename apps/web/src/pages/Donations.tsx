import { useMemo, useState } from "react";
import { createSearchParams, Link, useSearchParams } from "react-router-dom";
import { PageHeader } from "../ui/PageHeader";
import {
  donations,
  donors,
  getLocationById,
  getDonorById,
  locations,
} from "../data/locations";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function Donations() {
  const [searchParams] = useSearchParams();
  const locationId = searchParams.get("location");
  const activeTab = searchParams.get("tab") ?? "donors";
  const location = locationId ? getLocationById(locationId) : null;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const donationRows = useMemo(() => {
    const filtered = locationId
      ? donations.filter((donation) => donation.locationId === locationId)
      : donations;

    return filtered.map((donation) => {
      const donor = getDonorById(donation.donorId);
      const donationLocation = donation.locationId
        ? getLocationById(donation.locationId)
        : null;
      return {
        id: donation.id,
        donor: donor?.name ?? "Unknown donor",
        email: donor?.email ?? "",
        location: donationLocation?.name ?? "General Fund",
        amount: currency.format(donation.amount),
        date: formatDate(donation.date),
        method: donation.method,
        note: donation.note ?? "No note",
      };
    });
  }, [locationId]);

  const donorRows = useMemo(() => {
    return donors
      .map((donor) => {
        const donorDonations = donations.filter(
          (donation) => donation.donorId === donor.id,
        );
        const total = donorDonations.reduce(
          (sum, donation) => sum + donation.amount,
          0,
        );
        const lastGift = donorDonations
          .map((donation) => donation.date)
          .sort()
          .at(-1);
        return {
          id: donor.id,
          name: donor.name,
          email: donor.email,
          total: currency.format(total),
          gifts: donorDonations.length,
          lastGift: lastGift ? formatDate(lastGift) : "N/A",
        };
      })
      .sort((a, b) => (a.total < b.total ? 1 : -1));
  }, []);

  const donorCols = "1.4fr 1.6fr 0.9fr 0.9fr";
  const donationCols = "1.4fr 1.5fr 0.9fr 0.9fr 0.8fr 0.6fr";

  const tabLink = (tab: string) =>
    `?${createSearchParams({
      location: locationId ?? "",
      tab,
    }).toString()}`;

  return (
    <div className="stack">
      <PageHeader
        title="Donations"
        description="All locations report into one central donor table. Track pledges and apply filters as needed."
        actions={
          <div className="button-row">
            <button className="button">Export</button>
            <button className="button primary">Add donation</button>
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

      <div className="tabs">
        <Link
          className={activeTab === "donors" ? "tab active" : "tab"}
          to={tabLink("donors")}
        >
          Donors
        </Link>
        <Link
          className={activeTab === "log" ? "tab active" : "tab"}
          to={tabLink("log")}
        >
          Donation log
        </Link>
      </div>

      <div className="toolbar panel">
        <label className="field compact">
          <span>Search donor</span>
          <input type="text" placeholder="Name or email" />
        </label>
        <label className="field compact">
          <span>Location</span>
          <select defaultValue={location ? location.name : "All locations"}>
            <option>All locations</option>
            {locations.map((site) => (
              <option key={site.id}>{site.name}</option>
            ))}
            <option>General Fund</option>
          </select>
        </label>
        <label className="field compact">
          <span>Date range</span>
          <input type="text" placeholder="Mar 1 - Apr 30" />
        </label>
        <button className="button ghost" type="button">
          Clear filters
        </button>
      </div>

      {activeTab === "donors" ? (
        <section className="panel">
          <div className="card-head">
            <h2>Central donors</h2>
            <span className="pill subtle">{donorRows.length} donors</span>
          </div>
          <div className="data-table">
            <div className="data-row header" style={{ "--cols": donorCols } as React.CSSProperties}>
              <div>Donor</div>
              <div>Email</div>
              <div>Total</div>
              <div>Last gift</div>
            </div>
            {donorRows.map((row) => (
              <div key={row.id} className="data-row" style={{ "--cols": donorCols } as React.CSSProperties}>
                <div>
                  <div className="item-title">{row.name}</div>
                  <div className="muted">{row.gifts} gifts</div>
                </div>
                <div className="muted">{row.email}</div>
                <div>{row.total}</div>
                <div>{row.lastGift}</div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === "log" ? (
        <section className="panel">
          <div className="card-head">
            <h2>Donation log</h2>
            <span className="pill subtle">{donationRows.length} records</span>
          </div>
          <div className="data-table">
            <div className="data-row header" style={{ "--cols": donationCols } as React.CSSProperties}>
              <div>Donor</div>
              <div>Location</div>
              <div>Amount</div>
              <div>Date</div>
              <div>Method</div>
              <div></div>
            </div>
            {donationRows.map((row) => {
              const isExpanded = expandedId === row.id;
              return (
                <div key={row.id}>
                  <div className="data-row" style={{ "--cols": donationCols } as React.CSSProperties}>
                    <div>{row.donor}</div>
                    <div className="muted">{row.location}</div>
                    <div>{row.amount}</div>
                    <div>{row.date}</div>
                    <div className="muted">{row.method}</div>
                    <div>
                      <button
                        className="button ghost small"
                        type="button"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : row.id)
                        }
                      >
                        {isExpanded ? "Hide" : "Details"}
                      </button>
                    </div>
                  </div>
                  {isExpanded ? (
                    <div
                      className="data-row detail"
                      style={{ "--cols": "1fr" } as React.CSSProperties}
                    >
                      <div>
                        <strong>Donor email:</strong> {row.email || "Not provided"}
                        <span className="detail-spacer" />
                        <strong>Note:</strong> {row.note}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
