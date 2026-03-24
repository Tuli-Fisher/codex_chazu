import { useState } from "react";
import { PageHeader } from "../ui/PageHeader";

export function Sms() {
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <div className="stack">
      <PageHeader
        title="SMS"
        description="SMS intake and reminders are planned for a later release."
        meta={lastAction ? <span className="pill subtle">{lastAction}</span> : undefined}
      />
      <section className="card center">
        <div className="badge">Coming soon</div>
        <h2>Automated order texts</h2>
        <p className="muted">
          We will add scheduled reminders, structured intake, and cutoff
          enforcement once the core admin workflows are stable.
        </p>
        <button
          className="button"
          type="button"
          onClick={() => setLastAction("Integration plan requested (mock)")}
        >
          View integration plan
        </button>
      </section>
    </div>
  );
}
