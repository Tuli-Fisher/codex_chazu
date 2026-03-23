import { PageHeader } from "../ui/PageHeader";

export function Settings() {
  return (
    <div className="stack">
      <PageHeader
        title="Admin Settings"
        description="Control defaults for menus, lock times, and notifications."
      />

      <section className="card">
        <div className="card-head">
          <h2>Order lock defaults</h2>
        </div>
        <div className="form-grid">
          <label className="field">
            <span>Default lock time</span>
            <input type="time" defaultValue="16:30" />
          </label>
          <label className="field">
            <span>Timezone</span>
            <input type="text" defaultValue="America/New_York" />
          </label>
          <label className="field">
            <span>Late threshold (minutes)</span>
            <input type="number" defaultValue={30} />
          </label>
        </div>
        <div className="button-row">
          <button className="button primary" type="button">
            Save settings
          </button>
        </div>
      </section>
    </div>
  );
}
