import { PageHeader } from "../ui/PageHeader";
import { useSearchParams } from "react-router-dom";
import { getLocationById } from "../data/locations";

const donations = [
  { donor: "Lydia Ross", amount: "$250", date: "Mar 20" },
  { donor: "Darren Cook", amount: "$100", date: "Mar 18" },
  { donor: "K. Patel", amount: "$500", date: "Mar 12" },
];

export function Donations() {
  const [searchParams] = useSearchParams();
  const locationId = searchParams.get("location");
  const location = locationId ? getLocationById(locationId) : null;

  return (
    <div className="stack">
      <PageHeader
        title="Donations"
        description="Log pledges and track fundraising support by season or location."
        actions={<button className="button primary">Add donation</button>}
        meta={
          location ? (
            <div className="meta-row">
              <span className="pill">Filtered: {location.name}</span>
            </div>
          ) : undefined
        }
      />

      <div className="grid grid-2">
        <section className="card">
          <div className="card-head">
            <h2>Log a donation</h2>
          </div>
          <form className="form">
            <label className="field">
              <span>Donor name</span>
              <input type="text" placeholder="Full name" />
            </label>
            <label className="field">
              <span>Amount</span>
              <input type="text" placeholder="$0.00" />
            </label>
            <label className="field">
              <span>Location (optional)</span>
              <select defaultValue="General">
                <option>General Fund</option>
                <option>Riverside Community Center</option>
                <option>Northside Middle School</option>
              </select>
            </label>
            <label className="field">
              <span>Note</span>
              <textarea rows={3} placeholder="Optional note" />
            </label>
            <button className="button primary" type="button">
              Save donation
            </button>
          </form>
        </section>

        <section className="card">
          <div className="card-head">
            <h2>Recent donations</h2>
          </div>
          <div className="list">
            {donations.map((donation) => (
              <div key={donation.donor} className="list-item">
                <div>
                  <div className="item-title">{donation.donor}</div>
                  <div className="muted">{donation.date}</div>
                </div>
                <div className="pill">{donation.amount}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
