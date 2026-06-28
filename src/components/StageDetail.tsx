import React, { useState } from "react";
import { DifficultyBadge } from "./DifficultyBadge";
import { DifficultyBar } from "./DifficultyBar";
import { ElevationProfile } from "./ElevationProfile";
import { StageVideos } from "./StageVideos";
import type { GpxStatus, StageWithGpx } from "../hooks/useGpxStages";
import { useUnits } from "../context/UnitsContext";
import { raceTotals, stages } from "../data/stages";

interface Props {
  stage: StageWithGpx;
}

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">
    {children}
  </p>
);

const InfoCard: React.FC<{
  label: string;
  value: string;
  sub?: string;
  icon?: string;
}> = ({ label, value, sub, icon }) => (
  <div className="bg-white/5 rounded-lg px-3 py-2.5 border border-white/10">
    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">
      {label}
    </p>
    <p className="text-base font-bold text-white leading-tight">
      {icon && <span className="mr-1">{icon}</span>}
      {value}
    </p>
    {sub && <p className="text-xs text-white/40 mt-0.5">{sub}</p>}
  </div>
);

const stageRank = (stage: StageWithGpx) => {
  const sorted = [...stages].sort(
    (a, b) => b.difficultyScore - a.difficultyScore,
  );
  return sorted.findIndex((candidate) => candidate.id === stage.id) + 1;
};

const difficultyContext = (stage: StageWithGpx) => {
  const rank = stageRank(stage);
  const totalStages = stages.length;

  if (stage.id === raceTotals.queenStage.id) {
    return `This is the hardest day of the tour: ranked ${rank} of ${totalStages} by difficulty score, with the biggest climbing load and queen-stage designation.`;
  }

  if (rank <= 3) {
    return `This is one of the hardest days of the tour: ranked ${rank} of ${totalStages} by difficulty score, so pacing and fueling matter almost as much as on the queen stage.`;
  }

  if (rank >= totalStages - 1) {
    return `This is one of the more manageable days on paper: ranked ${rank} of ${totalStages} by difficulty score, though accumulated fatigue can still make it demanding.`;
  }

  return `This sits in the middle of the tour's difficulty range: ranked ${rank} of ${totalStages} by difficulty score, hard enough to require discipline without being the queen-stage peak.`;
};

const climbContext = (stage: StageWithGpx) => {
  if (stage.climbs.length === 0) {
    return "No named climbs are currently listed for this stage; use the GPX profile for the detailed terrain.";
  }

  return stage.climbs
    .map((climb) => {
      const climbDetails = [
        `around km ${climb.approximateKm}`,
        `summit near ${climb.summitElevationM.toLocaleString()} m`,
        climb.lengthKm ? `about ${climb.lengthKm} km long` : null,
        climb.maxGradient ? `up to roughly ${climb.maxGradient}%` : null,
      ]
        .filter(Boolean)
        .join(", ");

      return `- ${climb.name}: ${climbDetails}. ${climb.whyFamous}`;
    })
    .join("\n");
};

const GPX_REPO_BASE_URL =
  "https://raw.githubusercontent.com/fbmattos/tour-transalp-2026/main/public";

const buildGpxUrl = (gpxFile: string) =>
  `${GPX_REPO_BASE_URL}${encodeURI(gpxFile)}`;

const buildKmlFile = (gpxFile: string) =>
  gpxFile.replace("/gpx/", "/kml/").replace(/\.gpx$/i, ".kml");

const fileNameFromPath = (filePath: string) =>
  filePath.split("/").at(-1) ?? filePath;

const buildStageClipboardContext = (stage: StageWithGpx) => {
  const gpxStats = stage.gpxStats
    ? `GPX-measured route: ${stage.gpxStats.totalDistanceKm.toLocaleString()} km, ${stage.gpxStats.totalElevationGainM.toLocaleString()} m gain, ${stage.gpxStats.pointCount.toLocaleString()} track points.`
    : "GPX-measured route statistics are not available yet.";

  return `Tour Transalp 2026 ride-planning context\n\nThis is Stage ${stage.stageNumber} of the seven-day Tour Transalp 2026 stage tour, a point-to-point Alpine road cycling event. The route for this stage goes from ${stage.start} to ${stage.finish}. ${difficultyContext(stage)}\n\nStage overview: ${stage.summary}\n\nOfficial stage stats: ${stage.distanceKm.toLocaleString()} km / ${stage.distanceMi.toLocaleString()} mi with ${stage.elevationM.toLocaleString()} m / ${stage.elevationFt.toLocaleString()} ft of climbing. Estimated riding time: ${stage.estimatedTime}. Difficulty score: ${stage.difficultyScore}/10 (${stage.badge}).\n\n${gpxStats}\n\nKey climbs and terrain:\n${climbContext(stage)}\n\nMain risk: ${stage.mainRisk}\n\nPacing advice: ${stage.pacingAdvice}\n\nPlease use this context and the linked GPX file to create a practical ride plan with pacing, fueling, hydration, climb-by-climb strategy, descent cautions, and contingency notes for weather/fatigue.\n\nGPX file link: ${buildGpxUrl(stage.gpxFile)}`;
};

const DataConfidence: React.FC<{ status?: GpxStatus }> = ({ status }) => (
  <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-2">
    <div className="rounded-lg bg-emerald-500/10 px-2 py-2">
      <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-300/80">
        Official
      </p>
      <p className="mt-1 text-[11px] leading-snug text-white/55">
        Distance, gain, towns
      </p>
    </div>
    <div className="rounded-lg bg-emerald-500/10 px-2 py-2">
      <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-300/80">
        GPX
      </p>
      <p className="mt-1 text-[11px] leading-snug text-white/55">
        {status === "loaded"
          ? "Route and profile loaded"
          : status === "error"
            ? "Load failed"
            : "Loading route/profile"}
      </p>
    </div>
    <div className="rounded-lg bg-white/5 px-2 py-2">
      <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">
        Curated
      </p>
      <p className="mt-1 text-[11px] leading-snug text-white/55">Climb notes</p>
    </div>
  </div>
);

export const StageDownloadButtons: React.FC<Props> = ({ stage }) => {
  const kmlFile = buildKmlFile(stage.gpxFile);

  const downloads = [
    {
      label: "Download GPX",
      href: stage.gpxFile,
      fileName: fileNameFromPath(stage.gpxFile),
    },
    {
      label: "Download KML",
      href: kmlFile,
      fileName: fileNameFromPath(kmlFile),
    },
  ];

  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      {downloads.map((download) => (
        <a
          key={download.label}
          href={download.href}
          download={download.fileName}
          className="rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-center text-xs font-bold text-white/75 transition hover:border-sky-300/60 hover:bg-sky-400/10 hover:text-sky-100"
        >
          {download.label}
        </a>
      ))}
    </div>
  );
};

export const StageContextCopyButton: React.FC<Props> = ({ stage }) => {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  const copyStageContext = async () => {
    try {
      await navigator.clipboard.writeText(buildStageClipboardContext(stage));
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2500);
    } catch {
      setCopyState("error");
    }
  };

  return (
    <button
      type="button"
      onClick={copyStageContext}
      className="mt-4 w-full rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-left transition hover:border-emerald-300 hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-white/35"
    >
      <span className="block text-sm font-bold text-emerald-100">
        {copyState === "copied"
          ? "Copied stage context!"
          : "Copy stage context to clipboard"}
      </span>
      <span className="mt-1 block text-xs text-white/50">
        {copyState === "error"
          ? "Clipboard access failed. Check browser permissions and try again."
          : "Includes route summary, difficulty context, climb notes, pacing risks, and a GitHub link to the GPX file."}
      </span>
    </button>
  );
};

export const StageDetail: React.FC<Props> = ({ stage }) => {
  const {
    formatDistance,
    formatElevation,
    formatDistanceMark,
    distanceUnit,
    distanceValue,
  } = useUnits();
  const [activeTab, setActiveTab] = useState<"overview" | "videos">("overview");

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 rounded-xl border border-white/10 bg-white/5 p-1">
        {[
          { id: "overview" as const, label: "Overview" },
          { id: "videos" as const, label: "Video" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              activeTab === tab.id
                ? "bg-emerald-400 text-slate-950"
                : "text-white/55 hover:bg-white/5 hover:text-white/75"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "videos" && <StageVideos stage={stage} />}

      {activeTab === "overview" && (
        <>
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white">
                {stage.stageNumber}
              </span>
              <div>
                <h2 className="text-lg font-bold text-white leading-tight">
                  {stage.start.split(",")[0]} → {stage.finish.split(",")[0]}
                </h2>
                <p className="text-xs text-white/40">
                  {stage.start} → {stage.finish}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DifficultyBadge badge={stage.badge} color={stage.badgeColor} />
              <DifficultyBar score={stage.difficultyScore} />
            </div>
            <StageContextCopyButton stage={stage} />
            <StageDownloadButtons stage={stage} />
          </div>

          {/* Key stats */}
          <div className="grid grid-cols-3 gap-2">
            <InfoCard
              label="Distance"
              value={formatDistance(stage.distanceKm, stage.distanceMi)}
              icon="↔"
            />
            <InfoCard
              label="Climbing"
              value={formatElevation(stage.elevationM, stage.elevationFt)}
              icon="↑"
            />
            <InfoCard
              label="Est. Time"
              value={stage.estimatedTime.split("–")[0].trim()}
              sub={`to ${stage.estimatedTime.split("–")[1]?.trim()}`}
              icon="⏱"
            />
          </div>

          <DataConfidence status={stage.gpxStatus} />

          {stage.gpxStats && (
            <div className="grid grid-cols-3 gap-2">
              <InfoCard
                label="GPX Distance"
                value={formatDistance(stage.gpxStats.totalDistanceKm)}
                sub="measured"
              />
              <InfoCard
                label="GPX Gain"
                value={formatElevation(stage.gpxStats.totalElevationGainM)}
                sub="measured"
              />
              <InfoCard
                label="GPX Points"
                value={stage.gpxStats.pointCount.toLocaleString()}
                sub={`${formatElevation(stage.gpxStats.minElevationM)} – ${formatElevation(stage.gpxStats.maxElevationM)}`}
              />
            </div>
          )}

          {stage.gpxStats?.steepestGrade && (
            <div className="rounded-xl border border-orange-500/25 bg-orange-500/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-orange-300/80">
                    Steepest Sustained Grade
                  </p>
                  <p className="mt-1 text-2xl font-black leading-none text-white">
                    {stage.gpxStats.steepestGrade.gradientPct}% for{" "}
                    {formatDistance(
                      stage.gpxStats.steepestGrade.distanceKm,
                      stage.gpxStats.steepestGrade.distanceMi,
                    )}
                  </p>
                </div>
                <div className="rounded-lg bg-white/5 px-3 py-2 text-right">
                  <p className="text-[10px] uppercase tracking-wider text-white/35">
                    Gain
                  </p>
                  <p className="text-sm font-bold text-orange-200">
                    {formatElevation(
                      stage.gpxStats.steepestGrade.elevationGainM,
                    )}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-xs text-white/45">
                GPX average from {distanceUnit}{" "}
                {distanceValue(
                  stage.gpxStats.steepestGrade.startDistanceKm,
                  1,
                ).toLocaleString()}{" "}
                to{" "}
                {distanceValue(
                  stage.gpxStats.steepestGrade.endDistanceKm,
                  1,
                ).toLocaleString()}{" "}
                using 0.5, 1, and 2 mi windows.
              </p>
            </div>
          )}

          {stage.gpxStatus === "error" && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-400/70 mb-1">
                GPX Load Error
              </p>
              <p className="text-sm text-white/70 leading-relaxed">
                {stage.gpxError}
              </p>
            </div>
          )}

          {/* Elevation profile */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-4">
            <ElevationProfile stage={stage} />
          </div>

          {/* Summary */}
          <div>
            <SectionLabel>Stage Summary</SectionLabel>
            <p className="text-sm text-white/70 leading-relaxed">
              {stage.summary}
            </p>
          </div>

          {/* Famous Climbs */}
          {stage.climbs.length > 0 && (
            <div>
              <SectionLabel>Famous Climbs</SectionLabel>
              <div className="flex flex-col gap-2">
                {stage.climbs.map((climb) => (
                  <div
                    key={climb.name}
                    className="bg-white/5 rounded-lg border border-white/10 p-3"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-emerald-300">
                        {climb.name}
                      </p>
                      <div className="flex gap-3 text-[10px] text-white/40 flex-shrink-0">
                        <span>{formatDistanceMark(climb.approximateKm)}</span>
                        <span>{formatElevation(climb.summitElevationM)}</span>
                      </div>
                    </div>
                    <div className="mb-2 flex gap-3 text-[10px] text-white/35">
                      <span>
                        {climb.lengthKm
                          ? `~${formatDistance(climb.lengthKm, undefined, 1)} climb`
                          : "length TBD"}
                      </span>
                      <span>
                        {climb.maxGradient
                          ? `~${climb.maxGradient}% max`
                          : "gradient TBD"}
                      </span>
                      <span>
                        {stage.gpxStatus === "loaded"
                          ? "GPX-aligned marker"
                          : "estimated marker"}
                      </span>
                    </div>
                    <p className="text-xs text-white/55 leading-relaxed">
                      {climb.whyFamous}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk + Pacing */}
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-red-500/10 rounded-xl border border-red-500/20 p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-400/70 mb-1">
                ⚠ Main Risk
              </p>
              <p className="text-sm text-white/70 leading-relaxed">
                {stage.mainRisk}
              </p>
            </div>
            <div className="bg-blue-500/10 rounded-xl border border-blue-500/20 p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400/70 mb-1">
                🎯 Pacing Advice
              </p>
              <p className="text-sm text-white/70 leading-relaxed">
                {stage.pacingAdvice}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
