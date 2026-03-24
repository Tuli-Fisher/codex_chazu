import { useEffect, useMemo, useState } from "react";
import { createSearchParams, Link, useSearchParams } from "react-router-dom";
import {
  createDonation,
  fetchDonations,
  formatDonationMethod,
  type DonationMethod,
  type DonationRow,
} from "../data/donations";
import { fetchLocations, type LocationRecord } from "../data/locations";
import { PageHeader } from "../ui/PageHeader";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const donationMethodOptions: DonationMethod[] = [
  "cash",
  "check",
  "credit card",
  "other",
];

const todayValue = new Date().toISOString().slice(0, 10);

function formatDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

type DonationFormState = {
  donorName: string;
  donorEmail: string;
  amount: string;
  locationId: string;
  method: DonationMethod;
  note: string;
};

export function Donations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "donors";
  const search = searchParams.get("q") ?? "";
  const locationFilter = searchParams.get("location") ?? "all";
  const dateFrom = searchParams.get("date_from") ?? "";
  const dateTo = searchParams.get("date_to") ?? "";
  const [donationList, setDonationList] = useState<DonationRow[]>([]);
  const [locations, setLocations] = useState<LocationRecord[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<DonationFormState>({
    donorName: "",
    donorEmail: "",
    amount: "",
    locationId: locationFilter === "all" ? "general" : locationFilter,
    method: "cash",
    note: "",
  });

  useEffect(() => {
    let isCurrent = true;

    Promise.all([
      fetchDonations({
        locationId: locationFilter,
        q: search,
        dateFrom,
        dateTo,
      }),
      fetchLocations({}),
    ])
      .then(([donations, locationItems]) => {
        if (!isCurrent) return;
        setDonationList(donations);
        setLocations(locationItems);
      })
      .catch((loadError) => {
        if (!isCurrent) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load donations.",
        );
      })
      .finally(() => {
        if (!isCurrent) return;
        setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [dateFrom, dateTo, locationFilter, search]);

  const donorRows = useMemo(() => {
    const donorMap = new Map<
      string,
      {
        id: string;
        name: string;
        email: string;
        total: number;
        gifts: number;
        lastGift: string;
        lastMethod: DonationMethod;
        lastNote: string;
      }
    >();

    donationList.forEach((donation) => {
      const existing = donorMap.get(donation.donorId);

      if (existing) {
        existing.total += donation.amount;
        existing.gifts += 1;
        if (donation.date > existing.lastGift) {
          existing.lastGift = donation.date;
          existing.lastMethod = donation.method;
          existing.lastNote = donation.note ?? "";
        }
        return;
      }

      donorMap.set(donation.donorId, {
        id: donation.donorId,
        name: donation.donorName,
        email: donation.donorEmail,
        total: donation.amount,
        gifts: 1,
        lastGift: donation.date,
        lastMethod: donation.method,
        lastNote: donation.note ?? "",
      });
    });

    return Array.from(donorMap.values())
      .sort((a, b) => b.total - a.total)
      .map((donor) => ({
        ...donor,
        totalLabel: currency.format(donor.total),
        lastGiftLabel: formatDate(donor.lastGift),
        lastMethodLabel: formatDonationMethod(donor.lastMethod),
      }));
  }, [donationList]);

  const donationCols = "1.4fr 1.5fr 0.9fr 0.9fr 0.8fr 0.6fr";
  const donorCols = "1.3fr 1.5fr 0.9fr 0.9fr 1fr 1.2fr";

  const updateFilters = (updates: Record<string, string>) => {
    const next = new URLSearchParams(searchParams);

    setIsLoading(true);
    setError(null);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
    });

    setSearchParams(next, { replace: true });
  };

  const tabLink = (tab: string) =>
    `?${createSearchParams({
      ...(locationFilter !== "all" ? { location: locationFilter } : {}),
      ...(search ? { q: search } : {}),
      ...(dateFrom ? { date_from: dateFrom } : {}),
      ...(dateTo ? { date_to: dateTo } : {}),
      tab,
    }).toString()}`;

  const resetForm = () => {
    setForm({
      donorName: "",
      donorEmail: "",
      amount: "",
      locationId: locationFilter === "all" ? "general" : locationFilter,
      method: "cash",
      note: "",
    });
    setFormError("");
  };

  const openForm = () => {
    setForm((current) => ({
      ...current,
      locationId: locationFilter === "all" ? "general" : locationFilter,
    }));
    setShowForm(true);
    setFormError("");
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const submitDonation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const donorName = form.donorName.trim();
    const donorEmail = form.donorEmail.trim();
    const amount = Number.parseFloat(form.amount);

    if (!donorName) {
      setFormError("Enter a donor name.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError("Enter a valid donation amount.");
      return;
    }

    try {
      const donation = await createDonation({
        donorName,
        donorEmail,
        amount,
        locationId: form.locationId,
        method: form.method,
        note: form.note.trim() || undefined,
        date: todayValue,
      });

      setDonationList((current) => [donation, ...current]);
      setLastAction(`Donation for ${donorName} added`);
      closeForm();
    } catch (submitError) {
      setFormError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save donation.",
      );
    }
  };

  return (
    <div className="stack">
      <PageHeader
        title="Donations"
        description="All locations report into one central donor table. Track pledges and apply filters as needed."
        actions={
          <div className="button-row">
            <button
              className="button"
              type="button"
              onClick={() => setLastAction("Donations export prepared")}
            >
              Export
            </button>
            <button
              className="button primary"
              type="button"
              onClick={showForm ? closeForm : openForm}
            >
              {showForm ? "Close form" : "Add donation"}
            </button>
          </div>
        }
        meta={
          <>
            {locationFilter !== "all" ? (
              <span className="pill">
                Filtered:{" "}
                {locationFilter === "general"
                  ? "General Fund"
                  : locations.find((site) => site.id === locationFilter)?.name ?? "Location"}
              </span>
            ) : null}
            {lastAction ? <span className="pill subtle">{lastAction}</span> : null}
          </>
        }
      />

      {error ? <div className="form-error">{error}</div> : null}

      {showForm ? (
        <section className="panel">
          <div className="card-head">
            <div>
              <h2>New donation</h2>
              <div className="muted">
                Capture who donated, how they donated, and add a note.
              </div>
            </div>
            <button className="button ghost" type="button" onClick={closeForm}>
              Cancel
            </button>
          </div>
          <form className="form-grid donation-form" onSubmit={submitDonation}>
            <label className="field compact">
              <span>Donor name</span>
              <input
                type="text"
                value={form.donorName}
                onChange={(event) =>
                  setForm((current) => ({ ...current, donorName: event.target.value }))
                }
                placeholder="Lydia Ross"
              />
            </label>
            <label className="field compact">
              <span>Donor email</span>
              <input
                type="email"
                value={form.donorEmail}
                onChange={(event) =>
                  setForm((current) => ({ ...current, donorEmail: event.target.value }))
                }
                placeholder="lydia.ross@example.org"
              />
            </label>
            <label className="field compact">
              <span>Amount</span>
              <input
                type="number"
                min="1"
                step="1"
                value={form.amount}
                onChange={(event) =>
                  setForm((current) => ({ ...current, amount: event.target.value }))
                }
                placeholder="250"
              />
            </label>
            <label className="field compact">
              <span>Location</span>
              <select
                value={form.locationId}
                onChange={(event) =>
                  setForm((current) => ({ ...current, locationId: event.target.value }))
                }
              >
                <option value="general">General Fund</option>
                {locations.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field compact">
              <span>How donated</span>
              <select
                value={form.method}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    method: event.target.value as DonationMethod,
                  }))
                }
              >
                {donationMethodOptions.map((option) => (
                  <option key={option} value={option}>
                    {formatDonationMethod(option)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field compact">
              <span>Notes</span>
              <textarea
                rows={3}
                value={form.note}
                onChange={(event) =>
                  setForm((current) => ({ ...current, note: event.target.value }))
                }
                placeholder="Earmarked for breakfast support"
              />
            </label>
            <div className="field compact">
              <span>Action</span>
              <div className="button-row">
                <button className="button primary" type="submit">
                  Save donation
                </button>
                <button className="button ghost" type="button" onClick={resetForm}>
                  Clear
                </button>
              </div>
            </div>
          </form>
          {formError ? <div className="form-error">{formError}</div> : null}
        </section>
      ) : null}

      <div className="tabs">
        <Link className={activeTab === "donors" ? "tab active" : "tab"} to={tabLink("donors")}>
          Donors
        </Link>
        <Link className={activeTab === "log" ? "tab active" : "tab"} to={tabLink("log")}>
          Donation log
        </Link>
      </div>

      <div className="toolbar panel">
        <label className="field compact">
          <span>Search donor</span>
          <input
            type="text"
            placeholder="Name or email"
            value={search}
            onChange={(event) => updateFilters({ q: event.target.value })}
          />
        </label>
        <label className="field compact">
          <span>Location</span>
          <select
            value={locationFilter}
            onChange={(event) => updateFilters({ location: event.target.value })}
          >
            <option value="all">All locations</option>
            {locations.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
            <option value="general">General Fund</option>
          </select>
        </label>
        <label className="field compact">
          <span>Start date</span>
          <input
            type="date"
            value={dateFrom}
            onChange={(event) => updateFilters({ date_from: event.target.value })}
          />
        </label>
        <label className="field compact">
          <span>End date</span>
          <input
            type="date"
            value={dateTo}
            onChange={(event) => updateFilters({ date_to: event.target.value })}
          />
        </label>
        <button
          className="button ghost"
          type="button"
          onClick={() => {
            setSearchParams(new URLSearchParams({ tab: activeTab }), { replace: true });
            setLastAction("Filters cleared");
          }}
        >
          Clear filters
        </button>
      </div>

      {activeTab === "donors" ? (
        <section className="panel">
          <div className="card-head">
            <h2>Central donors</h2>
            <span className="pill subtle">{donorRows.length} donors</span>
          </div>
          {isLoading ? (
            <div className="muted">Loading donors...</div>
          ) : donorRows.length === 0 ? (
            <div className="muted">No donors match the current filters.</div>
          ) : (
            <div className="data-table">
              <div
                className="data-row header"
                style={{ "--cols": donorCols } as React.CSSProperties}
              >
                <div>Donor</div>
                <div>Email</div>
                <div>Total</div>
                <div>Last gift</div>
                <div>Method</div>
                <div>Note</div>
              </div>
              {donorRows.map((row) => (
                <div
                  key={row.id}
                  className="data-row"
                  style={{ "--cols": donorCols } as React.CSSProperties}
                >
                  <div>
                    <div className="item-title">{row.name}</div>
                    <div className="muted">{row.gifts} gifts</div>
                  </div>
                  <div className="muted">{row.email}</div>
                  <div>{row.totalLabel}</div>
                  <div>{row.lastGiftLabel}</div>
                  <div>{row.lastMethodLabel}</div>
                  <div className="muted">{row.lastNote || "No note"}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : null}

      {activeTab === "log" ? (
        <section className="panel">
          <div className="card-head">
            <h2>Donation log</h2>
            <span className="pill subtle">{donationList.length} records</span>
          </div>
          {isLoading ? (
            <div className="muted">Loading donation log...</div>
          ) : donationList.length === 0 ? (
            <div className="muted">No donations match the current filters.</div>
          ) : (
            <div className="data-table">
              <div
                className="data-row header"
                style={{ "--cols": donationCols } as React.CSSProperties}
              >
                <div>Donor</div>
                <div>Location</div>
                <div>Amount</div>
                <div>Date</div>
                <div>Method</div>
                <div></div>
              </div>
              {donationList.map((row) => {
                const isExpanded = expandedId === row.id;
                return (
                  <div key={row.id}>
                    <div
                      className="data-row"
                      style={{ "--cols": donationCols } as React.CSSProperties}
                    >
                      <div>{row.donorName}</div>
                      <div className="muted">{row.locationName}</div>
                      <div>{currency.format(row.amount)}</div>
                      <div>{formatDate(row.date)}</div>
                      <div className="muted">{formatDonationMethod(row.method)}</div>
                      <div>
                        <button
                          className="button ghost small"
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : row.id)}
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
                          <strong>Donor email:</strong> {row.donorEmail || "Not provided"}
                          <span className="detail-spacer" />
                          <strong>Note:</strong> {row.note || "No note"}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
