import React, { useState } from 'react';
import { stages } from './data/stages';
import { SummaryHeader } from './components/SummaryHeader';
import { StageCard } from './components/StageCard';
import { StageDetail } from './components/StageDetail';
import { RouteMap } from './components/RouteMap';

// TODO: Add metric/imperial toggle
// TODO: Add cumulative fatigue chart across all 7 stages
// TODO: Add GPX file import for real route coordinates and elevation profiles

export default function App() {
  const [selectedId, setSelectedId] = useState<string>(stages[0].id);
  const [showAll, setShowAll] = useState(false);

  const selectedStage = stages.find((s) => s.id === selectedId)!;

  return (
    <div
      className="min-h-screen bg-slate-950 text-white flex flex-col"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 20% 20%, rgba(16,30,54,0.9) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(7,20,40,0.8) 0%, transparent 60%)',
      }}
    >
      {/* ── Top header bar ───────────────────────────────────── */}
      <header className="flex-shrink-0 border-b border-white/10 bg-slate-900/80 backdrop-blur-sm px-4 py-3">
        <SummaryHeader />
      </header>

      {/* ── Main layout ──────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>

        {/* Left sidebar — stage cards */}
        <aside className="flex-shrink-0 w-72 border-r border-white/10 bg-slate-900/60 backdrop-blur-sm flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/50">7 Stages</h2>
            <span className="text-xs text-white/30">
              {stages.reduce((s, st) => s + st.distanceMi, 0)} mi total
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {stages.map((stage) => (
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
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Map toolbar */}
          <div className="flex-shrink-0 flex items-center gap-3 px-4 py-2 border-b border-white/10 bg-slate-900/40">
            <span className="text-xs text-white/50">
              {showAll
                ? 'All 7 stages'
                : `Stage ${selectedStage.stageNumber}: ${selectedStage.start.split(',')[0]} → ${selectedStage.finish.split(',')[0]}`}
            </span>
            <div className="flex-1" />
            <button
              onClick={() => setShowAll(!showAll)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                showAll
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-white/5 border-white/15 text-white/60 hover:bg-white/10'
              }`}
            >
              {showAll ? '📍 Full Route' : '🗺 Show All Stages'}
            </button>
          </div>

          {/* Map */}
          <div className="flex-1 p-3 min-h-0">
            <RouteMap
              stages={stages}
              selectedId={selectedId}
              showAll={showAll}
              onStageSelect={(id) => {
                setSelectedId(id);
                setShowAll(false);
              }}
            />
          </div>
        </main>

        {/* Right panel — stage detail */}
        <aside className="flex-shrink-0 w-96 border-l border-white/10 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 sticky top-0 bg-slate-900/90 backdrop-blur-sm z-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/50">Stage Detail</h2>
            <div className="flex gap-1">
              {stages.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedId(s.id);
                    setShowAll(false);
                  }}
                  className={`w-5 h-5 rounded-full text-[10px] font-bold transition-colors ${
                    s.id === selectedId
                      ? 'bg-emerald-400 text-slate-900'
                      : 'bg-white/10 text-white/50 hover:bg-white/20'
                  }`}
                >
                  {s.stageNumber}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4">
            <StageDetail stage={selectedStage} />
          </div>
        </aside>
      </div>
    </div>
  );
}
