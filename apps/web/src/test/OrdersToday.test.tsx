import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithAuth } from "./utils";

describe("Orders Today page", () => {
  it("shows per-location submissions and meal totals", async () => {
    renderWithAuth("/orders");

    expect(
      await screen.findByText("Per-location submissions")
    ).toBeInTheDocument();
    expect(screen.getByText("Breakfast totals")).toBeInTheDocument();
    expect(screen.getByText("Lunch totals")).toBeInTheDocument();
  });
});
