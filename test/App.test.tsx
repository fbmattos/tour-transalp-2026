import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from '../src/App';
import { UnitsProvider } from '../src/context/UnitsProvider';

vi.mock('../src/components/RouteMap', () => ({
  RouteMap: () => <div data-testid="route-map">Route map</div>,
}));

vi.mock('../src/components/ElevationProfile', () => ({
  ElevationProfile: () => <div data-testid="elevation-profile">Elevation profile</div>,
}));

const renderApp = () =>
  render(
    <UnitsProvider>
      <App />
    </UnitsProvider>
  );

beforeEach(() => {
  window.localStorage.clear();
});

describe('App', () => {
  it('renders without crashing', () => {
    renderApp();

    expect(screen.getByRole('heading', { name: /Tour Transalp 2026/i })).toBeInTheDocument();
    expect(screen.getByTestId('route-map')).toBeInTheDocument();
  });

  it('renders the metric/imperial toggle and changes visible units', async () => {
    const user = userEvent.setup();
    renderApp();

    expect(screen.getByRole('button', { name: 'mi' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getAllByText(/71 mi/i).length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: 'km' }));

    expect(screen.getByRole('button', { name: 'km' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getAllByText(/114 km/i).length).toBeGreaterThan(0);
  });
});
