# Product Spec: Seasonal Meal Program Admin System

## Summary
Build an admin-only web system to manage seasonal meal logistics across multiple locations. The admin defines the daily menu, locations submit orders based on that menu, and the system aggregates totals for procurement. The system also tracks location profiles, fundraising performance, daily/weekly participation, historical data, and accepts donations (pledge tracking only for now).

## Goals
- Admin can define what items are available each day for breakfast and supper.
- Admin can see all location orders in one place and export or send totals as one bulk order or split by location.
- Admin can manage a location directory with contact info, addresses, program metrics, and fundraising data.
- Admin can view historical data by date, season, location, or item.
- Admin can accept donations on a simple donation page (no payment processing in MVP).

## Non-Goals (MVP)
- No location-facing portal requirements (can be added later).
- No SMS automation (planned later, only note integration points).
- No payment processing.
- No compliance tracking.

## Users
- Admin only (single role for MVP).
- Multiple admins can be logged in concurrently.

## Core Concepts
- Daily Menu: The admin-defined list of items available for breakfast and supper on a given date.
- Order: Each location's quantities for the day, restricted to the Daily Menu.
- Aggregation: System totals per item and per meal, plus optional per-location breakdown for logistics.
- Season: A defined window (about 3 months) for program operation. Multiple seasons are stored simultaneously; one is marked active.

## Admin Pages

### 1. Admin Login
- Simple admin authentication.

### 2. Todays Menu (Daily Menu Builder)
- Admin sets the list of items available today for breakfast and supper.
- Items can be:
  - Custom ad hoc entries, and
  - Selected from a saved "Basic templates" list (global across seasons, to reduce typing/typos).
- Optional per-item fields:
  - Unit label (e.g., "bagels", "loaves")
  - Pack size (for procurement conversion)
  - Notes (e.g., brand preference)
  - Cutoff time for orders (used by SMS later; not enforced for admin entry)
- Menu applies to all locations for that day.
- Todays Menu loads the existing menu for that date (if any). Edits apply immediately to that date's menu.
- Action: apply a basic template (no automatic copy-forward).
- Menu edits after orders exist:
  - Orders remain editable after submit.
  - Orders lock only when the admin locks them (per order or for the whole date), or when the configured lock time passes.
  - Once locked, orders are read-only.
  - Menu remains editable at all times; editing the menu does not unlock locked orders.

### 3. Orders Today (Central Dashboard)
- Shows submission status for all locations.
- Orders are expected daily but can be missing for specific locations or ad hoc days.
- Missing = locations active in current season with no order for the date.
- Two views:
  - Aggregate totals for the day (per item, per meal)
  - Per-location orders
- Actions:
  - Export aggregated order (CSV/PDF)
  - Export per-location orders (CSV/PDF)
  - Email orders per location (one email per location)
  - Optional: lock a single location or lock all for the date
  - Flag missing or late submissions

### 4. Locations (Directory / Phone Book)
- List view with search and filter (active/inactive, season, region if needed).
- Each location record includes:
  - Name, status, type (school/community)
  - Contacts (0-2 preferred; stored as separate contact records)
  - Address
  - Operational notes (delivery window, pickup notes, special dietary notes)
  - Fundraising target and actuals (admin-adjustable, flexible)
  - Fundraising donors (name, amount, date, optional note)
  - Program metrics (daily and weekly participant counts)
- Locations are associated with seasons (active per season).
- Location detail view:
  - Summary card (contact + address)
  - Fundraising section
    - Target (admin editable)
    - Total raised
    - Donor list with date and amount
  - Participation section
    - Daily entries (optional, not required every day; at least seasonal totals/coverage)
    - Weekly rollups (computed)
  - Order history and season summaries
  - Notes

### 5. History
- Date range filter
- Drilldowns by location and by item
- Season summaries (daily totals, weekly totals)
- Ability to switch between seasons and compare past seasons

### 6. Donations Page
- Admin-only donation management page (public page later)
- Captures donor name, amount, email, note
- Creates a donation record (no payment processing)
- Donations can be general (not tied to a specific location)

### 7. Public Site (Future)
- Main public page with program info, photos, and donation form.
- Includes login entry points for admins and locations.

### 8. SMS (Placeholder Page)
- Admin page exists but only shows: "SMS coming soon"
- No functionality in MVP

### 9. Admin Settings
- Set a default daily order lock time (applies to new dates).
- Allow per-date override of lock time in Todays Menu.

## Data Requirements (Product-Level)
- Daily Menu per date and meal (breakfast/supper).
- Orders are only allowed for items in the Daily Menu.
- Aggregation by day, by meal, by item.
- Location fundraising targets are adjustable and not enforced strictly.
- Donor records should be tied to a season, and optionally to a location (general fund allowed).
- Participation data is tracked daily when available (not mandatory), with weekly summaries computed.
- Admins can manually enter participation counts when available; weekly totals are computed from daily entries.
- Order edits are tracked with a visible change history (who changed what and when).

## Workflows

### Daily Menu Setup
1. Admin opens Todays Menu.
2. Selects or enters available items for breakfast and supper (no automatic copy-forward).
3. Saves menu and sets cutoff times if desired.

### Order Aggregation
1. Orders come in (via admin entry or later SMS).
2. Admin dashboard shows totals and missing locations.
3. Admin exports aggregate order or per-location order lists.

### Fundraising Tracking
1. Admin sets or adjusts a location's fundraising target.
2. Admin logs donations (donor, amount, date).
3. Location fundraising totals update automatically.

### Participation Tracking
1. Admin can enter daily or weekly participant counts when available.
2. Counts are optional and not required every day.

## MVP vs Later
- MVP: Admin portal, menu builder, order dashboard, locations, history, donation page, SMS placeholder page.
- Later: Location portal and SMS automation.

## Open Questions
- Do you want per-item inventory tracking or only demand totals?

