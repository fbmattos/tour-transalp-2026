import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventMomentsStrip } from '../src/components/EventMomentsStrip';
import { eventPhotos } from '../src/data/eventPhotos';

const testPhotos = eventPhotos.slice(0, 3);

describe('EventMomentsStrip', () => {
  beforeEach(() => {
    try {
      window.localStorage.clear();
    } catch {
      // jsdom may not provide localStorage in all environments
    }
  });

  it('renders the featured photo and navigation', () => {
    render(<EventMomentsStrip photos={testPhotos} />);

    expect(screen.getByRole('region', { name: 'Event photos' })).toBeInTheDocument();
    expect(screen.getByAltText(testPhotos[0].alt)).toBeInTheDocument();
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('switches photos when a dot is clicked', async () => {
    const user = userEvent.setup();
    render(<EventMomentsStrip photos={testPhotos} />);

    await user.click(screen.getByRole('tab', { name: 'Show photo 2' }));

    expect(screen.getByAltText(testPhotos[1].alt)).toBeInTheDocument();
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
  });

  it('can collapse and expand the banner', async () => {
    const user = userEvent.setup();
    render(<EventMomentsStrip photos={testPhotos} />);

    expect(screen.getByAltText(testPhotos[0].alt)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Hide photos' }));

    expect(screen.queryByAltText(testPhotos[0].alt)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Show photos' }));

    expect(screen.getByAltText(testPhotos[0].alt)).toBeInTheDocument();
  });

  it('opens a full-size lightbox when the banner image is clicked', async () => {
    const user = userEvent.setup();
    render(<EventMomentsStrip photos={testPhotos} />);

    await user.click(
      screen.getByRole('button', { name: `View full size: ${testPhotos[0].alt}` }),
    );

    expect(screen.getByRole('dialog', { name: 'Event photo viewer' })).toBeInTheDocument();
    expect(screen.getAllByAltText(testPhotos[0].alt)).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: 'Next photo' }));

    expect(screen.getAllByAltText(testPhotos[1].alt).length).toBeGreaterThan(0);
    expect(screen.getAllByText('2 / 3').length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: 'Close photo viewer' }));

    expect(
      screen.queryByRole('dialog', { name: 'Event photo viewer' }),
    ).not.toBeInTheDocument();
  });
});
