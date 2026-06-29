import { describe, expect, it } from 'vitest';
import { parseEventPhotoManifest } from '../src/hooks/useEventPhotos';

describe('parseEventPhotoManifest', () => {
  it('sorts photos by filename and builds image paths', () => {
    const photos = parseEventPhotoManifest({
      'moment-03.jpg': { alt: 'Third', caption: 'Late climb' },
      'moment-01.jpg': { alt: 'First', caption: 'Start line' },
      'moment-02.jpg': { alt: 'Second' },
    });

    expect(photos).toEqual([
      {
        src: '/images/event/moment-01.jpg',
        alt: 'First',
        caption: 'Start line',
      },
      {
        src: '/images/event/moment-02.jpg',
        alt: 'Second',
      },
      {
        src: '/images/event/moment-03.jpg',
        alt: 'Third',
        caption: 'Late climb',
      },
    ]);
  });
});
