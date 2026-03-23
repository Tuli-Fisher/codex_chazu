import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="stack">
      <div className="card center">
        <div className="badge">404</div>
        <h2>Page not found</h2>
        <p className="muted">
          The page you are looking for does not exist. Use the navigation to
          continue.
        </p>
        <Link className="button primary" to="/today">
          Back to Today Setup
        </Link>
      </div>
    </div>
  );
}
