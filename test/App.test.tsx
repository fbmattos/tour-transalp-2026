import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import App from "../src/App";
import { UnitsProvider } from "../src/context/UnitsProvider";

vi.mock("../src/components/RouteMap", () => ({
  RouteMap: () => <div data-testid="route-map">Route map</div>,
}));

vi.mock("../src/components/ElevationProfile", () => ({
  ElevationProfile: () => (
    <div data-testid="elevation-profile">Elevation profile</div>
  ),
}));

const renderApp = () =>
  render(
    <UnitsProvider>
      <App />
    </UnitsProvider>,
  );

beforeEach(() => {
  window.localStorage.clear();
});

describe("App", () => {
  it("renders without crashing", () => {
    renderApp();

    expect(
      screen.getByRole("heading", { name: /Tour Transalp 2026/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("route-map")).toBeInTheDocument();
  });

  it("renders the metric/imperial toggle and changes visible units", async () => {
    const user = userEvent.setup();
    renderApp();

    expect(screen.getByRole("button", { name: "mi" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getAllByText(/71 mi/i).length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "km" }));

    expect(screen.getByRole("button", { name: "km" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getAllByText(/114 km/i).length).toBeGreaterThan(0);
  });

  it("shows the simplified mobile tab set", () => {
    renderApp();

    expect(
      screen.getAllByRole("button", { name: "Overview" }).length,
    ).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Map" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Profile" })).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "Video" }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.queryByRole("button", { name: "Details" }),
    ).not.toBeInTheDocument();
  });

  it("renders GPX and KML download buttons for the selected stage", () => {
    renderApp();

    expect(
      screen.getAllByRole("link", { name: "Download GPX" })[0],
    ).toHaveAttribute("href", "/gpx/TT-2026 01 Lienz-Sillian_TRACK.gpx");
    expect(
      screen.getAllByRole("link", { name: "Download KML" })[0],
    ).toHaveAttribute("href", "/kml/TT-2026 01 Lienz-Sillian_TRACK.kml");
  });

  it("renders team and rider data on the About view", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(
      screen.getByRole("button", {
        name: "About this dashboard and Tour Transalp",
      }),
    );

    expect(
      screen.getByRole("heading", { name: "Woodenlegs" }),
    ).toBeInTheDocument();
    expect(screen.getByAltText("Woodenlegs team riders")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Sergio Clemente" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/instigator-in-chief/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Marcelo/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Eduardo Laureano" }),
    ).toBeInTheDocument();
  });
});
