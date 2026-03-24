import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./auth";

export function RequireAuth() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <main className="page">
        <div className="stack">
          <section className="panel">
            <h1>Loading session</h1>
            <p className="muted">Checking your admin access.</p>
          </section>
        </div>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
