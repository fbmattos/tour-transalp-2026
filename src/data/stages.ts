// ============================================================
// Tour Transalp 2026 — Stage Data
// ============================================================
// Official race metadata: distance, elevation gain, start/finish towns.
// GPX files provide the rendered route line and elevation profile at runtime.
// Climb length/gradient values remain curated until official climb data is available.
// ============================================================

export interface Climb {
  name: string;
  approximateLatLng: [number, number];
  approximateKm: number;
  summitElevationM: number;
  lengthKm: number | null;       // Curated until official climb-specific data is available
  maxGradient: number | null;    // Curated until official climb-specific data is available
  whyFamous: string;
}

export interface Stage {
  id: string;
  stageNumber: number;
  start: string;
  finish: string;
  distanceKm: number;
  distanceMi: number;
  elevationM: number;
  elevationFt: number;
  difficultyScore: number; // 1–10
  badge: string;
  badgeColor: "green" | "blue" | "orange" | "red" | "purple";
  summary: string;
  estimatedTime: string;
  mainRisk: string;
  pacingAdvice: string;
  gpxFile: string;
  // Fallback preview coordinates used before GPX files finish loading
  routeCoordinates: [number, number][];
  startCoord: [number, number];
  finishCoord: [number, number];
  climbs: Climb[];
  // Fallback preview profile used before GPX files finish loading
  elevationProfile: { distance: number; elevation: number }[];
}

// ============================================================
// Fallback route/profile helpers used before runtime GPX loading completes
// ============================================================
interface ProfileAnchor {
  distance: number;
  elevation: number;
}

function estimatedRoute(
  start: [number, number],
  waypoints: [number, number][],
  finish: [number, number]
): [number, number][] {
  return [
    start,
    ...waypoints,
    finish,
  ];
}

function estimatedProfile(
  _totalKm: number,
  anchors: ProfileAnchor[],
  climbs: Climb[]
): { distance: number; elevation: number }[] {
  const points = [
    ...anchors,
    ...climbs.map((climb) => ({
      distance: climb.approximateKm,
      elevation: climb.summitElevationM,
    })),
  ]
    .sort((a, b) => a.distance - b.distance)
    .filter((point, index, all) => index === 0 || point.distance !== all[index - 1].distance);

  const result: { distance: number; elevation: number }[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i];
    const to = points[i + 1];
    const steps = Math.max(1, Math.round((to.distance - from.distance) * 3));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      result.push({
        distance: Math.round((from.distance + (to.distance - from.distance) * t) * 10) / 10,
        elevation: Math.round(from.elevation + (to.elevation - from.elevation) * t),
      });
    }
  }
  return result;
}

export const stages: Stage[] = [
  // ─────────────────────────────────────────────
  // Stage 1: Lienz → Sillian
  // ─────────────────────────────────────────────
  {
    id: "stage-1",
    stageNumber: 1,
    start: "Lienz, Austria",
    finish: "Sillian, Austria",
    distanceKm: 114,
    distanceMi: 71,
    elevationM: 1933,
    elevationFt: 6342,
    difficultyScore: 5,
    badge: "Opening Day",
    badgeColor: "blue",
    summary: `The race kicks off in Lienz and starts climbing almost immediately. The first half of the stage builds toward Staller Sattel (Colle della Croce), the high point at about km 55, before a long descent and rolling return toward Sillian.`,
    estimatedTime: "4 h 45 min – 6 h 30 min",
    mainRisk: `Going too hard before Staller Sattel. The climbing starts early, and the pass is exposed at ~2,052 m before a long descent and a substantial second half still left to ride.`,
    pacingAdvice: `Use the opening kilometers to settle in, not to chase. Keep Staller Sattel controlled through km 55, eat before the summit, and stay sharp on the long descent. The stage is not over when the main climb is done.`,
    gpxFile: "/gpx/TT-2026 01 Lienz-Sillian_TRACK.gpx",
    routeCoordinates: estimatedRoute([46.8289, 12.7689], [[46.8876, 12.1993]], [46.7530, 12.6480]),
    startCoord: [46.8289, 12.7689],
    finishCoord: [46.7530, 12.6480],
    climbs: [
      {
        name: "Staller Sattel (Colle della Croce)",
        approximateLatLng: [46.8876, 12.1993],
        approximateKm: 55,
        summitElevationM: 2052,
        lengthKm: 17,
        maxGradient: 12,
        whyFamous: `The stage high point at ~2,052 m, reached around km 55 after a long early ascent. It is exposed and weather-sensitive, with a long descent after the summit.`,
      },
    ],
    elevationProfile: estimatedProfile(114, [
      { distance: 0, elevation: 673 },
      { distance: 55, elevation: 900 },
      { distance: 82, elevation: 1380 },
      { distance: 114, elevation: 1100 },
    ], [
      { name: "Staller Sattel (Colle della Croce)", approximateLatLng: [46.8876, 12.1993], approximateKm: 55, summitElevationM: 2052, lengthKm: 17, maxGradient: 12, whyFamous: "" },
    ]),
  },

  // ─────────────────────────────────────────────
  // Stage 2: Sillian → Falcade  (QUEEN STAGE)
  // ─────────────────────────────────────────────
  {
    id: "stage-2",
    stageNumber: 2,
    start: "Sillian, Austria",
    finish: "Falcade, Italy",
    distanceKm: 134,
    distanceMi: 84,
    elevationM: 3296,
    elevationFt: 10814,
    difficultyScore: 10,
    badge: "Queen Stage",
    badgeColor: "red",
    summary: `The queen stage stacks the biggest climbing load of the race into 84 miles. Passo Giau crests early in the second half at about km 63, followed by Staulanza, Duran, and the final climb through Val Biois into Falcade.`,
    estimatedTime: "6 h 30 min – 9 h 00 min",
    mainRisk: `Over-spending on Giau and then carrying that damage through three more climbs. The low point comes late, around km 117, so fueling mistakes can show up brutally on the final climb into Falcade.`,
    pacingAdvice: `This is an "eat before you're hungry, drink before you're thirsty" day. Keep Giau controlled, reset on the descent, and ride Staulanza and Duran below threshold. Save enough food and focus for the last 17 km climb to Falcade.`,
    gpxFile: "/gpx/TT-2026 02 Sillian-Falcade_TRACK.gpx",
    routeCoordinates: estimatedRoute([46.7530, 12.6480], [
      [46.4825, 12.0537],
      [46.4205, 12.1038],
      [46.3238, 12.0953],
      [46.3597, 11.8841],
    ], [46.2500, 11.8700]),
    startCoord: [46.7530, 12.6480],
    finishCoord: [46.2500, 11.8700],
    climbs: [
      {
        name: "Passo Giau",
        approximateLatLng: [46.4825, 12.0537],
        approximateKm: 63,
        summitElevationM: 2237,
        lengthKm: 17,
        maxGradient: 14,
        whyFamous: `The stage high point at ~2,237 m, reached around km 63 after roughly 995 m of climbing from the segment start. It is the decisive early test, but not the end of the day's climbing.`,
      },
      {
        name: "Passo Staulanza",
        approximateLatLng: [46.4205, 12.1038],
        approximateKm: 83,
        summitElevationM: 1773,
        lengthKm: 11,
        maxGradient: 10,
        whyFamous: `A quieter Dolomite pass that comes after Giau with little room to fully recover. The GPX segment climbs about 400 m from km 72.5 to km 83.`,
      },
      {
        name: "Passo Duran",
        approximateLatLng: [46.3238, 12.0953],
        approximateKm: 104,
        summitElevationM: 1601,
        lengthKm: 10,
        maxGradient: 13,
        whyFamous: `The third named pass of the stage, cresting around km 104. It is not the finish climb, but it can decide how much you have left for the late valley low point and final rise to Falcade.`,
      },
      {
        name: "Val Biois / Falcade",
        approximateLatLng: [46.3597, 11.8841],
        approximateKm: 134,
        summitElevationM: 1152,
        lengthKm: 17,
        maxGradient: 9,
        whyFamous: `The final climb of the queen stage, rising from the low point near km 117 into Falcade. It is less famous than the passes, but it comes when fatigue and fueling errors are most expensive.`,
      },
    ],
    elevationProfile: estimatedProfile(134, [
      { distance: 0, elevation: 1100 },
      { distance: 22, elevation: 1000 },
      { distance: 56, elevation: 800 },
      { distance: 88, elevation: 1180 },
      { distance: 104, elevation: 1050 },
      { distance: 124, elevation: 820 },
      { distance: 134, elevation: 1145 },
    ], [
      { name: "Passo Giau", approximateLatLng: [46.4825, 12.0537], approximateKm: 63, summitElevationM: 2237, lengthKm: 17, maxGradient: 14, whyFamous: "" },
      { name: "Passo Staulanza", approximateLatLng: [46.4205, 12.1038], approximateKm: 83, summitElevationM: 1773, lengthKm: 11, maxGradient: 10, whyFamous: "" },
      { name: "Passo Duran", approximateLatLng: [46.3238, 12.0953], approximateKm: 104, summitElevationM: 1601, lengthKm: 10, maxGradient: 13, whyFamous: "" },
      { name: "Val Biois / Falcade", approximateLatLng: [46.3597, 11.8841], approximateKm: 134, summitElevationM: 1152, lengthKm: 17, maxGradient: 9, whyFamous: "" },
    ]),
  },

  // ─────────────────────────────────────────────
  // Stage 3: Falcade → San Martino di Castrozza
  // ─────────────────────────────────────────────
  {
    id: "stage-3",
    stageNumber: 3,
    start: "Falcade, Italy",
    finish: "San Martino di Castrozza, Italy",
    distanceKm: 47,
    distanceMi: 29,
    elevationM: 1727,
    elevationFt: 5666,
    difficultyScore: 8,
    badge: "Short but Savage",
    badgeColor: "orange",
    summary: `Don't let the 29 miles fool you. This compressed stage drops briefly out of Falcade, then climbs Passo Valles to the stage high point near km 25 before Passo Rolle and the final run into San Martino di Castrozza.`,
    estimatedTime: "2 h 30 min – 4 h 00 min",
    mainRisk: `Accumulated fatigue from Stage 2 (Queen Stage) hitting you hard on the very first climb. Riders who went too deep on Stage 2 will crack here.`,
    pacingAdvice: `After the queen stage, your legs will feel the first real climb immediately after the short opening drop. Keep Valles controlled, recover on the descent, and leave enough for Rolle and the final kilometers into San Martino.`,
    gpxFile: "/gpx/TT-2026 03 Falcade-San_Martino_TRACK.gpx",
    routeCoordinates: estimatedRoute([46.2500, 11.8700], [
      [46.3386, 11.8013],
      [46.2962, 11.7872],
    ], [46.2600, 11.7900]),
    startCoord: [46.2500, 11.8700],
    finishCoord: [46.2600, 11.7900],
    climbs: [
      {
        name: "Passo Valles",
        approximateLatLng: [46.3386, 11.8013],
        approximateKm: 25,
        summitElevationM: 2035,
        lengthKm: 14,
        maxGradient: 11,
        whyFamous: `A beautiful and steep pass connecting the Val di Fassa valley to the San Pellegrino area. Quiet roads and big views make it a Dolomite favorite.`,
      },
      {
        name: "Passo Rolle",
        approximateLatLng: [46.2962, 11.7872],
        approximateKm: 39,
        summitElevationM: 1972,
        lengthKm: 8,
        maxGradient: 10,
        whyFamous: `The classic gateway to the Pale di San Martino massif. A Giro d'Italia regular, Rolle sits near 1,972 m on this GPX track with dramatic views of the pale, jagged Dolomite towers above the finish valley.`,
      },
    ],
    elevationProfile: estimatedProfile(47, [
      { distance: 0, elevation: 1145 },
      { distance: 10, elevation: 1500 },
      { distance: 28, elevation: 1300 },
      { distance: 47, elevation: 1450 },
    ], [
      { name: "Passo Valles", approximateLatLng: [46.3386, 11.8013], approximateKm: 25, summitElevationM: 2035, lengthKm: 14, maxGradient: 11, whyFamous: "" },
      { name: "Passo Rolle", approximateLatLng: [46.2962, 11.7872], approximateKm: 39, summitElevationM: 1972, lengthKm: 8, maxGradient: 10, whyFamous: "" },
    ]),
  },

  // ─────────────────────────────────────────────
  // Stage 4: San Martino → Possagno
  // ─────────────────────────────────────────────
  {
    id: "stage-4",
    stageNumber: 4,
    start: "San Martino di Castrozza, Italy",
    finish: "Possagno, Italy",
    distanceKm: 141,
    distanceMi: 88,
    elevationM: 3265,
    elevationFt: 10712,
    difficultyScore: 9,
    badge: "Monte Grappa Day 1",
    badgeColor: "red",
    summary: `A monster long day that leaves San Martino with early climbing over Passo Gobbera and Passo Brocon before a long transition toward Monte Grappa. The Grappa ascent crests around km 111, then the route drops hard toward Possagno.`,
    estimatedTime: "6 h 30 min – 8 h 30 min",
    mainRisk: `Treating the early Gobbera/Brocon work as harmless and arriving at Monte Grappa under-fueled. The longest stage still has a major 27 km Grappa segment before a long descent to the finish.`,
    pacingAdvice: `Fuel aggressively from km 0 and keep the first two climbs below threshold. Use the middle of the stage to eat and reset. Ride Monte Grappa as a controlled endurance climb, then stay conservative on the long descent toward Possagno.`,
    gpxFile: "/gpx/TT-2026 04 San Martino-Possagno_TRACK.gpx",
    routeCoordinates: estimatedRoute([46.2600, 11.7900], [
      [46.1477, 11.7583],
      [46.1072, 11.6452],
      [45.8682, 11.8002],
    ], [45.8700, 11.7100]),
    startCoord: [46.2600, 11.7900],
    finishCoord: [45.8700, 11.7100],
    climbs: [
      {
        name: "Passo Gobbera",
        approximateLatLng: [46.1477, 11.7583],
        approximateKm: 24,
        summitElevationM: 984,
        lengthKm: 7,
        maxGradient: 10,
        whyFamous: `The first named climb of the day, cresting around km 24 after the route leaves San Martino. It is shorter than the later climbs but starts the fatigue load early.`,
      },
      {
        name: "Passo Brocon",
        approximateLatLng: [46.1072, 11.6452],
        approximateKm: 49,
        summitElevationM: 1631,
        lengthKm: 21,
        maxGradient: 11,
        whyFamous: `The bigger early climb, gaining roughly 870 m before km 49. It makes this stage hard well before Monte Grappa appears.`,
      },
      {
        name: "Monte Grappa",
        approximateLatLng: [45.8682, 11.8002],
        approximateKm: 111,
        summitElevationM: 1671,
        lengthKm: 28,
        maxGradient: 14,
        whyFamous: `Monte Grappa is one of the most historically charged climbs in cycling, a WWI battleground with a monumental summit area. On this route it is the late-stage giant, gaining about 1,340 m before the long descent to Possagno.`,
      },
    ],
    elevationProfile: estimatedProfile(141, [
      { distance: 0, elevation: 1450 },
      { distance: 30, elevation: 760 },
      { distance: 78, elevation: 400 },
      { distance: 110, elevation: 600 },
      { distance: 141, elevation: 480 },
    ], [
      { name: "Passo Gobbera", approximateLatLng: [46.1477, 11.7583], approximateKm: 24, summitElevationM: 984, lengthKm: 7, maxGradient: 10, whyFamous: "" },
      { name: "Passo Brocon", approximateLatLng: [46.1072, 11.6452], approximateKm: 49, summitElevationM: 1631, lengthKm: 21, maxGradient: 11, whyFamous: "" },
      { name: "Monte Grappa", approximateLatLng: [45.8682, 11.8002], approximateKm: 111, summitElevationM: 1671, lengthKm: 28, maxGradient: 14, whyFamous: "" },
    ]),
  },

  // ─────────────────────────────────────────────
  // Stage 5: Possagno → Semonzo
  // ─────────────────────────────────────────────
  {
    id: "stage-5",
    stageNumber: 5,
    start: "Possagno, Italy",
    finish: "Semonzo, Italy",
    distanceKm: 100,
    distanceMi: 62,
    elevationM: 2305,
    elevationFt: 7562,
    difficultyScore: 8,
    badge: "Grappa Revenge",
    badgeColor: "orange",
    summary: `Monte Grappa is climbed again, this time as the dominant middle act of the stage. After the early descent and valley section, the route rises from around km 47 to the Grappa high point near km 72 before descending toward Semonzo.`,
    estimatedTime: "4 h 30 min – 6 h 30 min",
    mainRisk: `Accumulated fatigue from four previous days of racing. Grappa on fresh legs is hard. Grappa on day 5 is a completely different animal. Nutrition failure or dehydration are major threats.`,
    pacingAdvice: `Day 5 is about surviving, not racing. Eat through the early low section, start Grappa patiently around km 47, and keep the effort steady until the high point near km 72. Save focus for the descent to Semonzo.`,
    gpxFile: "/gpx/TT-2026 05 Possagno-Semonzo_TRACK.gpx",
    routeCoordinates: estimatedRoute([45.8700, 11.7100], [[45.8685, 11.8005]], [45.8780, 11.7200]),
    startCoord: [45.8700, 11.7100],
    finishCoord: [45.8780, 11.7200],
    climbs: [
      {
        name: "Monte Grappa",
        approximateLatLng: [45.8685, 11.8005],
        approximateKm: 72,
        summitElevationM: 1674,
        lengthKm: 25,
        maxGradient: 13,
        whyFamous: `The second consecutive day on Monte Grappa. This GPX segment gains roughly 1,480 m over about 25 km, making it the clear physical center of the stage.`,
      },
    ],
    elevationProfile: estimatedProfile(100, [
      { distance: 0, elevation: 480 },
      { distance: 25, elevation: 650 },
      { distance: 45, elevation: 900 },
      { distance: 82, elevation: 700 },
      { distance: 100, elevation: 300 },
    ], [
      { name: "Monte Grappa", approximateLatLng: [45.8685, 11.8005], approximateKm: 72, summitElevationM: 1674, lengthKm: 25, maxGradient: 13, whyFamous: "" },
    ]),
  },

  // ─────────────────────────────────────────────
  // Stage 6: Semonzo → Lavarone
  // ─────────────────────────────────────────────
  {
    id: "stage-6",
    stageNumber: 6,
    start: "Semonzo, Italy",
    finish: "Lavarone, Italy",
    distanceKm: 125,
    distanceMi: 78,
    elevationM: 2803,
    elevationFt: 9196,
    difficultyScore: 8,
    badge: "Penultimate Grind",
    badgeColor: "orange",
    summary: `Leaving the Grappa massif, the route climbs early onto the Altopiano di Asiago, then later tackles the long rise to Passo Vezzena. The high point comes near km 100 before the final run across the Lavarone plateau.`,
    estimatedTime: "5 h 30 min – 7 h 30 min",
    mainRisk: `Day 6 fatigue makes the long climb to Vezzena easy to misjudge. The stage high point is near km 100, so the hard work is later than the first plateau climb suggests.`,
    pacingAdvice: `Ride the early Asiago climb at endurance pace, then use the middle kilometers to fuel. Save your most disciplined climbing for Passo Vezzena from km 77 to km 100, and keep eating before the final run to Lavarone.`,
    gpxFile: "/gpx/TT-2026 06 Semonzo-Lavarone_TRACK.gpx",
    routeCoordinates: estimatedRoute([45.8780, 11.7200], [
      [45.8978, 11.6304],
      [45.8750, 11.3083],
    ], [45.9000, 11.2600]),
    startCoord: [45.8780, 11.7200],
    finishCoord: [45.9000, 11.2600],
    climbs: [
      {
        name: "Altopiano di Asiago",
        approximateLatLng: [45.8978, 11.6304],
        approximateKm: 34,
        summitElevationM: 1084,
        lengthKm: 15,
        maxGradient: 9,
        whyFamous: `The first major climb onto the Asiago plateau, gaining about 925 m by km 34. It sets up the long, tiring middle of the penultimate stage.`,
      },
      {
        name: "Passo Vezzena",
        approximateLatLng: [45.8750, 11.3083],
        approximateKm: 100,
        summitElevationM: 1545,
        lengthKm: 23,
        maxGradient: 10,
        whyFamous: `The late-stage high point and the decisive climb into the Lavarone area. The GPX segment gains roughly 1,240 m from km 77 to km 100.`,
      },
    ],
    elevationProfile: estimatedProfile(125, [
      { distance: 0, elevation: 300 },
      { distance: 25, elevation: 800 },
      { distance: 78, elevation: 1040 },
      { distance: 96, elevation: 950 },
      { distance: 125, elevation: 1150 },
    ], [
      { name: "Altopiano di Asiago", approximateLatLng: [45.8978, 11.6304], approximateKm: 34, summitElevationM: 1084, lengthKm: 15, maxGradient: 9, whyFamous: "" },
      { name: "Passo Vezzena", approximateLatLng: [45.8750, 11.3083], approximateKm: 100, summitElevationM: 1545, lengthKm: 23, maxGradient: 10, whyFamous: "" },
    ]),
  },

  // ─────────────────────────────────────────────
  // Stage 7: Lavarone → Riva del Garda (FINAL)
  // ─────────────────────────────────────────────
  {
    id: "stage-7",
    stageNumber: 7,
    start: "Lavarone, Italy",
    finish: "Riva del Garda, Italy",
    distanceKm: 85,
    distanceMi: 53,
    elevationM: 1851,
    elevationFt: 6073,
    difficultyScore: 6,
    badge: "Final Day",
    badgeColor: "purple",
    summary: `The final stage starts high, drops away from Lavarone, then saves its main climb for Passo Bordala from about km 40 to km 59. After that, the route trends down toward Lake Garda and the finish in Riva del Garda.`,
    estimatedTime: "4 h 00 min – 5 h 30 min",
    mainRisk: `Mentally checking out before Bordala or rushing the long descent toward Garda. The final named climb still gains over 1,000 m before the lake run-in.`,
    pacingAdvice: `This is your victory lap, but keep the effort disciplined until Bordala is done. Climb conservatively from km 40 to km 59, then descend with margin all the way toward Riva. Get to the lakefront in one piece.`,
    gpxFile: "/gpx/TT-2026 07 Lavarone-Riva_TRACK.gpx",
    routeCoordinates: estimatedRoute([45.9000, 11.2600], [
      [45.9074, 10.9779],
    ], [45.8800, 10.8400]),
    startCoord: [45.9000, 11.2600],
    finishCoord: [45.8800, 10.8400],
    climbs: [
      {
        name: "Passo Bordala",
        approximateLatLng: [45.9074, 10.9779],
        approximateKm: 59,
        summitElevationM: 1251,
        lengthKm: 18,
        maxGradient: 11,
        whyFamous: `The final major climb of the race, rising from low elevation near km 40 to about 1,251 m near km 59. Once Bordala is done, the route trends toward the Lake Garda finish.`,
      },
    ],
    elevationProfile: estimatedProfile(85, [
      { distance: 0, elevation: 1150 },
      { distance: 28, elevation: 900 },
      { distance: 56, elevation: 700 },
      { distance: 72, elevation: 300 },
      { distance: 85, elevation: 65 },
    ], [
      { name: "Passo Bordala", approximateLatLng: [45.9074, 10.9779], approximateKm: 59, summitElevationM: 1251, lengthKm: 18, maxGradient: 11, whyFamous: "" },
    ]),
  },
];

// ─────────────────────────────────────────────
// Derived totals
// ─────────────────────────────────────────────
export const raceTotals = {
  totalKm: stages.reduce((s, st) => s + st.distanceKm, 0),
  totalMi: stages.reduce((s, st) => s + st.distanceMi, 0),
  totalElevationM: stages.reduce((s, st) => s + st.elevationM, 0),
  totalElevationFt: stages.reduce((s, st) => s + st.elevationFt, 0),
  queenStage: stages.find((s) => s.badge === "Queen Stage")!,
  hardestStage: stages.reduce((a, b) => (b.difficultyScore > a.difficultyScore ? b : a)),
  biggestFatigueRisk: stages[3], // Stage 4: longest + most climbing after 3 hard days
};
