import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import type { Stage } from '../data/stages';

// ── Fix Leaflet default icon issue with bundlers ──────────────
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

interface IconDefaultWithGetIconUrl {
  _getIconUrl?: unknown;
}

delete (L.Icon.Default.prototype as IconDefaultWithGetIconUrl)._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

// ── Custom icons ───────────────────────────────────────────────
function makeClimbIcon() {
  const html = `
    <div style="
      background:#f97316;
      color:white;
      width:22px;height:22px;
      border-radius:50%;
      border:2px solid rgba(255,255,255,0.8);
      box-shadow:0 2px 8px rgba(0,0,0,0.7);
      display:flex;align-items:center;justify-content:center;
      font-size:11px;font-weight:bold;
    ">▲</div>`;
  return L.divIcon({
    html,
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14],
  });
}

function makeStartIcon(num: number) {
  const html = `
    <div style="
      background:#22c55e;
      color:white;
      width:24px;height:24px;
      border-radius:50%;
      border:2px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.7);
      display:flex;align-items:center;justify-content:center;
      font-size:11px;font-weight:900;
    ">${num}</div>`;
  return L.divIcon({
    html,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
}

function makeFinishIcon() {
  const html = `
    <div style="
      background:#a855f7;
      color:white;
      width:24px;height:24px;
      border-radius:50%;
      border:2px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.7);
      display:flex;align-items:center;justify-content:center;
      font-size:14px;
    ">🏁</div>`;
  return L.divIcon({
    html,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
}

// ── Stage line colors ──────────────────────────────────────────
const stageLineColors: Record<number, string> = {
  1: '#60a5fa', // blue
  2: '#f87171', // red
  3: '#fb923c', // orange
  4: '#ef4444', // red
  5: '#f97316', // orange
  6: '#fbbf24', // amber
  7: '#a78bfa', // purple
};

// ── Auto-fit bounds when stage changes ────────────────────────
const FitBounds: React.FC<{
  stages: Stage[];
  selectedId: string | null;
  showAll: boolean;
}> = ({ stages, selectedId, showAll }) => {
  const map = useMap();

  useEffect(() => {
    const target = showAll
      ? stages.flatMap((s) => s.routeCoordinates as [number, number][])
      : stages.find((s) => s.id === selectedId)?.routeCoordinates ?? [];

    if (target.length > 0) {
      const bounds = L.latLngBounds(target);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  }, [selectedId, showAll, stages, map]);

  return null;
};

// ── Main component ─────────────────────────────────────────────
interface Props {
  stages: Stage[];
  selectedId: string | null;
  showAll: boolean;
  onStageSelect: (id: string) => void;
}

export const RouteMap: React.FC<Props> = ({
  stages,
  selectedId,
  showAll,
  onStageSelect,
}) => {
  const visibleStages = showAll
    ? stages
    : stages.filter((s) => s.id === selectedId);

  const centerLat = 46.3;
  const centerLng = 11.8;

  return (
    <MapContainer
      center={[centerLat, centerLng]}
      zoom={8}
      className="w-full h-full rounded-xl"
      zoomControl={true}
    >
      {/* Dark OSM tiles */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        opacity={0.75}
      />

      <FitBounds stages={stages} selectedId={selectedId} showAll={showAll} />

      {visibleStages.map((stage) => {
        const isSelected = stage.id === selectedId;

        const color = stageLineColors[stage.stageNumber];
        const weight = isSelected && !showAll ? 5 : 3.5;
        const opacity = isSelected || showAll ? 1 : 0.5;

        return (
          <React.Fragment key={stage.id}>
            {/* Route polyline */}
            <Polyline
              positions={stage.routeCoordinates}
              pathOptions={{
                color,
                weight,
                opacity,
                lineCap: 'round',
                lineJoin: 'round',
              }}
              eventHandlers={{
                click: () => onStageSelect(stage.id),
              }}
            />

            {/* Start marker */}
            <Marker
              position={stage.startCoord}
              icon={makeStartIcon(stage.stageNumber)}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-bold text-green-700">Stage {stage.stageNumber} Start</p>
                  <p>{stage.start}</p>
                </div>
              </Popup>
            </Marker>

            {/* Finish marker — only on last stage or selected */}
            {(stage.stageNumber === 7 || isSelected) && (
              <Marker position={stage.finishCoord} icon={makeFinishIcon()}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold text-purple-700">
                      {stage.stageNumber === 7 ? '🏁 Race Finish' : `Stage ${stage.stageNumber} Finish`}
                    </p>
                    <p>{stage.finish}</p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Climb markers */}
            {stage.climbs.map((climb) => (
              <Marker
                key={climb.name}
                position={climb.approximateLatLng}
                icon={makeClimbIcon()}
              >
                <Popup maxWidth={260}>
                  <div style={{ fontFamily: 'system-ui, sans-serif' }}>
                    <p style={{ fontWeight: 700, color: '#ea580c', marginBottom: 4 }}>
                      ▲ {climb.name}
                    </p>
                    <p style={{ fontSize: 12, color: '#374151', marginBottom: 6 }}>
                      {climb.whyFamous}
                    </p>
                    <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#6b7280' }}>
                      <span>
                        Length:{' '}
                        <strong style={{ color: '#111' }}>
                          {climb.lengthKm ? `~${climb.lengthKm} km` : 'TBD'}
                        </strong>
                      </span>
                      <span>
                        Max:{' '}
                        <strong style={{ color: '#111' }}>
                          {climb.maxGradient ? `~${climb.maxGradient}%` : 'TBD'}
                        </strong>
                      </span>
                    </div>
                    <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>
                      km {climb.approximateKm} marker · summit {climb.summitElevationM.toLocaleString()} m · curated climb note
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </React.Fragment>
        );
      })}
    </MapContainer>
  );
};
