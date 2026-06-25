import { useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { stages } from "./data/stages";
import { SummaryHeader } from "./components/SummaryHeader";
import { StageCard } from "./components/StageCard";
import { StageContextCopyButton, StageDetail } from "./components/StageDetail";
import { RouteMap } from "./components/RouteMap";
import { ClimbDifficultySkyline } from "./components/ClimbDifficultySkyline";
import { useGpxStages } from "./hooks/useGpxStages";
import type { StageWithGpx } from "./hooks/useGpxStages";
import { DifficultyBadge } from "./components/DifficultyBadge";
import { DifficultyBar } from "./components/DifficultyBar";
import { ElevationProfile } from "./components/ElevationProfile";
import { AboutView } from "./components/AboutView";
import { StageVideos } from "./components/StageVideos";
import { UnitToggle, type UnitToggleVariant } from "./components/UnitToggle";
import { useUnits } from "./context/UnitsContext";
import { event } from "./data/event";

// TODO: Add cumulative fatigue chart across all 7 stages

// Three looks to compare — change this to 'segmented' | 'switch' | 'text'
// and the header toggle swaps live. See UnitToggle.tsx for the variants.
const UNIT_TOGGLE_VARIANT: UnitToggleVariant = "segmented";

type MobileView = "overview" | "map" | "profile" | "videos";
type AppView = "dashboard" | "about";

const mobileViews: { id: MobileView; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "map", label: "Map" },
  { id: "profile", label: "Profile" },
  { id: "videos", label: "Videos" },
];

const MobileStat: React.FC<{ label: string; value: string; sub?: string }> = ({
  label,
  value,
  sub,
}) => (
  <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
    <p className="text-[10px] uppercase tracking-wider text-white/40">
      {label}
    </p>
    <p className="mt-0.5 text-base font-bold leading-tight text-white">
      {value}
    </p>
    {sub && <p className="mt-0.5 text-xs text-white/40">{sub}</p>}
  </div>
);

const MobileOverview: React.FC<{ stage: StageWithGpx }> = ({ stage }) => {
  const { formatDistance, formatElevation, distanceUnit, distanceValue } =
    useUnits();
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
            {stage.stageNumber}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold leading-tight text-white">
              {stage.start.split(",")[0]} → {stage.finish.split(",")[0]}
            </h2>
            <p className="truncate text-xs text-white/40">
              {stage.start} → {stage.finish}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DifficultyBadge badge={stage.badge} color={stage.badgeColor} />
          <DifficultyBar score={stage.difficultyScore} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <MobileStat
          label="Distance"
          value={formatDistance(stage.distanceKm, stage.distanceMi)}
        />
        <MobileStat
          label="Climbing"
          value={formatElevation(stage.elevationM, stage.elevationFt)}
        />
        <MobileStat
          label="Time"
          value={stage.estimatedTime.split("–")[0].trim()}
          sub={`to ${stage.estimatedTime.split("–")[1]?.trim()}`}
        />
      </div>

      {stage.gpxStats?.steepestGrade && (
        <div className="rounded-xl border border-orange-500/25 bg-orange-500/10 p-4">
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
          <p className="mt-2 text-xs text-white/45">
            {distanceUnit}{" "}
            {distanceValue(
              stage.gpxStats.steepestGrade.startDistanceKm,
              1,
            ).toLocaleString()}{" "}
            to{" "}
            {distanceValue(
              stage.gpxStats.steepestGrade.endDistanceKm,
              1,
            ).toLocaleString()}
          </p>
        </div>
      )}

      <div>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/30">
          Stage Summary
        </p>
        <p className="text-sm leading-relaxed text-white/70">{stage.summary}</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-red-400/70">
            Main Risk
          </p>
          <p className="text-sm leading-relaxed text-white/70">
            {stage.mainRisk}
          </p>
        </div>
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-blue-400/70">
            Pacing Advice
          </p>
          <p className="text-sm leading-relaxed text-white/70">
            {stage.pacingAdvice}
          </p>
        </div>
      </div>

      <StageContextCopyButton stage={stage} />
    </div>
  );
};

export default function App() {
  const [selectedId, setSelectedId] = useState<string>(stages[0].id);
  const [showAll, setShowAll] = useState(false);
  const [activeMobileView, setActiveMobileView] =
    useState<MobileView>("overview");
  const [activeView, setActiveView] = useState<AppView>("dashboard");
  const gpxStages = useGpxStages(stages);
  const { formatDistance } = useUnits();

  const selectedStage = gpxStages.find((s) => s.id === selectedId)!;
  const routeStatus = (
    <>
      {showAll
        ? `All ${event.totalStages} stages`
        : `Stage ${selectedStage.stageNumber}: ${selectedStage.start.split(",")[0]} → ${selectedStage.finish.split(",")[0]}`}
      {selectedStage.gpxStatus === "loading" && " · loading GPX"}
      {selectedStage.gpxStatus === "loaded" &&
        ` · GPX ${selectedStage.gpxStats?.pointCount.toLocaleString()} pts`}
      {selectedStage.gpxStatus === "error" && " · GPX load failed"}
    </>
  );

  return (
    <div
      className="flex min-h-dvh flex-col bg-slate-950 text-white lg:h-screen lg:overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 20% 20%, rgba(16,30,54,0.9) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(7,20,40,0.8) 0%, transparent 60%)",
      }}
    >
      {/* ── Top header bar ───────────────────────────────────── */}
      <header className="sticky top-0 z-[1000] flex-shrink-0 border-b border-white/10 bg-slate-900/90 px-4 py-3 backdrop-blur-sm lg:static">
        <SummaryHeader
          stages={gpxStages}
          isAboutOpen={activeView === "about"}
          onAboutClick={() => setActiveView("about")}
          unitToggle={<UnitToggle variant={UNIT_TOGGLE_VARIANT} />}
        />
      </header>

      {activeView === "about" && (
        <AboutView onBack={() => setActiveView("dashboard")} />
      )}

      {/* ── Desktop layout ───────────────────────────────────── */}
      {activeView === "dashboard" && (
        <div className="hidden flex-1 min-h-0 overflow-hidden lg:flex">
          {/* Left sidebar — stage cards */}
          <aside className="flex-shrink-0 w-72 min-h-0 border-r border-white/10 bg-slate-900/60 backdrop-blur-sm flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/50">
                {event.totalStages} Stages
              </h2>
              <span className="text-xs text-white/30">
                {formatDistance(
                  gpxStages.reduce((s, st) => s + st.distanceKm, 0),
                  gpxStages.reduce((s, st) => s + st.distanceMi, 0),
                )}{" "}
                total
              </span>
            </div>
            <ClimbDifficultySkyline
              stages={gpxStages}
              selectedId={selectedId}
              onSelect={(id) => {
                setSelectedId(id);
                setShowAll(false);
              }}
            />
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 flex flex-col gap-2">
              {gpxStages.map((stage) => (
                <StageCard
                  key={stage.id}
                  stage={stage}
                  isSelected={stage.id === selectedId}
                  onClick={() => {
                    setSelectedId(stage.id);
                    setShowAll(false);
                  }}
                />
              ))}
            </div>
          </aside>

          {/* Centre — map */}
          <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
            {/* Map toolbar */}
            <div className="flex-shrink-0 flex items-center gap-3 px-4 py-2 border-b border-white/10 bg-slate-900/40">
              <span className="text-xs text-white/50">{routeStatus}</span>
              <div className="flex-1" />
              <button
                onClick={() => setShowAll(!showAll)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  showAll
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                    : "bg-white/5 border-white/15 text-white/60 hover:bg-white/10"
                }`}
              >
                {showAll ? "📍 Full Route" : "🗺 Show All Stages"}
              </button>
            </div>

            {/* Map */}
            <div className="flex-1 p-3 min-h-0">
              <RouteMap
                stages={gpxStages}
                selectedId={selectedId}
                showAll={showAll}
                invalidateKey={`desktop-${selectedId}-${showAll}-${selectedStage.gpxStatus}`}
                onStageSelect={(id) => {
                  setSelectedId(id);
                  setShowAll(false);
                }}
              />
            </div>
          </main>

          {/* Right panel — stage detail */}
          <aside className="flex-shrink-0 w-96 min-h-0 border-l border-white/10 bg-slate-900/60 backdrop-blur-sm flex flex-col overflow-hidden">
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-900/90 backdrop-blur-sm z-10">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/50">
                Stage Detail
              </h2>
              <div className="flex gap-1">
                {gpxStages.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedId(s.id);
                      setShowAll(false);
                    }}
                    className={`w-5 h-5 rounded-full text-[10px] font-bold transition-colors ${
                      s.id === selectedId
                        ? "bg-emerald-400 text-slate-900"
                        : "bg-white/10 text-white/50 hover:bg-white/20"
                    }`}
                  >
                    {s.stageNumber}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4">
              <StageDetail stage={selectedStage} />
            </div>
          </aside>
        </div>
      )}

      {/* ── Mobile layout ────────────────────────────────────── */}
      {activeView === "dashboard" && (
        <div className="flex flex-col gap-4 px-3 py-4 lg:hidden">
          <div className="-mx-3 overflow-x-auto border-b border-white/10 px-3 pb-3">
            <div className="flex min-w-max gap-2">
              {gpxStages.map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => {
                    setSelectedId(stage.id);
                    setShowAll(false);
                  }}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold transition-colors ${
                    stage.id === selectedId
                      ? "border-emerald-300 bg-emerald-400 text-slate-950"
                      : "border-white/10 bg-white/5 text-white/55"
                  }`}
                >
                  {stage.stageNumber}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 rounded-xl border border-white/10 bg-white/5 p-1">
            {mobileViews.map((view) => (
              <button
                key={view.id}
                onClick={() => setActiveMobileView(view.id)}
                className={`rounded-lg px-2 py-2 text-xs font-semibold transition-colors ${
                  activeMobileView === view.id
                    ? "bg-emerald-400 text-slate-950"
                    : "text-white/55"
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>

          {activeMobileView === "overview" && (
            <MobileOverview stage={selectedStage} />
          )}

          {activeMobileView === "map" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="min-w-0 flex-1 truncate text-xs text-white/50">
                  {routeStatus}
                </span>
                <button
                  onClick={() => setShowAll(!showAll)}
                  className={`flex-shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    showAll
                      ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
                      : "border-white/15 bg-white/5 text-white/60"
                  }`}
                >
                  {showAll ? "Full Route" : "All Stages"}
                </button>
              </div>
              <div className="h-[62dvh] min-h-[360px] overflow-hidden rounded-xl border border-white/10">
                <RouteMap
                  stages={gpxStages}
                  selectedId={selectedId}
                  showAll={showAll}
                  invalidateKey={`mobile-map-${selectedId}-${showAll}-${activeMobileView}-${selectedStage.gpxStatus}`}
                  onStageSelect={(id) => {
                    setSelectedId(id);
                    setShowAll(false);
                  }}
                />
              </div>
            </div>
          )}

          {activeMobileView === "profile" && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <ElevationProfile stage={selectedStage} />
            </div>
          )}

          {activeMobileView === "videos" && (
            <StageVideos stage={selectedStage} />
          )}
        </div>
      )}
      <Analytics />
    </div>
  );
}
