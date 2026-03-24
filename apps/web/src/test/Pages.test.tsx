import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderApp, renderWithAuth } from "./utils";

describe("Today Setup", () => {
  it("renders the available menu list", async () => {
    renderWithAuth("/today");

    expect(
      await screen.findByRole("heading", { name: "Breakfast" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Supper" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Available menu items" })
    ).toBeInTheDocument();
  });

  it("lets admins add a new available menu item", async () => {
    renderWithAuth("/today");
    const user = userEvent.setup();

    await screen.findByRole("heading", { name: "Available menu items" });
    expect(screen.queryByLabelText("Item name")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Add meal" }));
    await user.type(screen.getByLabelText("Item name"), "Oatmeal cups");
    await user.click(screen.getByRole("button", { name: "Add to available" }));

    expect(screen.getByText("Oatmeal cups")).toBeInTheDocument();
    expect(screen.queryByLabelText("Item name")).not.toBeInTheDocument();
  });
});

describe("Locations", () => {
  it("shows location grid rows", async () => {
    renderWithAuth("/locations");

    expect(
      await screen.findByRole("heading", { name: "Locations" })
    ).toBeInTheDocument();
    expect(await screen.findByText("Riverside Community Center")).toBeInTheDocument();
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
    expect(screen.getByRole("heading", { name: "Managers" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Today's order" })).toBeInTheDocument();
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
    expect(await screen.findByText("Lydia Ross")).toBeInTheDocument();
    expect(screen.getByText("Check")).toBeInTheDocument();
  });

  it("renders the donation log tab", async () => {
    renderWithAuth("/donations?tab=log");

    expect(
      await screen.findByRole("heading", { name: "Donation log" })
    ).toBeInTheDocument();
  });

  it("opens the donation form with a how-donated dropdown and notes field", async () => {
    renderWithAuth("/donations");
    const user = userEvent.setup();

    await screen.findByRole("heading", { name: "Central donors" });
    await user.click(screen.getByRole("button", { name: "Add donation" }));

    expect(screen.getByRole("heading", { name: "New donation" })).toBeInTheDocument();
    expect(screen.getByLabelText("How donated")).toBeInTheDocument();
    expect(screen.getByLabelText("Notes")).toBeInTheDocument();
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
