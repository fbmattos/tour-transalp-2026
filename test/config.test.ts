import { event } from '../src/data/event';
import { eventPhotos } from '../src/data/eventPhotos';
import { riders } from '../src/data/riders';
import { stages } from '../src/data/stages';
import { team } from '../src/data/team';

const expectNonEmptyString = (value: string, field: string) => {
  expect(value, field).toEqual(expect.any(String));
  expect(value.trim(), field).not.toBe('');
};

const expectPositiveNumber = (value: number, field: string) => {
  expect(Number.isFinite(value), field).toBe(true);
  expect(value, field).toBeGreaterThan(0);
};

const expectValidLinks = (links: { label: string; href: string }[] | undefined, field: string) => {
  if (!links) return;

  for (const link of links) {
    expectNonEmptyString(link.label, `${field}.label`);
    expect(link.href, `${field}.href`).toMatch(/^https?:\/\//);
  }
};

describe('event, team, and rider config', () => {
  it('defines complete event metadata', () => {
    expectNonEmptyString(event.name, 'event.name');
    expectNonEmptyString(event.dates, 'event.dates');
    expectNonEmptyString(event.location, 'event.location');
    expectNonEmptyString(event.description, 'event.description');
    expectNonEmptyString(event.heroImage.src, 'event.heroImage.src');
    expectNonEmptyString(event.heroImage.alt, 'event.heroImage.alt');

    expectPositiveNumber(event.totalStages, 'event.totalStages');
    expectPositiveNumber(event.distanceKm, 'event.distanceKm');
    expectPositiveNumber(event.distanceMi, 'event.distanceMi');
    expectPositiveNumber(event.elevationM, 'event.elevationM');
    expectPositiveNumber(event.elevationFt, 'event.elevationFt');
    expect(event.totalStages).toBe(stages.length);
    expectValidLinks(event.links, 'event.links');
  });

  it('defines event photo gallery entries', () => {
    expect(eventPhotos.length).toBeGreaterThanOrEqual(3);

    for (const photo of eventPhotos) {
      expectNonEmptyString(photo.src, 'eventPhoto.src');
      expect(photo.src, 'eventPhoto.src').toMatch(/^\/images\/event\//);
      expectNonEmptyString(photo.alt, 'eventPhoto.alt');
    }

    expect(event.heroImage.src).toBe(eventPhotos[0].src);
  });

  it('defines team metadata', () => {
    expectNonEmptyString(team.name, 'team.name');
    expectNonEmptyString(team.description, 'team.description');
    expectNonEmptyString(team.photo.src, 'team.photo.src');
    expectNonEmptyString(team.photo.alt, 'team.photo.alt');
    expectPositiveNumber(team.riderCount, 'team.riderCount');
    expect(team.riderCount).toBe(riders.length);
    expectValidLinks(team.links, 'team.links');
  });

  it('defines rider profiles with required and optional fields', () => {
    expect(riders.length).toBeGreaterThan(0);

    for (const rider of riders) {
      expectNonEmptyString(rider.name, 'rider.name');
      expectNonEmptyString(rider.location, `${rider.name}.location`);
      expectNonEmptyString(rider.role, `${rider.name}.role`);
      expectNonEmptyString(rider.funFact, `${rider.name}.funFact`);

      if (rider.headshot) {
        expectNonEmptyString(rider.headshot, `${rider.name}.headshot`);
      }

      if (rider.bike) {
        expectNonEmptyString(rider.bike, `${rider.name}.bike`);
      }

      for (const goal of rider.goals) {
        expectNonEmptyString(goal, `${rider.name}.goal`);
      }

      if (rider.stats) {
        for (const stat of rider.stats) {
          expectNonEmptyString(stat.label, `${rider.name}.stat.label`);
          expectNonEmptyString(stat.value, `${rider.name}.stat.value`);
        }
      }

      expectValidLinks(rider.socialLinks, `${rider.name}.socialLinks`);
    }
  });
});
