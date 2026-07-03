// ============================================================
// Mallorca Cycling Camp 2026 — trip manifest
// Five days: 4 riding days + 1 rest day around the island.
// Assets live under /public/trips/mallorca-2026 (assetBase).
// Climb data validated against the source GPX tracks.
// ============================================================
import type {
  TripManifest,
  EventMetadata,
  TeamMetadata,
  Rider,
  Stage,
  ProfileClimbSegment,
  EventPhoto,
} from "../../data/types";
import { estimatedRoute, estimatedProfile } from "../../data/stageHelpers";

const ASSET_BASE = "/trips/mallorca-2026";

const event: EventMetadata = {
  name: "Mallorca Cycling Camp 2026",
  shortName: "Mallorca 2026",
  dates: "Labor day 2026",
  location: "Mallorca, Balearic Islands",
  heroImage: {
    src: `${ASSET_BASE}/images/event/moment-01.jpg`,
    alt: "Cap de Formentor lighthouse and the peninsula road, Mallorca",
  },
  description:
    "A five-day road cycling camp around Mallorca, the spiritual home of European training camps. Four riding days link the Serra de Tramuntana, Sa Calobra, and Cap de Formentor around one well-earned rest day on the bay of Pollença.",
  totalStages: 5,
  distanceKm: 379,
  distanceMi: 236,
  elevationM: 7610,
  elevationFt: 24960,
  links: [
    { label: "Mallorca cycling guide", href: "https://www.mallorcacycling.co.uk/" },
    { label: "Sa Calobra (climbfinder)", href: "https://climbfinder.com/en/climbs/sa-calobra" },
    { label: "Cap de Formentor", href: "https://climbfinder.com/en/climbs/cap-de-formentor" },
  ],
};

const team: TeamMetadata = {
  name: "Woodenlegs",
  riderCount: 17,
  description:
    "Founded in Seattle and united by a questionable love of climbing, Woodenlegs is a group of friends who make an annual pilgrimage to Europe in search of epic rides. This year the pilgrimage heads to Mallorca — Sa Calobra, Cap de Formentor, and the Serra de Tramuntana — for a week of coffee stops, hairpins, and cheerful suffering.",
  photo: {
    src: `${ASSET_BASE}/images/team/team-photo.jpg`,
    alt: "Woodenlegs team riders",
  },
  links: [{ label: "GitHub repo", href: "https://github.com/fbmattos/tour-transalp-2026" }],
};

const rider = (name: string): Rider => ({ name, role: "Rider", goals: [], funFact: "" });

const riders: Rider[] = [
  rider("Alderico Da Silveira"),
  rider("Alex da Veiga"),
  rider("Amador Abreu"),
  rider("Carlos De Vincenzo"),
  rider("Carlos Moro"),
  rider("Fabio Gava"),
  rider("Fabricio Voznika"),
  rider("Gustavo Santos"),
  rider("Luiz Paulo Gama Barreto"),
  {
    name: "Marcelo Albuquerque",
    role: "Rider",
    goals: [],
    funFact:
      "The detail machine: structured, prepared, and probably already knows the gradient of tomorrow’s climb.",
    shortLine:
      "The detail machine: structured, prepared, and probably already knows the gradient of tomorrow’s climb.",
    socialLinks: [
      { label: "Instagram", href: "https://www.instagram.com/albuqm/" },
      { label: "Strava", href: "https://www.strava.com/athletes/2309909" },
    ],
  },
  rider("Marcelo Simões Wolf"),
  rider("Marcone Oliveira"),
  rider("Mercio de Paula"),
  rider("Rafael Barcelos"),
  rider("Renato Martins"),
  rider("Robledo Pontes"),
  {
    name: "Sergio Clemente Filho",
    role: "Rider",
    goals: [],
    funFact:
      "The instigator-in-chief: picked Mallorca, built the plan, and convinced everyone this was a good idea.",
    shortLine:
      "The instigator-in-chief: picked Mallorca, built the plan, and convinced everyone this was a good idea.",
    socialLinks: [
      { label: "Instagram", href: "https://www.instagram.com/sergio.clemente.f/" },
      { label: "Strava", href: "https://www.strava.com/athletes/1785396" },
    ],
  },
];

const stages: Stage[] = [
  // ─── Stage 1: Palma → Port de Sóller (west-coast opener) ───
  {
    id: "stage-1",
    stageNumber: 1,
    start: "Palma, Mallorca",
    finish: "Port de Sóller, Mallorca",
    distanceKm: 93,
    distanceMi: 58,
    elevationM: 2500,
    elevationFt: 8200,
    difficultyScore: 7,
    badge: "Coastal Opener",
    badgeColor: "blue",
    summary:
      "A rolling introduction to the Serra de Tramuntana. The route leaves Palma, swings out toward Andratx, then follows the spectacular MA-10 coast road through Estellencs, Banyalbufar, Valldemossa and Deià before dropping into Port de Sóller. There is no single monster climb, but the constant up-and-down along the cliffs adds up.",
    estimatedTime: "4 h 00 min – 5 h 30 min",
    mainRisk:
      "Treating a \"no big climb\" profile as easy. The relentless coastal rollers and midday heat quietly drain the legs before you reach Sóller.",
    pacingAdvice:
      "Settle in through the Palma exit and the run to Andratx, then ride the coast road at a steady, conversational effort. Eat and drink early — the exposed cliffs get hot and there are few long flat stretches to recover on.",
    gpxFile: `${ASSET_BASE}/gpx/mallorca-01-palma-port-de-soller.gpx`,
    routeCoordinates: estimatedRoute(
      [39.55542, 2.6214],
      [
        [39.60643, 2.40977],
        [39.69093, 2.5749],
      ],
      [39.79617, 2.69779]
    ),
    startCoord: [39.55542, 2.6214],
    finishCoord: [39.79617, 2.69779],
    climbs: [
      {
        name: "Coll des Pi / Coll de sa Gramola",
        approximateLatLng: [39.60643, 2.40977],
        approximateKm: 36,
        summitElevationM: 373,
        lengthKm: 5,
        maxGradient: 6,
        whyFamous:
          "The classic south-west Tramuntana climb between Andratx and Estellencs, opening up the first big sea views of the MA-10 corniche.",
      },
      {
        name: "Valldemossa coast high point",
        approximateLatLng: [39.69093, 2.5749],
        approximateKm: 66,
        summitElevationM: 505,
        lengthKm: 11,
        maxGradient: 6,
        whyFamous:
          "The highest point of the coast road near Valldemossa — a balcony of switchbacks hanging over the Mediterranean, and the postcard section of the west coast.",
      },
    ],
    elevationProfile: estimatedProfile(
      93,
      [
        { distance: 0, elevation: 50 },
        { distance: 20, elevation: 90 },
        { distance: 50, elevation: 140 },
        { distance: 78, elevation: 150 },
        { distance: 93, elevation: 8 },
      ],
      [
        { name: "Coll des Pi", approximateLatLng: [39.60643, 2.40977], approximateKm: 36, summitElevationM: 373, lengthKm: null, maxGradient: null, whyFamous: "" },
        { name: "Valldemossa", approximateLatLng: [39.69093, 2.5749], approximateKm: 66, summitElevationM: 505, lengthKm: null, maxGradient: null, whyFamous: "" },
      ]
    ),
  },

  // ─── Stage 2: Port de Sóller → Sa Calobra → Port de Pollença (QUEEN) ───
  {
    id: "stage-2",
    stageNumber: 2,
    start: "Port de Sóller, Mallorca",
    finish: "Port de Pollença, Mallorca",
    distanceKm: 95,
    distanceMi: 59,
    elevationM: 2610,
    elevationFt: 8560,
    difficultyScore: 9,
    badge: "Queen Stage",
    badgeColor: "red",
    summary:
      "The big one. Straight out of Port de Sóller the route climbs Coll de Sóller and the long drag past Puig Major — Mallorca's highest paved road — before the legendary descent-and-climb of Sa Calobra. From Coll dels Reis the route rolls through the high Tramuntana and descends the long way to Port de Pollença.",
    estimatedTime: "4 h 30 min – 6 h 30 min",
    mainRisk:
      "Emptying the tank on the Puig Major climb and having nothing left for Sa Calobra. The 26 hairpins out of Sa Calobra come after you have already climbed to the roof of the island.",
    pacingAdvice:
      "Climb Puig Major patiently and fuel on the high traverse. Descend to Sa Calobra with margin, then ride the famous climb back out at a steady tempo — it is relentless but never brutally steep. Stay smooth through the rolling final section and the descent into Pollença.",
    gpxFile: `${ASSET_BASE}/gpx/mallorca-02-soller-sa-calobra-pollenca.gpx`,
    routeCoordinates: estimatedRoute(
      [39.79339, 2.6966],
      [
        [39.78886, 2.77936],
        [39.82754, 2.81799],
      ],
      [39.84024, 3.1267]
    ),
    startCoord: [39.79339, 2.6966],
    finishCoord: [39.84024, 3.1267],
    climbs: [
      {
        name: "Puig Major (Coll de Sóller)",
        approximateLatLng: [39.78886, 2.77936],
        approximateKm: 17,
        summitElevationM: 886,
        lengthKm: 16.7,
        maxGradient: 8,
        whyFamous:
          "The highest paved point on Mallorca. Reached from Port de Sóller over the switchbacks of Coll de Sóller and a long steady drag to the Puig Major tunnels at roughly 880 m.",
      },
      {
        name: "Sa Calobra (Coll dels Reis)",
        approximateLatLng: [39.82754, 2.81799],
        approximateKm: 47,
        summitElevationM: 668,
        lengthKm: 9.4,
        maxGradient: 12,
        whyFamous:
          "Cycling's most photographed climb: 9.4 km and 26 hairpins rising from the sea at Sa Calobra, including the 270° \"nus de sa corbata\" where the road loops under itself, up to Coll dels Reis.",
      },
    ],
    elevationProfile: estimatedProfile(
      95,
      [
        { distance: 0, elevation: 5 },
        { distance: 37, elevation: 40 },
        { distance: 95, elevation: 7 },
      ],
      [
        { name: "Puig Major", approximateLatLng: [39.78886, 2.77936], approximateKm: 17, summitElevationM: 886, lengthKm: null, maxGradient: null, whyFamous: "" },
        { name: "Sa Calobra", approximateLatLng: [39.82754, 2.81799], approximateKm: 47, summitElevationM: 668, lengthKm: null, maxGradient: null, whyFamous: "" },
      ]
    ),
  },

  // ─── Stage 3: Rest Day (Port de Pollença) ───
  {
    id: "stage-3",
    stageNumber: 3,
    start: "Port de Pollença, Mallorca",
    finish: "Port de Pollença, Mallorca",
    distanceKm: 0,
    distanceMi: 0,
    elevationM: 0,
    elevationFt: 0,
    difficultyScore: 0,
    badge: "Rest Day",
    badgeColor: "green",
    isRestDay: true,
    summary:
      "A well-earned rest day on the bay of Pollença. Spin the legs on the flat if you must, but the real assignment is coffee, a swim, a long lunch, and staying off the climbs. Tomorrow the peninsula awaits.",
    estimatedTime: "Rest day",
    mainRisk:
      "\"Just an easy hour\" turning into a three-hour epic up Formentor. Actually resting is harder than it sounds for this group.",
    pacingAdvice:
      "Eat well, hydrate, stretch, and let the legs recover from the queen stage. If you ride at all, keep it flat and short — the goal is fresh legs for Cap de Formentor.",
    gpxFile: "",
    routeCoordinates: [],
    startCoord: [39.84024, 3.1267],
    finishCoord: [39.84024, 3.1267],
    climbs: [],
    elevationProfile: [
      { distance: 0, elevation: 5 },
      { distance: 1, elevation: 5 },
    ],
  },

  // ─── Stage 4: Cap de Formentor loop (from Port d'Alcúdia) ───
  {
    id: "stage-4",
    stageNumber: 4,
    start: "Port d'Alcúdia, Mallorca",
    finish: "Port d'Alcúdia, Mallorca",
    distanceKm: 83,
    distanceMi: 52,
    elevationM: 1950,
    elevationFt: 6400,
    difficultyScore: 6,
    badge: "Formentor Loop",
    badgeColor: "orange",
    summary:
      "The island's most dramatic peninsula. From the bay the route rides up to Port de Pollença, climbs onto the Formentor headland past the Mirador des Colomer, rolls out toward the lighthouse at Cap de Formentor, then returns and loops back toward Alcúdia. Short climbs, wild cliffs, and a lighthouse at the end of the world.",
    estimatedTime: "3 h 30 min – 5 h 00 min",
    mainRisk:
      "Wind and traffic on the narrow, exposed lighthouse road, plus underestimating the punchy rollers on the way out and back. It photographs as a cruise but the peninsula bites.",
    pacingAdvice:
      "Warm up on the flat run to Port de Pollença, then take the climbs to the Mirador and the lighthouse steady — they are short but repeat. Watch for tour buses near the cape and keep something for the rollers home.",
    gpxFile: `${ASSET_BASE}/gpx/mallorca-04-cap-formentor-loop.gpx`,
    routeCoordinates: estimatedRoute(
      [39.83637, 3.12169],
      [
        [39.92869, 3.11128],
        [39.92846, 3.11754],
      ],
      [39.83637, 3.12169]
    ),
    startCoord: [39.83637, 3.12169],
    finishCoord: [39.83637, 3.12169],
    climbs: [
      {
        name: "Coll de la Creueta (Mirador des Colomer)",
        approximateLatLng: [39.92869, 3.11128],
        approximateKm: 17,
        summitElevationM: 212,
        lengthKm: null,
        maxGradient: null,
        whyFamous:
          "The gateway climb onto the Formentor peninsula, topping out near the cliff-edge Mirador des Colomer viewpoint high above the sea stacks.",
      },
      {
        name: "Cap de Formentor",
        approximateLatLng: [39.92846, 3.11754],
        approximateKm: 48,
        summitElevationM: 356,
        lengthKm: null,
        maxGradient: null,
        whyFamous:
          "The high point of the road out to the Far de Formentor lighthouse at Mallorca's northern tip — a spectacular, wind-blasted clifftop that marks the turnaround of the loop.",
      },
    ],
    elevationProfile: estimatedProfile(
      83,
      [
        { distance: 0, elevation: 6 },
        { distance: 30, elevation: 150 },
        { distance: 55, elevation: 60 },
        { distance: 83, elevation: 6 },
      ],
      [
        { name: "Mirador des Colomer", approximateLatLng: [39.92869, 3.11128], approximateKm: 17, summitElevationM: 212, lengthKm: null, maxGradient: null, whyFamous: "" },
        { name: "Cap de Formentor", approximateLatLng: [39.92846, 3.11754], approximateKm: 48, summitElevationM: 356, lengthKm: null, maxGradient: null, whyFamous: "" },
      ]
    ),
  },

  // ─── Stage 5: Port d'Alcúdia → Palma (return across the Pla) ───
  {
    id: "stage-5",
    stageNumber: 5,
    start: "Port d'Alcúdia, Mallorca",
    finish: "Palma, Mallorca",
    distanceKm: 108,
    distanceMi: 67,
    elevationM: 550,
    elevationFt: 1800,
    difficultyScore: 3,
    badge: "Return to Palma",
    badgeColor: "purple",
    summary:
      "The transfer home across the Pla de Mallorca. After days in the mountains this is a mostly flat, fast run through the island's inland farm villages, with only a gentle rise near Randa to break up the tempo before rolling into Palma.",
    estimatedTime: "4 h 00 min – 5 h 30 min",
    mainRisk:
      "Complacency and wind. Flat does not mean free — a headwind across the open Pla, plus tired legs, can make the final kilometres to Palma drag.",
    pacingAdvice:
      "Share the work in a rotating group across the flats, keep eating even though the climbing is done, and enjoy the run-in. Save a little for the gentle Randa rise, then cruise into Palma together.",
    gpxFile: `${ASSET_BASE}/gpx/mallorca-05-alcudia-palma.gpx`,
    routeCoordinates: estimatedRoute(
      [39.83436, 3.11802],
      [[39.53414, 2.87719]],
      [39.56894, 2.64652]
    ),
    startCoord: [39.83436, 3.11802],
    finishCoord: [39.56894, 2.64652],
    climbs: [
      {
        name: "Randa rise",
        approximateLatLng: [39.53414, 2.87719],
        approximateKm: 75,
        summitElevationM: 233,
        lengthKm: null,
        maxGradient: null,
        whyFamous:
          "A gentle high point as the route skirts the base of Puig de Randa — the monastery hill rising alone out of the flat Pla. The route only grazes it; this is the day's only real rise.",
      },
    ],
    elevationProfile: estimatedProfile(
      108,
      [
        { distance: 0, elevation: 3 },
        { distance: 40, elevation: 120 },
        { distance: 92, elevation: 60 },
        { distance: 108, elevation: 12 },
      ],
      [
        { name: "Randa rise", approximateLatLng: [39.53414, 2.87719], approximateKm: 75, summitElevationM: 233, lengthKm: null, maxGradient: null, whyFamous: "" },
      ]
    ),
  },
];

const profileClimbSegments: ProfileClimbSegment[] = [
  { id: "coll-des-pi", stageId: "stage-1", name: "Coll des Pi", startKm: 31.0, summitKm: 36.0 },
  { id: "valldemossa", stageId: "stage-1", name: "Valldemossa", startKm: 55.0, summitKm: 66.0 },

  { id: "puig-major", stageId: "stage-2", name: "Puig Major", startKm: 0.5, summitKm: 16.8 },
  { id: "sa-calobra", stageId: "stage-2", name: "Sa Calobra", startKm: 37.0, summitKm: 47.0 },

  // stage-3 is a rest day — no climb overlays

  { id: "mirador-des-colomer", stageId: "stage-4", name: "Mirador des Colomer", startKm: 7.0, summitKm: 17.0 },
  { id: "cap-de-formentor", stageId: "stage-4", name: "Cap de Formentor", startKm: 42.0, summitKm: 48.0 },

  { id: "randa-rise", stageId: "stage-5", name: "Randa", startKm: 37.0, summitKm: 75.0 },
];

const eventPhotos: EventPhoto[] = [
  {
    src: `${ASSET_BASE}/images/event/moment-01.jpg`,
    alt: "Cap de Formentor lighthouse and the peninsula road, Mallorca",
    caption: "Cap de Formentor",
  },
];

export const manifest: TripManifest = {
  id: "mallorca-2026",
  assetBase: ASSET_BASE,
  showAbout: false,
  event,
  team,
  riders,
  stages,
  profileClimbSegments,
  eventPhotos,
};
