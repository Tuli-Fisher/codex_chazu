# Technical Spec: Seasonal Meal Program Admin System

## Architecture (Recommended)
- Monorepo with two apps:
  - `web` (admin frontend)
  - `api` (backend service)
- Shared types or schema definitions (optional): `packages/shared`
- Frontend: TypeScript React with Vite bundler.
- Backend: Node.js server (Express API).
- Single relational database (PostgreSQL recommended).
- File/object storage optional (future for attachments).
- Single repo for admin and future public site.

## Development Phases
1. Mock data in frontend to validate screens and workflows before DB wiring.
2. Add API layer with in-memory handlers matching final endpoint shapes.
3. Implement real DB + Express endpoints.

## Deployment (Recommended)
- Frontend: Vite static build deployed to a CDN or app host.
- Backend: Node.js API service (containerized).
- Database: managed PostgreSQL.

## Auth and Roles
- Role: `admin` only for MVP.
- Support multiple concurrent admin sessions.
- Auth options:
  - Simple email+password with session cookies.
  - Or managed auth provider (later).
- Bootstrap: seed the first admin via a DB seed script or CLI.
- Later: one-time invite links for creating additional admins and password setup.

## Admin Settings
- Default daily order lock time (global setting).
- Per-date override via `daily_menus.lock_at`.

## Core Data Model (Schema Draft)

### tables
- `admins`
  - `id` (pk), `email` (unique), `password_hash`, `created_at`

- `seasons`
  - `id` (pk), `name`, `start_date`, `end_date`, `is_active`

- `locations`
  - `id` (pk), `name`, `status`, `type`, `address_line1`, `address_line2`, `city`, `state`, `zip`
  - `delivery_notes`, `dietary_notes`
  - `created_at`, `updated_at`

- `location_contacts`
  - `id` (pk), `location_id` (fk)
  - `name`, `phone`, `email`, `role`, `is_primary`
  - `created_at`, `updated_at`

- `location_seasons`
  - `id` (pk), `location_id` (fk), `season_id` (fk)
  - `is_active` (bool), `start_date`, `end_date`
  - `notes`

- `fundraising_targets`
  - `id` (pk), `location_id` (fk), `season_id` (fk)
  - `target_amount`, `target_notes`, `updated_at`

- `donors`
  - `id` (pk), `name`, `email`, `phone` (optional)

- `donations`
  - `id` (pk), `location_id` (fk, nullable for general fund), `season_id` (fk)
  - `donor_id` (fk), `amount`, `donated_at`, `note`

- `participants_daily`
  - `id` (pk), `location_id` (fk), `season_id` (fk)
  - `date`, `count`

- `menu_basics`
  - `id` (pk), `name`, `default_unit`, `active`

- `daily_menus`
  - `id` (pk), `season_id` (fk), `date`, `lock_at`

- `daily_menu_items`
  - `id` (pk), `daily_menu_id` (fk), `meal_type` (breakfast|lunch)
  - `item_name`, `unit`, `pack_size`, `notes`, `cutoff_time`

- `orders`
  - `id` (pk), `location_id` (fk), `daily_menu_id` (fk)
  - `status` (draft|submitted|locked), `submitted_at`, `locked_at`

- `order_items`
  - `id` (pk), `order_id` (fk), `daily_menu_item_id` (fk), `quantity`

- `order_audit_events`
  - `id` (pk), `order_id` (fk), `order_item_id` (fk, nullable)
  - `actor_admin_id` (fk), `action` (create|update|delete|submit|lock|unlock)
  - `before` (json), `after` (json), `created_at`

### Notes
- `daily_menu_items.item_name` allows custom entries; `menu_basics` provides reusable defaults.
- `menu_basics` is global across seasons.
- Weekly participant counts are computed from daily data on demand.
- Multiple seasons are stored simultaneously; `is_active` flags the current season for defaults.
- Locations can be active per season via `location_seasons`.
- Donations can be tied to a location or left null for general fund.
- Participant counts are optional; admin can enter them manually in MVP.
- Cutoff times are intended for SMS intake later, not enforced for admin entry.
- Cutoff times use a single global admin timezone (admin is on U.S. East Coast).
- MVP enforcement: show a "Late" flag after cutoff, do not block admin entry.
- Order edit rules:
  - Orders are editable while `draft` or `submitted`.
  - `submitted` means "ready for review" but still editable.
  - Orders lock only when explicitly locked (per-order or for a whole date) or when the configured lock time passes.
  - When locked, orders are read-only.
  - Menu items remain editable at all times; editing the menu does not unlock locked orders.
  - Default lock time is configured in admin settings; daily menus can override via `lock_at`.
- Donors are global profiles; donations reference the donor profile.

### Constraints
- `daily_menus`: unique on (`season_id`, `date`).
- `orders`: unique on (`location_id`, `daily_menu_id`).

### Indexes
- `orders` composite index on (`daily_menu_id`, `location_id`).
- `participants_daily` index on (`date`, `location_id`).

## API Endpoints (Draft)

### Auth
- `POST /auth/login`
- `POST /auth/logout`

### Locations
- `GET /locations`
- `POST /locations`
- `GET /locations/:id`
- `PATCH /locations/:id`
- `GET /locations/:id/orders`
- `GET /locations/:id/fundraising`

### Menu + Orders
- `GET /menus/today`
- `POST /menus` (create daily menu)
- `PATCH /menus/:id` (edit daily menu)
- `POST /orders` (create location order)
- `PATCH /orders/:id` (submit/lock)
- `PATCH /orders/:id` (update/submit)
- `POST /orders/lock` (lock all orders for a date, after procurement)
- `POST /orders/:id/lock` (lock a single order)
- `POST /orders/:id/unlock` (admin-only override)
### Menu
- `GET /orders/today/aggregate`
- `GET /orders/today/by-location` (includes missing locations with null order)
- `GET /orders/today/export?format=csv|pdf` (file download)
- `POST /orders/today/email` (send CSV/PDF via email)
- `GET /orders?season_id=&date_from=&date_to=&location_id=`
- `GET /aggregates?season_id=&date_from=&date_to=&group_by=item|location|date`

### Fundraising + Donations
- `POST /fundraising/targets`
- `PATCH /fundraising/targets/:id`
- `POST /donations`
- `GET /donations?location_id=&season_id=`

### Participation
- `POST /participants/daily`
- `GET /participants/daily?location_id=&season_id=&date=`
- `GET /participants/weekly?location_id=&season_id=&week_start=`

## Aggregation Logic
- Daily aggregate totals = sum of `order_items.quantity` grouped by `daily_menu_item_id`.
- Per-location export uses `orders` + `order_items` filtered by date.
- Weekly participation rollups computed on demand.

## Security and Audit
- Admin-only access to all endpoints.
- Log changes to menu, orders, and fundraising targets.

## Integrations (Later)
- SMS provider for structured order intake.
- Email notifications for missing submissions.
- Public website for program info + donations + login entry points.

## Testing Strategy (Robust)
- Maintain a growing test suite that is run on every functionality change to prevent regressions.
- Definition of done: tests, lint, and TypeScript compile must pass before a change is considered complete.
- Unit tests for core business logic (aggregation, validation, locking behavior).
- Integration tests for key flows (menu creation, order edits, locking, exports).
- API contract tests for menu/order flows and audit logging.
- Frontend tests for critical UI states (missing orders, late flags, lock status).
- Use Vitest for frontend and backend unit/integration tests.
- Add E2E tests (Playwright) for the core happy path and one critical edge case once UI stabilizes.

## Implementation Notes (2026-03-23)
- Initialized npm workspaces with `apps/web` (Vite React + TypeScript), `apps/api` (Express + TypeScript via `tsx`), and `packages/shared` (shared TS types).
- Added a shared TypeScript base config at `tsconfig.base.json`.
- Root scripts orchestrate workspace dev/build/typecheck; lint currently targets the web app.
- Stubbed the admin frontend shell with React Router, a simple localStorage-backed mock login, and placeholder pages for all MVP routes.
- Reworked the Locations UI into a productivity grid, added `/locations/:locationId` detail tabs (overview/history/donations), and wired location filters for History/Donations via query string.
- Separated Orders Today into breakfast and lunch totals with distinct export actions and missing submission tracking.
- Renamed the second meal from supper to lunch across specs, mock data, and UI labels.
- Rebuilt the Donations page with a central donors table and expandable donation log rows.
- Reshaped Today Setup into a two-panel workflow with per-meal tables, a basics library, and timing controls.
- Simplified `/today` and renamed the page label to "Todays Menu", showing only item name and today's availability.
- Split Donations into donor and donation-log tabs for clarity.
- Added a per-location submissions grid for Orders Today with separate breakfast/lunch statuses and actions.
- Reworked History with filters, summary panel, and item/location/date drilldown tabs.
- Added Vitest-based test suites for web UI and API endpoints.
- Expanded UI coverage across all core pages, added shared test helpers, and broadened API route assertions for orders, locations, donations, and participants.
- Implemented mock data for Orders Today, including per-location order entry, missing/late flags, and email/lock actions.
- Added mock Express endpoints for core resources (auth, menus, orders, locations, fundraising, donations, participants).
- Made location directory rows keyboard- and mouse-clickable to open `/locations/:locationId`, in addition to the row action button.

