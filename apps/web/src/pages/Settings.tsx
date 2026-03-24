import { PageHeader } from "../ui/PageHeader";
import { useState } from "react";

export function Settings() {
  const [lockTime, setLockTime] = useState("16:30");
  const [timezone, setTimezone] = useState("America/New_York");
  const [lateThreshold, setLateThreshold] = useState(30);
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <div className="stack">
      <PageHeader
        title="Admin Settings"
        description="Control defaults for menus, lock times, and notifications."
        meta={lastAction ? <span className="pill subtle">{lastAction}</span> : undefined}
      />

      <section className="card">
        <div className="card-head">
          <h2>Order lock defaults</h2>
        </div>
        <div className="form-grid">
          <label className="field">
            <span>Default lock time</span>
            <input
              type="time"
              value={lockTime}
              onChange={(event) => setLockTime(event.target.value)}
            />
          </label>
          <label className="field">
            <span>Timezone</span>
            <input
              type="text"
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
            />
          </label>
          <label className="field">
            <span>Late threshold (minutes)</span>
            <input
              type="number"
              value={lateThreshold}
              onChange={(event) => setLateThreshold(Number(event.target.value))}
            />
          </label>
        </div>
        <div className="button-row">
          <button
            className="button primary"
            type="button"
            onClick={() =>
              setLastAction(
                `Saved: lock ${lockTime}, late after ${lateThreshold} min`,
              )
            }
          >
            Save settings
          </button>
        </div>
      </section>
    </div>
  );
}
