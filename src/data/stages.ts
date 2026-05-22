// ============================================================
// Tour Transalp 2026 — Stage Data
// ============================================================
// Official today: distance, elevation gain, start/finish towns.
// Estimated until GPX release: route line, elevation profile shape, climb placement.
// Pending: official GPX tracks, exact climb distances/gradients, measured profiles.
// ============================================================

export interface Climb {
  name: string;
  approximateLatLng: [number, number];
  approximateKm: number;
  summitElevationM: number;
  lengthKm: number | null;       // Estimated until official GPX/climb data is available
  maxGradient: number | null;    // Estimated until official GPX/climb data is available
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
  floridaComparison: string;
  estimatedTime: string;
  mainRisk: string;
  pacingAdvice: string;
  // TODO: Replace with real GPX-derived coordinates
  routeCoordinates: [number, number][];
  startCoord: [number, number];
  finishCoord: [number, number];
  climbs: Climb[];
  // TODO: Replace with real GPX elevation profile data
  elevationProfile: { distance: number; elevation: number }[];
}

// ============================================================
// Estimated route/profile helpers
// TODO: Replace with official GPX-derived tracks and profiles when released
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
    summary: `The race kicks off in the historic Tyrolean town of Lienz with a long valley roll before the day's defining effort: the Staller Sattel (Colle della Croce), a remote and exposed pass straddling Austria and Italy. The descent into Sillian is fast and technical.`,
    floridaComparison: `Like a hard 70–85 mile Florida endurance ride ridden mostly upper Z2 / low Z3, except with a 1.5–2.5 hour continuous trainer climb in the middle of your ride.`,
    estimatedTime: "4 h 45 min – 6 h 30 min",
    mainRisk: `Underestimating the Staller Sattel climb after a long valley approach; arriving at the pass in bad weather (exposed at ~2,052 m).`,
    pacingAdvice: `Treat the first 60 km as active recovery. Resist the urge to push hard early. Save everything for the Staller Sattel — start it conservatively and settle into your climbing tempo. The descent is fast but rough.`,
    routeCoordinates: estimatedRoute([46.8289, 12.7689], [[46.9197, 13.1983]], [46.7530, 12.6480]),
    startCoord: [46.8289, 12.7689],
    finishCoord: [46.7530, 12.6480],
    climbs: [
      {
        name: "Staller Sattel (Colle della Croce)",
        approximateLatLng: [46.9197, 13.1983],
        approximateKm: 95,
        summitElevationM: 2052,
        lengthKm: 14,
        maxGradient: 12,
        whyFamous: `A remote, exposed pass at ~2,052 m on the Austrian-Italian border. Rarely visited by cycling tourists, it's a rugged classic that tests both legs and navigation. Often cold and windy at the top.`,
      },
    ],
    elevationProfile: estimatedProfile(114, [
      { distance: 0, elevation: 673 },
      { distance: 55, elevation: 900 },
      { distance: 82, elevation: 1380 },
      { distance: 114, elevation: 1100 },
    ], [
      { name: "Staller Sattel (Colle della Croce)", approximateLatLng: [46.9197, 13.1983], approximateKm: 95, summitElevationM: 2052, lengthKm: 14, maxGradient: 12, whyFamous: "" },
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
    summary: `The brutalist centerpiece of the race. From Sillian the route dips into the Dolomites and never relents — four major passes stacked across 84 miles. Passo Cimabanche, Passo Giau (the monster at 2,233 m), Passo Staulanza, and Passo Duran all feature. Giau alone can destroy poorly paced riders. This is the stage the race is decided on.`,
    floridaComparison: `Not really comparable to Florida. The closest equivalent is doing 3 separate indoor climbing workouts back-to-back during a 7–9 hour ride, with long stretches at tempo/sweet spot and almost no real recovery between them.`,
    estimatedTime: "6 h 30 min – 9 h 00 min",
    mainRisk: `Going too hard on Cimabanche and Giau, arriving at Staulanza and Duran completely cooked. Bonking on the last two climbs is a near-certainty if you don't pace aggressively early.`,
    pacingAdvice: `This is an "eat before you're hungry, drink before you're thirsty" day. Cap effort on every climb except the last. Giau should feel uncomfortable but sustainable. If Giau feels easy, you will pay on Duran. Carry extra food.`,
    routeCoordinates: estimatedRoute([46.7530, 12.6480], [
      [46.5960, 12.2780],
      [46.4833, 12.0553],
      [46.3850, 11.9780],
      [46.2900, 11.9600],
    ], [46.2500, 11.8700]),
    startCoord: [46.7530, 12.6480],
    finishCoord: [46.2500, 11.8700],
    climbs: [
      {
        name: "Passo Cimabanche",
        approximateLatLng: [46.5960, 12.2780],
        approximateKm: 38,
        summitElevationM: 1530,
        lengthKm: 18,
        maxGradient: 8,
        whyFamous: `A long but steady Dolomite pass linking Cortina d'Ampezzo to the Pusteria valley. Often used as a "warm-up" pass in stage races, but at 1,530 m it sets a demanding early tone for the day.`,
      },
      {
        name: "Passo Giau",
        approximateLatLng: [46.4833, 12.0553],
        approximateKm: 75,
        summitElevationM: 2233,
        lengthKm: 10,
        maxGradient: 14,
        whyFamous: `One of the most feared climbs in the Dolomites at 2,233 m. Brutal average gradient, exposed lunar landscape near the top, and stunning views. Featured prominently in the Giro d'Italia multiple times. A genuine queen-stage maker.`,
      },
      {
        name: "Passo Staulanza",
        approximateLatLng: [46.3850, 11.9780],
        approximateKm: 96,
        summitElevationM: 1766,
        lengthKm: 12,
        maxGradient: 10,
        whyFamous: `A quieter but consistently steep Dolomite pass through the Val Fiorentina. Comes after Giau and acts as the "suffering lottery" — if your legs survived Giau, Staulanza reveals the truth.`,
      },
      {
        name: "Passo Duran",
        approximateLatLng: [46.2900, 11.9600],
        approximateKm: 112,
        summitElevationM: 1601,
        lengthKm: 8,
        maxGradient: 13,
        whyFamous: `The final pass of the queen stage at ~1,601 m. A narrow, remote forest road that separates the survivors from the casualties. Historically underestimated because it's "just" the fourth pass of the day.`,
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
      { name: "Passo Cimabanche", approximateLatLng: [46.5960, 12.2780], approximateKm: 38, summitElevationM: 1530, lengthKm: 18, maxGradient: 8, whyFamous: "" },
      { name: "Passo Giau", approximateLatLng: [46.4833, 12.0553], approximateKm: 75, summitElevationM: 2233, lengthKm: 10, maxGradient: 14, whyFamous: "" },
      { name: "Passo Staulanza", approximateLatLng: [46.3850, 11.9780], approximateKm: 96, summitElevationM: 1766, lengthKm: 12, maxGradient: 10, whyFamous: "" },
      { name: "Passo Duran", approximateLatLng: [46.2900, 11.9600], approximateKm: 112, summitElevationM: 1601, lengthKm: 8, maxGradient: 13, whyFamous: "" },
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
    summary: `Don't let the 29 miles fool you. This compressed stage features Passo Valles and Passo Rolle back-to-back with almost zero flat recovery between them. The stage finishes in the stunning Pale di San Martino resort area. Short total time, but almost every meter is either climbing or a fast technical descent.`,
    floridaComparison: `Like a brutal 2.5–4 hour climbing session on a trainer with almost no flat sections — sustained pressure on the pedals from the very first kilometer. Florida has nothing like this.`,
    estimatedTime: "2 h 30 min – 4 h 00 min",
    mainRisk: `Accumulated fatigue from Stage 2 (Queen Stage) hitting you hard on the very first climb. Riders who went too deep on Stage 2 will crack here.`,
    pacingAdvice: `After the queen stage, your legs will feel the opening climbs immediately. Go easy for the first 10 km. Passo Valles is steeper than it looks from the profile — if you're spinning easy and breathing hard, that's correct. Save something for Rolle, which finishes the stage.`,
    routeCoordinates: estimatedRoute([46.2500, 11.8700], [
      [46.2850, 11.8050],
      [46.3020, 11.7870],
    ], [46.2600, 11.7900]),
    startCoord: [46.2500, 11.8700],
    finishCoord: [46.2600, 11.7900],
    climbs: [
      {
        name: "Passo Valles",
        approximateLatLng: [46.2850, 11.8050],
        approximateKm: 20,
        summitElevationM: 2033,
        lengthKm: 13,
        maxGradient: 11,
        whyFamous: `A beautiful and steep pass connecting the Val di Fassa valley to the San Pellegrino area. Quiet roads and big views make it a Dolomite favorite.`,
      },
      {
        name: "Passo Rolle",
        approximateLatLng: [46.3020, 11.7870],
        approximateKm: 38,
        summitElevationM: 1984,
        lengthKm: 9,
        maxGradient: 10,
        whyFamous: `The classic gateway to the Pale di San Martino massif. A Giro d'Italia regular, Rolle sits at 1,984 m with dramatic views of the pale, jagged Dolomite towers above the finish valley.`,
      },
    ],
    elevationProfile: estimatedProfile(47, [
      { distance: 0, elevation: 1145 },
      { distance: 10, elevation: 1500 },
      { distance: 28, elevation: 1300 },
      { distance: 47, elevation: 1450 },
    ], [
      { name: "Passo Valles", approximateLatLng: [46.2850, 11.8050], approximateKm: 20, summitElevationM: 2033, lengthKm: 13, maxGradient: 11, whyFamous: "" },
      { name: "Passo Rolle", approximateLatLng: [46.3020, 11.7870], approximateKm: 38, summitElevationM: 1984, lengthKm: 9, maxGradient: 10, whyFamous: "" },
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
    summary: `A monster long day that leaves the Dolomites and enters the Veneto pre-Alps. Passo Croce d'Aune starts the final push before Monte Grappa from the remote Caupo side — one of its lesser-known but consistently brutal ascents. The finish in Possagno (at the foot of Grappa) signals tomorrow's rematch.`,
    floridaComparison: `Like doing a full-gas 90–100 mile Florida ride, then adding 10,000+ ft of climbing on top. By the final climb, endurance fatigue becomes the real enemy — legs feel fine but the engine is cooked.`,
    estimatedTime: "6 h 30 min – 8 h 30 min",
    mainRisk: `This is the longest stage by mileage. Underestimating the fatigue accumulation. Monte Grappa from Caupo is exposed and long — many riders blow up here from going too hard early in the stage.`,
    pacingAdvice: `Fuel aggressively from km 0. Save your best effort for the last 30 km including Monte Grappa. Everything before that is just transport. Do NOT chase groups on the descent from Croce d'Aune.`,
    routeCoordinates: estimatedRoute([46.2600, 11.7900], [
      [46.0800, 11.7620],
      [45.8580, 11.7850],
    ], [45.8700, 11.7100]),
    startCoord: [46.2600, 11.7900],
    finishCoord: [45.8700, 11.7100],
    climbs: [
      {
        name: "Passo Croce d'Aune",
        approximateLatLng: [46.0800, 11.7620],
        approximateKm: 55,
        summitElevationM: 1011,
        lengthKm: 10,
        maxGradient: 10,
        whyFamous: `A historically significant pass in the Veneto pre-Alps, linking the Feltrino valley to Pedavena. Popular in local sportives and used as a stepping stone to Monte Grappa.`,
      },
      {
        name: "Monte Grappa (Caupo side)",
        approximateLatLng: [45.8580, 11.7850],
        approximateKm: 128,
        summitElevationM: 1775,
        lengthKm: 24,
        maxGradient: 14,
        whyFamous: `Monte Grappa is one of the most historically charged climbs in cycling — a WWI battleground with a monumental ossuary at the summit. The Caupo side is rarely used in races, making it a true "insider" ascent. Long, unrelenting, and exposed near the top.`,
      },
    ],
    elevationProfile: estimatedProfile(141, [
      { distance: 0, elevation: 1450 },
      { distance: 30, elevation: 760 },
      { distance: 78, elevation: 400 },
      { distance: 110, elevation: 600 },
      { distance: 141, elevation: 480 },
    ], [
      { name: "Passo Croce d'Aune", approximateLatLng: [46.0800, 11.7620], approximateKm: 55, summitElevationM: 1011, lengthKm: 10, maxGradient: 10, whyFamous: "" },
      { name: "Monte Grappa (Caupo side)", approximateLatLng: [45.8580, 11.7850], approximateKm: 128, summitElevationM: 1775, lengthKm: 24, maxGradient: 14, whyFamous: "" },
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
    summary: `Monte Grappa is climbed again — this time from a different flank. After 4 hard days in the legs, Grappa's remote and steep roads feel entirely different. The "revenge" nickname captures the feeling: yesterday Grappa humbled you, today you have to face it again on empty legs.`,
    floridaComparison: `Like racing the Pitbull TT the morning after a century ride, while repeatedly climbing at low cadence for 1–2 hours at a time. Your cardiovascular system is willing but your legs have nothing left.`,
    estimatedTime: "4 h 30 min – 6 h 30 min",
    mainRisk: `Accumulated fatigue from four previous days of racing. Grappa on fresh legs is hard. Grappa on day 5 is a completely different animal. Nutrition failure or dehydration are major threats.`,
    pacingAdvice: `Day 5 is about surviving, not racing. Allow your body to warm up slowly. Eat real food at every opportunity. If Grappa starts badly, back off and ride tempo — the finish line is the only goal today.`,
    routeCoordinates: estimatedRoute([45.8700, 11.7100], [[45.8450, 11.7850]], [45.8780, 11.7200]),
    startCoord: [45.8700, 11.7100],
    finishCoord: [45.8780, 11.7200],
    climbs: [
      {
        name: "Monte Grappa (alternate flank)",
        approximateLatLng: [45.8450, 11.7850],
        approximateKm: 65,
        summitElevationM: 1775,
        lengthKm: 22,
        maxGradient: 13,
        whyFamous: `The second consecutive day on Monte Grappa, approached from a different side. The ossuary at the summit commemorates over 22,000 WWI fallen soldiers. A climb that is as emotionally powerful as it is physically demanding.`,
      },
    ],
    elevationProfile: estimatedProfile(100, [
      { distance: 0, elevation: 480 },
      { distance: 25, elevation: 650 },
      { distance: 45, elevation: 900 },
      { distance: 82, elevation: 700 },
      { distance: 100, elevation: 300 },
    ], [
      { name: "Monte Grappa (alternate flank)", approximateLatLng: [45.8450, 11.7850], approximateKm: 65, summitElevationM: 1775, lengthKm: 22, maxGradient: 13, whyFamous: "" },
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
    summary: `Leaving the Grappa massif, the race climbs into the Altopiano di Asiago — the Seven Municipalities plateau — a broad, wooded highland plateau famous for WWI history. The Sette Comuni roads are rolling and exposed. The final climb to Lavarone via Passo del Sommo ends the day on another hilltop fortress of a finish.`,
    floridaComparison: `Like a very hard 6–7 hour Florida endurance day where your legs never fully recover between efforts and you keep getting forced into long, sustained tempo blocks. There's no flat spinning to shake the burn.`,
    estimatedTime: "5 h 30 min – 7 h 30 min",
    mainRisk: `Day 6 of 7. Deep fatigue means your pacing judgment is impaired. The plateau sections are deceptive — rolling roads at altitude feel easier than they are until you blow up on the final climb.`,
    pacingAdvice: `The Sette Comuni plateau is not recovery — it's a trap. Ride the rolling sections at a disciplined endurance pace. Save everything for the final 20 km to Lavarone. Eat a proper meal equivalent at the midpoint.`,
    routeCoordinates: estimatedRoute([45.8780, 11.7200], [
      [45.9800, 11.5100],
      [45.9100, 11.2700],
    ], [45.9000, 11.2600]),
    startCoord: [45.8780, 11.7200],
    finishCoord: [45.9000, 11.2600],
    climbs: [
      {
        name: "Sette Comuni Plateau (Altopiano di Asiago)",
        approximateLatLng: [45.9800, 11.5100],
        approximateKm: 58,
        summitElevationM: 1050,
        lengthKm: 28,
        maxGradient: 9,
        whyFamous: `The "Seven Municipalities" plateau above Asiago is a stunning high-altitude farming landscape with tragic WWI history. Roads across it are wide, exposed to weather, and rolly — more tiring than they look on a profile.`,
      },
      {
        name: "Passo del Sommo / Lavarone",
        approximateLatLng: [45.9100, 11.2700],
        approximateKm: 113,
        summitElevationM: 1340,
        lengthKm: 14,
        maxGradient: 10,
        whyFamous: `The final climb to the Lavarone lake plateau. A forested, steady ramp that ends the stage on a high perch above the Lagarina valley. Used occasionally in local races and beloved by cyclists for its views of the Adamello group.`,
      },
    ],
    elevationProfile: estimatedProfile(125, [
      { distance: 0, elevation: 300 },
      { distance: 25, elevation: 800 },
      { distance: 78, elevation: 1040 },
      { distance: 96, elevation: 950 },
      { distance: 125, elevation: 1150 },
    ], [
      { name: "Sette Comuni Plateau (Altopiano di Asiago)", approximateLatLng: [45.9800, 11.5100], approximateKm: 58, summitElevationM: 1050, lengthKm: 28, maxGradient: 9, whyFamous: "" },
      { name: "Passo del Sommo / Lavarone", approximateLatLng: [45.9100, 11.2700], approximateKm: 113, summitElevationM: 1340, lengthKm: 14, maxGradient: 10, whyFamous: "" },
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
    summary: `The final stage drops toward Lake Garda — one of the most iconic cycling destinations in Europe. Passo Bordala and the Santa Barbara climb provide the day's hard moments before the route plummets down to the azure waters of Garda. The finish in Riva del Garda is an emotional and visual reward for seven days of Alpine suffering.`,
    floridaComparison: `Like a hard 4–5 hour Florida ride after an entire training camp week. Physically hard, but the adrenaline of being on the final day, combined with the view of Lake Garda appearing below, provides energy that doesn't come from glycogen.`,
    estimatedTime: "4 h 00 min – 5 h 30 min",
    mainRisk: `Crashing on the fast descents to Garda — tired legs, worn tires, and impatience to reach the finish. The descent to Riva is long and technical.`,
    pacingAdvice: `This is your victory lap — but you still have to finish it. Climb conservatively one last time on Bordala and Santa Barbara. On the long descent to the lake, BRAKE EARLY on every corner. Get to the lakefront in one piece. Then celebrate properly.`,
    routeCoordinates: estimatedRoute([45.9000, 11.2600], [
      [45.9100, 11.0900],
      [45.9500, 10.9800],
    ], [45.8800, 10.8400]),
    startCoord: [45.9000, 11.2600],
    finishCoord: [45.8800, 10.8400],
    climbs: [
      {
        name: "Passo Bordala",
        approximateLatLng: [45.9100, 11.0900],
        approximateKm: 18,
        summitElevationM: 1250,
        lengthKm: 11,
        maxGradient: 11,
        whyFamous: `A narrow forested pass in the Trentino hills above Riva del Garda. Little-known outside the region but a reliable climb in local sportives. The descent gives the first glimpse of Lake Garda far below.`,
      },
      {
        name: "Santa Barbara",
        approximateLatLng: [45.9500, 10.9800],
        approximateKm: 43,
        summitElevationM: 1170,
        lengthKm: 7,
        maxGradient: 13,
        whyFamous: `A short, steep ramp named after a local chapel perched above the lake. The final proper climb of the race. Tradition says whoever crests this climb crying is doing it right.`,
      },
    ],
    elevationProfile: estimatedProfile(85, [
      { distance: 0, elevation: 1150 },
      { distance: 28, elevation: 900 },
      { distance: 56, elevation: 700 },
      { distance: 72, elevation: 300 },
      { distance: 85, elevation: 65 },
    ], [
      { name: "Passo Bordala", approximateLatLng: [45.9100, 11.0900], approximateKm: 18, summitElevationM: 1250, lengthKm: 11, maxGradient: 11, whyFamous: "" },
      { name: "Santa Barbara", approximateLatLng: [45.9500, 10.9800], approximateKm: 43, summitElevationM: 1170, lengthKm: 7, maxGradient: 13, whyFamous: "" },
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
