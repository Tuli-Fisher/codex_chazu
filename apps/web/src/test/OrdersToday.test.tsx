import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithAuth } from "./utils";

describe("Orders Today page", () => {
  it("shows per-location submissions and meal totals", async () => {
    renderWithAuth("/orders");

    expect(
      await screen.findByText("Per-location submissions")
    ).toBeInTheDocument();
    expect(screen.getByText("Breakfast totals")).toBeInTheDocument();
    expect(screen.getByText("Supper totals")).toBeInTheDocument();
  });

  it("opens the manager popup from a manager name", async () => {
    renderWithAuth("/orders");
    const user = userEvent.setup();

    await screen.findByText("Per-location submissions");
    await user.click(await screen.findByRole("button", { name: "Taylor Lee" }));

    expect(
      await screen.findByRole("dialog", { name: "Riverside Community Center" })
    ).toBeInTheDocument();
    expect(screen.getByText("(555) 212-8871")).toBeInTheDocument();
  });

  it("navigates to the send staging page", async () => {
    renderWithAuth("/orders");
    const user = userEvent.setup();

    await screen.findByText("Per-location submissions");
    await user.click(screen.getByRole("button", { name: "Review and send" }));

    expect(
      await screen.findByRole("heading", { name: "Send Orders" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send all and lock" })).toBeInTheDocument();
  });
});
