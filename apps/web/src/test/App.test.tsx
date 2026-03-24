import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderApp } from "./utils";

describe("app routing", () => {
  it("redirects unauthenticated users to login", async () => {
    renderApp("/today");
    expect(await screen.findByText("Chazu Seasonal Meals")).toBeInTheDocument();
  });

  it("allows login and lands on Today Setup", async () => {
    renderApp("/login");
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText("you@organization.org"),
      "admin@example.org"
    );
    await user.type(screen.getByPlaceholderText("********"), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByRole("heading", { name: "Todays Menu" })
    ).toBeInTheDocument();
  });
});
