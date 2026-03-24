import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { AuthProvider } from "../app/auth";

const STORAGE_KEY = "chazu_admin_session";

type RenderOptions = {
  userEmail?: string;
};

export function renderApp(route: string, options: RenderOptions = {}) {
  if (options.userEmail) {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ email: options.userEmail })
    );
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    </AuthProvider>
  );
}

export function renderWithAuth(route: string, email = "admin@example.org") {
  return renderApp(route, { userEmail: email });
}
