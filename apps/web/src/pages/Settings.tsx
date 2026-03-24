import { useEffect, useState } from "react";
import { fetchSettings, saveSettings } from "../data/settings";
import { PageHeader } from "../ui/PageHeader";

export function Settings() {
  const [lockTime, setLockTime] = useState("16:30");
  const [timezone, setTimezone] = useState("America/New_York");
  const [lateThreshold, setLateThreshold] = useState(30);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    fetchSettings()
      .then((settings) => {
        if (!isCurrent) return;
        setLockTime(settings.lockTime);
        setTimezone(settings.timezone);
        setLateThreshold(settings.lateThresholdMinutes);
      })
      .catch((loadError) => {
        if (!isCurrent) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load settings.",
        );
      })
      .finally(() => {
        if (!isCurrent) return;
        setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const settings = await saveSettings({
        lockTime,
        timezone,
        lateThresholdMinutes: lateThreshold,
      });
      setLockTime(settings.lockTime);
      setTimezone(settings.timezone);
      setLateThreshold(settings.lateThresholdMinutes);
      setLastAction(
        `Saved: lock ${settings.lockTime}, late after ${settings.lateThresholdMinutes} min`,
      );
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save settings.",
      );
    } finally {
      setIsSaving(false);
    }
  };

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
        {error ? <div className="form-error">{error}</div> : null}
        <div className="form-grid">
          <label className="field">
            <span>Default lock time</span>
            <input
              type="time"
              value={lockTime}
              disabled={isLoading}
              onChange={(event) => setLockTime(event.target.value)}
            />
          </label>
          <label className="field">
            <span>Timezone</span>
            <input
              type="text"
              value={timezone}
              disabled={isLoading}
              onChange={(event) => setTimezone(event.target.value)}
            />
          </label>
          <label className="field">
            <span>Late threshold (minutes)</span>
            <input
              type="number"
              value={lateThreshold}
              disabled={isLoading}
              onChange={(event) => setLateThreshold(Number(event.target.value))}
            />
          </label>
        </div>
        <div className="button-row">
          <button
            className="button primary"
            type="button"
            onClick={() => {
              void handleSave();
            }}
            disabled={isLoading || isSaving}
          >
            {isSaving ? "Saving..." : "Save settings"}
          </button>
        </div>
      </section>
    </div>
  );
}
