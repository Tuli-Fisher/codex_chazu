import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "./auth";

const navItems = [
  { to: "/today", label: "Todays Menu" },
  { to: "/orders", label: "Orders Today" },
  { to: "/locations", label: "Locations" },
  { to: "/history", label: "History" },
  { to: "/donations", label: "Donations" },
  { to: "/sms", label: "SMS" },
  { to: "/settings", label: "Settings" },
];

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-title">Chazu Seasonal</div>
          <div className="brand-subtitle">Meal Program Admin</div>
        </div>
        <nav className="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }: { isActive: boolean }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="pill">Active Season: Spring 2026</div>
          <div className="muted">Last sync: 2 mins ago</div>
        </div>
      </aside>
      <div className="content">
        <header className="topbar">
          <div className="topbar-left">
            <span className="pill">Admin Console</span>
            <span className="topbar-title">Seasonal Meal Logistics</span>
          </div>
          <div className="topbar-right">
            <span className="pill subtle">{user?.email ?? "admin"}</span>
            <button className="button ghost" type="button" onClick={logout}>
              Sign out
            </button>
          </div>
        </header>
        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
