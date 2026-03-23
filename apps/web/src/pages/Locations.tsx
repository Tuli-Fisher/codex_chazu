import { PageHeader } from "../ui/PageHeader";

const locations = [
  {
    name: "Riverside Community Center",
    status: "Active",
    contact: "Taylor Lee",
    phone: "(555) 212-8871",
  },
  {
    name: "Northside Middle School",
    status: "Active",
    contact: "Jordan Smith",
    phone: "(555) 220-4459",
  },
  {
    name: "Oak Hill Library",
    status: "Seasonal",
    contact: "Riley Patel",
    phone: "(555) 310-9022",
  },
];

export function Locations() {
  return (
    <div className="stack">
      <PageHeader
        title="Locations"
        description="Directory of active meal sites, contacts, and participation snapshots."
        actions={
          <div className="button-row">
            <button className="button">Filter</button>
            <button className="button primary">Add location</button>
          </div>
        }
      />

      <div className="grid grid-3 stagger">
        {locations.map((location, index) => (
          <section
            key={location.name}
            className="card"
            style={{ "--i": index } as React.CSSProperties}
          >
            <div className="card-head">
              <h2>{location.name}</h2>
              <span className="pill subtle">{location.status}</span>
            </div>
            <div className="list">
              <div className="list-item compact">
                <div>
                  <div className="muted">Primary contact</div>
                  <div className="item-title">{location.contact}</div>
                </div>
              </div>
              <div className="list-item compact">
                <div>
                  <div className="muted">Phone</div>
                  <div className="item-title">{location.phone}</div>
                </div>
              </div>
              <div className="list-item compact">
                <div>
                  <div className="muted">Weekly participants</div>
                  <div className="item-title">310 avg</div>
                </div>
              </div>
            </div>
            <button className="button ghost" type="button">
              View location
            </button>
          </section>
        ))}
      </div>
    </div>
  );
}
