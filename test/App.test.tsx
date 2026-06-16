import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from '../src/App';

vi.mock('../src/components/RouteMap', () => ({
  RouteMap: () => <div data-testid="route-map">Route map</div>,
}));

vi.mock('../src/components/ElevationProfile', () => ({
  ElevationProfile: () => <div data-testid="elevation-profile">Elevation profile</div>,
}));

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /Tour Transalp 2026/i })).toBeInTheDocument();
    expect(screen.getByTestId('route-map')).toBeInTheDocument();
  });

  it('renders the metric/imperial toggle and changes visible units', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('button', { name: 'Imperial' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getAllByText(/71 mi/i).length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: 'Metric' }));

    expect(screen.getByRole('button', { name: 'Metric' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getAllByText(/114 km/i).length).toBeGreaterThan(0);
  });
});
