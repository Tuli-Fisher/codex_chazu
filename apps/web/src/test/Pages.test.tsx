import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderApp, renderWithAuth } from "./utils";

describe("Today Setup", () => {
  it("renders the available menu list", async () => {
    renderWithAuth("/today");

    expect(
      await screen.findByRole("heading", { name: "Available today" })
    ).toBeInTheDocument();
  });
});

describe("Locations", () => {
  it("shows location grid rows", async () => {
    renderWithAuth("/locations");

    expect(
      await screen.findByRole("heading", { name: "Locations" })
    ).toBeInTheDocument();
    expect(screen.getByText("Riverside Community Center")).toBeInTheDocument();
  });
});

describe("Location Detail", () => {
  it("renders overview content", async () => {
    renderWithAuth("/locations/riverside");

    expect(
      await screen.findByRole("heading", {
        name: "Riverside Community Center",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Primary contact" })
    ).toBeInTheDocument();
  });

  it("renders donation tab content", async () => {
    renderWithAuth("/locations/riverside?tab=donations");

    expect(
      await screen.findByRole("heading", { name: "Donation log" })
    ).toBeInTheDocument();
  });
});

describe("Donations", () => {
  it("defaults to the donors tab", async () => {
    renderWithAuth("/donations");

    expect(
      await screen.findByRole("heading", { name: "Central donors" })
    ).toBeInTheDocument();
  });

  it("renders the donation log tab", async () => {
    renderWithAuth("/donations?tab=log");

    expect(
      await screen.findByRole("heading", { name: "Donation log" })
    ).toBeInTheDocument();
  });
});

describe("History", () => {
  it("switches drilldown tabs", async () => {
    renderWithAuth("/history");
    const user = userEvent.setup();

    expect(
      await screen.findByRole("heading", { name: "Drilldowns" })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "By date" }));
    expect(screen.getByText("Submissions")).toBeInTheDocument();
  });
});

describe("Settings", () => {
  it("renders admin settings", async () => {
    renderWithAuth("/settings");

    expect(
      await screen.findByRole("heading", { name: "Admin Settings" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Order lock defaults" })
    ).toBeInTheDocument();
  });
});

describe("SMS", () => {
  it("renders the sms placeholder", async () => {
    renderWithAuth("/sms");

    expect(await screen.findByRole("heading", { name: "SMS" })).toBeInTheDocument();
    expect(screen.getByText("Automated order texts")).toBeInTheDocument();
  });
});

describe("Not Found", () => {
  it("renders the 404 page for unknown routes", async () => {
    renderApp("/not-a-real-page");

    expect(
      await screen.findByRole("heading", { name: "Page not found" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Back to Todays Menu" })
    ).toBeInTheDocument();
  });
});
