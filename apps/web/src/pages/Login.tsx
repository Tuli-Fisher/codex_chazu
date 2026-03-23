import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../app/auth";

export function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) {
    return <Navigate to="/today" replace />;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) {
      setError("Enter an email to continue.");
      return;
    }
    setError("");
    login(email.trim());
    const next = (location.state as { from?: string } | null)?.from ?? "/today";
    navigate(next, { replace: true });
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-brand">
          <span className="pill">Admin Access</span>
          <h1>Chazu Seasonal Meals</h1>
          <p className="muted">
            This is a lightweight, admin-only login. Any email works for now.
          </p>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="you@organization.org"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error ? <div className="form-error">{error}</div> : null}
          <button className="button primary" type="submit">
            Sign in
          </button>
        </form>
        <div className="login-foot">
          <div className="muted">
            Need access? Ask a program lead to add your admin profile.
          </div>
        </div>
      </div>
      <div className="login-panel">
        <div className="panel-card">
          <h2>Today at a glance</h2>
          <p className="muted">
            Check submissions, finalize the daily menu, and export vendor orders
            in minutes.
          </p>
          <div className="stat-list">
            <div>
              <div className="stat">14</div>
              <div className="muted">Active locations</div>
            </div>
            <div>
              <div className="stat">9</div>
              <div className="muted">Submitted today</div>
            </div>
            <div>
              <div className="stat">3</div>
              <div className="muted">Late alerts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
