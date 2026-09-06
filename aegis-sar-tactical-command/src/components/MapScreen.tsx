import React, { useState } from 'react';
import { MapLayer } from '../types';
import { playSonarPing, playTacticalClick } from '../utils/audio';

interface MapScreenProps {
  onShowToast: (msg: string, icon?: string, color?: string) => void;
  onNavigateToFleet?: () => void;
}

interface TargetDetails {
  tag: string;
  tagClass: string;
  sector: string;
  title: string;
  confidence: string;
  acoustic: string;
  atmospheric: string;
  distance: string;
  meshLink: string;
  lastPkt: string;
  isSurvivor: boolean;
}

export const MapScreen: React.FC<MapScreenProps> = ({ onShowToast, onNavigateToFleet }) => {
  const [activeLayer, setActiveLayer] = useState<MapLayer>('lidar');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [relaysDropped, setRelaysDropped] = useState<number>(1);
  const [selectedTarget, setSelectedTarget] = useState<TargetDetails>({
    tag: 'TARGET S-04',
    tagClass: 'bg-secondary-container text-on-secondary-container',
    sector: 'SECTOR B-3',
    title: 'ZONE BRAVO-3 VOID',
    confidence: 'CONF: 96.4%',
    acoustic: 'Rhythmic Tapping (3-3-3 SOS)',
    atmospheric: 'CO₂ Elevated (+720ppm)',
    distance: '14.2m via Crawlspace Ducts',
    meshLink: 'INTERMITTENT',
    lastPkt: '42s AGO',
    isSurvivor: true,
  });

  const handleSelectUnit = (
    name: string,
    role: string,
    confidence: string,
    coords: string,
    colorClass: string,
    acoustic: string,
    atmospheric: string,
    distance: string
  ) => {
    playTacticalClick();
    setSelectedTarget({
      tag: `UNIT: ${name.toUpperCase()}`,
      tagClass: `${colorClass} text-on-surface`,
      sector: coords,
      title: role,
      confidence: `LINK: ${confidence}`,
      acoustic,
      atmospheric,
      distance,
      meshLink: 'DIRECT MESH',
      lastPkt: '1.2s AGO',
      isSurvivor: false,
    });
    onShowToast(`FOCUS: ${name} (${coords})`, 'smart_toy', 'text-primary');
  };

  const handleSelectSurvivor = () => {
    playTacticalClick();
    setSelectedTarget({
      tag: 'TARGET S-04',
      tagClass: 'bg-secondary-container text-on-secondary-container',
      sector: 'SECTOR B-3',
      title: 'ZONE BRAVO-3 VOID',
      confidence: 'CONF: 96.4%',
      acoustic: 'Rhythmic Tapping (3-3-3 SOS)',
      atmospheric: 'CO₂ Elevated (+720ppm)',
      distance: '14.2m via Crawlspace Ducts',
      meshLink: 'INTERMITTENT',
      lastPkt: '42s AGO',
      isSurvivor: true,
    });
    onShowToast('TARGET FOCUS: SURVIVOR S-04', 'person_search', 'text-secondary');
  };

  const handlePingBeacon = () => {
    setIsPinging(true);
    playSonarPing(1200);
    onShowToast('ACOUSTIC PING TRANSMITTED (1.2 kHz) • SONAR ECHO CAPTURED', 'sensors', 'text-secondary');
    setTimeout(() => setIsPinging(false), 2000);
  };

  const handlePushWaypoint = () => {
    playTacticalClick();
    onShowToast('WAYPOINT VECTOR PUSHED TO FLEET • RENDEZVOUS UPDATED', 'near_me', 'text-tertiary');
  };

  const handleDropRelay = () => {
    playTacticalClick();
    setRelaysDropped((prev) => prev + 1);
    onShowToast(`MESH RELAY ANCHOR #${relaysDropped + 1} DEPLOYED TO SUB-VOID`, 'router', 'text-secondary');
  };

  const handleMarkHazard = () => {
    playTacticalClick();
    onShowToast('HAZARD PIN PLACED AT 38S MB 4924 8852 (BEAM SHEAR)', 'flag', 'text-error');
  };

  const handleReroute = () => {
    playTacticalClick();
    onShowToast('RE-ROUTING FLEET COMMAND: BYPASS CORRIDOR 02 ACTIVE', 'alt_route', 'text-primary');
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-space-sm pb-12">
      {/* Layer Toggles & Mode Bar */}
      <div className="px-space-md pt-space-xs pb-space-xs flex items-center justify-between gap-space-xs overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-space-xs bg-surface-container-low p-space-2xs rounded-lg shadow-inner shrink-0 border border-surface-container-high/40">
          <button
            onClick={() => {
              setActiveLayer('lidar');
              onShowToast('LAYER: LIDAR DELTA OVERLAY ACTIVE', 'view_in_ar', 'text-primary');
            }}
            className={`px-space-sm py-space-2xs rounded font-label-tactical text-label-tactical flex items-center gap-space-2xs transition-all shadow-sm ${
              activeLayer === 'lidar'
                ? 'bg-primary text-on-primary font-bold'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">view_in_ar</span>
            <span>LiDAR SLAM (LIVE Δ)</span>
          </button>

          <button
            onClick={() => {
              setActiveLayer('thermal');
              onShowToast('LAYER: LWIR THERMAL RADIOMETRY ACTIVE', 'thermostat', 'text-secondary');
            }}
            className={`px-space-sm py-space-2xs rounded font-label-tactical text-label-tactical flex items-center gap-space-2xs transition-all shadow-sm ${
              activeLayer === 'thermal'
                ? 'bg-secondary text-on-secondary font-bold'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">thermostat</span>
            <span>THERMAL</span>
          </button>

          <button
            onClick={() => {
              setActiveLayer('obstacle');
              onShowToast('LAYER: 3D VOXEL OBSTACLE MESH ACTIVE', 'grid_4x4', 'text-tertiary');
            }}
            className={`px-space-sm py-space-2xs rounded font-label-tactical text-label-tactical flex items-center gap-space-2xs transition-all shadow-sm ${
              activeLayer === 'obstacle'
                ? 'bg-tertiary text-on-tertiary font-bold'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">grid_4x4</span>
            <span>OBSTACLE MESH</span>
          </button>
        </div>

        <div className="flex items-center gap-space-2xs px-space-xs py-space-2xs rounded bg-surface-container-high shrink-0 border border-surface-container-highest/60">
          <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
          <span className="font-telemetry-sm text-telemetry-sm text-secondary tracking-widest font-bold">
            3D SLAM v2.4
          </span>
        </div>
      </div>

      {/* Responsive Grid for Desktop/Tablet: Map on Left, Telemetry & Controls on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md px-space-md">
        {/* Main Tactical Map Viewport */}
        <div className="lg:col-span-8 relative w-full">
          <div className="relative w-full h-[400px] md:h-[460px] lg:h-[500px] bg-surface-container-lowest rounded-xl overflow-hidden shadow-2xl border border-surface-container-high">
            {/* SVG Tactical Vector Canvas */}
            <svg
              className="absolute inset-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 400 360"
              preserveAspectRatio="xMidYMid slice"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: 'transform 0.25s ease-out',
              }}
            >
              <defs>
                <pattern id="tacticalGrid" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#1c2027" strokeWidth="1" />
                  <circle cx="28" cy="28" r="0.75" fill="#31353d" />
                </pattern>
                <pattern id="amberHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="10" stroke="#f59e0b" strokeWidth="2.5" opacity="0.45" />
                </pattern>
                <pattern id="crimsonHatch" width="12" height="12" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="12" stroke="#ffb4ab" strokeWidth="2" opacity="0.6" />
                </pattern>
                <radialGradient id="thermalBloom" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#4cd7f6" stopOpacity="0.55" />
                  <stop offset="45%" stopColor="#30c88f" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0f131b" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="fovConeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffc174" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ffc174" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="fovScoutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#56e5a9" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#56e5a9" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="fovCrawlerGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4cd7f6" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#4cd7f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Background */}
              <rect width="100%" height="100%" fill="url(#tacticalGrid)" />

              {/* Subterranean Structural Rooms & Passages */}
              <path d="M 20 60 L 140 50 L 165 140 L 40 150 Z" fill="#181c23" opacity="0.85" />
              <path d="M 165 140 L 260 130 L 285 240 L 190 260 Z" fill="#181c23" opacity="0.85" />
              <path d="M 40 150 L 145 160 L 110 320 L 25 300 Z" fill="#181c23" opacity="0.85" />

              {/* Unexplored Void Boundary */}
              <path
                d="M 285 110 C 320 80, 360 110, 375 190 C 390 280, 340 340, 270 330 C 230 325, 230 260, 285 240 Z"
                fill="#12161f"
                opacity="0.75"
                stroke="#534434"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text x="270" y="95" fill="#a08e7a" className="font-label-tactical text-[9px]" letterSpacing="1.5">
                SIGNAL VOID / UNEXPLORED
              </text>

              {/* Hazard Zones: Beam Shear Risk (Crimson) */}
              <polygon points="175,155 245,145 255,200 185,210" fill="url(#crimsonHatch)" opacity="0.85" />
              <polygon points="175,155 245,145 255,200 185,210" fill="#93000a" opacity="0.25" />
              <text x="180" y="140" fill="#ffb4ab" className="font-label-tactical text-[9px] font-bold">
                ▲ BEAM SHEAR RISK
              </text>

              {/* Blocked Region: Rebar Concrete (Amber) */}
              <polygon points="50,170 120,180 110,230 45,215" fill="url(#amberHatch)" opacity="0.9" />
              <text x="48" y="245" fill="#ffc174" className="font-label-tactical text-[9px] font-bold">
                ■ BLOCKED: REBAR CONCRETE
              </text>

              {/* Accessible Passage Corridor (Green pulse) */}
              <path
                id="accessible-passage"
                d="M 75 285 Q 125 270 160 295 T 225 255"
                fill="none"
                stroke="#56e5a9"
                strokeWidth="3"
                strokeDasharray="6 4"
                className="animate-pulse"
              />
              <circle cx="225" cy="255" r="3" fill="#56e5a9" />

              {/* Thermal Bloom Overlay (Shows if thermal or lidar layer active) */}
              {(activeLayer === 'thermal' || activeLayer === 'lidar') && (
                <circle cx="255" cy="230" r={isPinging ? '65' : '48'} fill="url(#thermalBloom)" className="animate-pulse transition-all duration-300" />
              )}

              {/* FOV Cones */}
              <path d="M 85 85 L 45 35 L 125 35 Z" fill="url(#fovConeGrad)" />
              <line x1="85" y1="85" x2="45" y2="35" stroke="#ffc174" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />
              <line x1="85" y1="85" x2="125" y2="35" stroke="#ffc174" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />

              <path d="M 270 180 L 325 155 L 310 220 Z" fill="url(#fovCrawlerGrad)" />
              <path d="M 125 270 L 170 290 L 155 330 Z" fill="url(#fovScoutGrad)" />

              {/* Dynamic Obstacle Mesh Layer */}
              {activeLayer === 'obstacle' && (
                <g stroke="#30c88f" strokeWidth="0.75" strokeDasharray="2 2" fill="none" opacity="0.7">
                  <circle cx="125" cy="270" r="35" />
                  <circle cx="270" cy="180" r="40" />
                  <circle cx="85" cy="85" r="50" />
                  <line x1="125" y1="270" x2="270" y2="180" />
                  <line x1="85" y1="85" x2="125" y2="270" />
                </g>
              )}
            </svg>

            {/* Datum / Elevation / Coordinates Badge (Top Left) */}
            <div className="absolute top-space-xs left-space-xs bg-surface-container-high/90 backdrop-blur-md px-space-xs py-space-2xs rounded flex flex-col gap-space-2xs max-w-[200px] border border-surface-container-highest/60 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="font-label-tactical text-label-tactical text-secondary">DATUM SUB-04</span>
                <span className="font-telemetry-sm text-telemetry-sm text-tertiary">ELEV: -18.4m</span>
              </div>
              <div className="flex items-center gap-space-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                <span className="font-label-tactical text-label-tactical text-on-surface truncate">
                  GRID: 38S MB 4921 8840
                </span>
              </div>
            </div>

            {/* Hazards & Clearance Info (Top Right) */}
            <div className="absolute top-space-xs right-space-xs flex flex-col gap-space-2xs items-end">
              <div className="bg-surface-container-high/90 backdrop-blur-md px-space-xs py-space-2xs rounded flex items-center gap-space-xs border border-error/30 shadow-lg">
                <span className="material-symbols-outlined text-[14px] text-error">warning</span>
                <span className="font-label-tactical text-label-tactical text-error font-bold">COLLAPSE HAZARD</span>
              </div>
              <div className="bg-surface-container-high/90 backdrop-blur-md px-space-xs py-space-2xs rounded flex items-center gap-space-2xs border border-tertiary/30 shadow-lg">
                <span className="material-symbols-outlined text-[14px] text-tertiary">check_circle</span>
                <span className="font-label-tactical text-label-tactical text-tertiary font-bold">PASSAGE: 65x40cm</span>
              </div>
            </div>

            {/* Interactive Unit 1: Vanguard-1 */}
            <div
              className="absolute top-[24%] left-[21%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-10"
              onClick={() =>
                handleSelectUnit(
                  'Vanguard-1',
                  'Rover (Void Perimeter Staging)',
                  '92%',
                  'MGRS 38SMB492884',
                  'bg-primary',
                  'Ambient Rumble (12 Hz Seismic Echo)',
                  'O2: 20.8% • CO: 0ppm (Normal)',
                  '0.0m Base Anchor'
                )
              }
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-lg ring-2 ring-primary-container group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[18px]">precision_manufacturing</span>
              </div>
              <span className="mt-space-2xs px-space-2xs py-0 bg-surface-container-highest/90 rounded font-telemetry-sm text-telemetry-sm text-primary tracking-tighter font-bold shadow border border-primary/20">
                VANGUARD-1
              </span>
            </div>

            {/* Interactive Unit 2: Talon-3 */}
            <div
              className="absolute top-[50%] left-[68%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-10"
              onClick={() =>
                handleSelectUnit(
                  'Talon-3',
                  'Crawler (Breaching Duct)',
                  '68%',
                  'MGRS 38SMB494886',
                  'bg-secondary',
                  'Acoustic Mic: Active Void Listening',
                  'CO2 Spike: 850ppm',
                  '18.6m from Spine'
                )
              }
            >
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-on-secondary shadow-lg ring-2 ring-secondary-container group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[18px]">pest_control</span>
              </div>
              <span className="mt-space-2xs px-space-2xs py-0 bg-surface-container-highest/90 rounded font-telemetry-sm text-telemetry-sm text-secondary tracking-tighter font-bold shadow border border-secondary/20">
                TALON-3
              </span>
            </div>

            {/* Interactive Unit 3: Scout-02 */}
            <div
              className="absolute top-[75%] left-[31%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-10"
              onClick={() =>
                handleSelectUnit(
                  'Scout-02',
                  'Hexapod (Tunnel Spine)',
                  '89%',
                  'MGRS 38SMB491882',
                  'bg-tertiary',
                  'Corroborated 18Hz Acoustic Tapping',
                  'CO2: Normal',
                  '12.4m from Mesh Anchor 3'
                )
              }
            >
              <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center text-on-tertiary shadow-lg ring-2 ring-tertiary-container group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[18px]">bug_report</span>
              </div>
              <span className="mt-space-2xs px-space-2xs py-0 bg-surface-container-highest/90 rounded font-telemetry-sm text-telemetry-sm text-tertiary tracking-tighter font-bold shadow border border-tertiary/20">
                SCOUT-02
              </span>
            </div>

            {/* Interactive Survivor Target Pin S-04 */}
            <div
              className="absolute top-[64%] left-[64%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer z-20 group"
              id="survivor-pin"
              onClick={handleSelectSurvivor}
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute w-10 h-10 rounded-full bg-secondary opacity-40 animate-ping"></span>
                {isPinging && (
                  <span className="absolute w-16 h-16 rounded-full border-2 border-secondary opacity-75 animate-ping"></span>
                )}
                <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform ring-2 ring-secondary">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    person_search
                  </span>
                </div>
              </div>
              <div className="mt-space-2xs px-space-xs py-space-2xs bg-surface-container-highest rounded flex items-center gap-space-2xs shadow-lg border border-secondary/40">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span className="font-telemetry-sm text-telemetry-sm text-secondary tracking-widest font-bold">
                  S-04 CONFIRMED
                </span>
              </div>
            </div>

            {/* Zoom & Location Controls (Bottom Right) */}
            <div className="absolute bottom-space-xs right-space-xs flex flex-col gap-space-2xs z-20">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
                title="Zoom In"
                className="w-8 h-8 rounded bg-surface-container-high/90 text-on-surface flex items-center justify-center hover:bg-surface-container-highest shadow active:scale-95 transition-transform border border-surface-container-highest"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
                title="Zoom Out"
                className="w-8 h-8 rounded bg-surface-container-high/90 text-on-surface flex items-center justify-center hover:bg-surface-container-highest shadow active:scale-95 transition-transform border border-surface-container-highest"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <button
                onClick={() => {
                  setZoomLevel(1);
                  onShowToast('MAP RE-CENTERED ON SURVIVOR S-04 VECTOR', 'my_location', 'text-primary');
                }}
                title="Reset View"
                className="w-8 h-8 rounded bg-surface-container-high/90 text-primary flex items-center justify-center hover:bg-surface-container-highest shadow active:scale-95 transition-transform border border-surface-container-highest"
              >
                <span className="material-symbols-outlined text-[18px]">my_location</span>
              </button>
            </div>

            {/* Point Cloud Telemetry Footer (Bottom Left) */}
            <div className="absolute bottom-space-xs left-space-xs bg-surface-container-high/90 backdrop-blur-md px-space-xs py-space-2xs rounded flex items-center gap-space-xs border border-surface-container-highest/60 shadow">
              <span className="font-telemetry-sm text-telemetry-sm text-on-surface-variant">PT-CLOUD:</span>
              <span className="font-telemetry-sm text-telemetry-sm text-tertiary font-bold">412,890 PTS</span>
              <span className="text-outline-variant font-telemetry-sm text-telemetry-sm">|</span>
              <span className="font-telemetry-sm text-telemetry-sm text-primary font-bold">Δ 32ms</span>
            </div>
          </div>

          {/* Quick Action Button Trio */}
          <div className="pt-space-xs">
            <div className="grid grid-cols-3 gap-space-xs">
              <button
                onClick={handleDropRelay}
                className="min-h-touch-min px-space-xs py-space-xs rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex flex-col items-center justify-center gap-space-2xs shadow border border-surface-container-highest/60 transition-colors active:scale-95 text-center"
              >
                <span className="material-symbols-outlined text-secondary text-[20px]">router</span>
                <span className="font-label-tactical text-label-tactical uppercase text-on-surface tracking-tight font-bold">
                  Drop Relay
                </span>
              </button>

              <button
                onClick={handleMarkHazard}
                className="min-h-touch-min px-space-xs py-space-xs rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex flex-col items-center justify-center gap-space-2xs shadow border border-surface-container-highest/60 transition-colors active:scale-95 text-center"
              >
                <span className="material-symbols-outlined text-error text-[20px]">flag</span>
                <span className="font-label-tactical text-label-tactical uppercase text-on-surface tracking-tight font-bold">
                  Mark Hazard
                </span>
              </button>

              <button
                onClick={handleReroute}
                className="min-h-touch-min px-space-xs py-space-xs rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex flex-col items-center justify-center gap-space-2xs shadow border border-surface-container-highest/60 transition-colors active:scale-95 text-center"
              >
                <span className="material-symbols-outlined text-primary text-[20px]">alt_route</span>
                <span className="font-label-tactical text-label-tactical uppercase text-on-surface tracking-tight font-bold">
                  Re-route
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Telemetry Drawer / Target Inspector Panel */}
        <div className="lg:col-span-4 flex flex-col">
          <div
            id="telemetry-drawer"
            className="bg-surface-container rounded-xl p-space-md shadow-xl flex flex-col gap-space-sm relative overflow-hidden border border-surface-container-high h-full justify-between"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary-container"></div>

            <div className="space-y-space-sm">
              {/* Header */}
              <div className="flex items-start justify-between gap-space-sm">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-space-xs">
                    <span
                      id="drawer-tag"
                      className={`px-space-xs py-0 rounded font-label-tactical text-label-tactical uppercase font-bold ${selectedTarget.tagClass}`}
                    >
                      {selectedTarget.tag}
                    </span>
                    <span className="font-telemetry-sm text-telemetry-sm text-on-surface-variant truncate">
                      {selectedTarget.sector}
                    </span>
                  </div>
                  <span
                    id="drawer-title"
                    className="font-headline-sm text-headline-sm uppercase text-on-surface mt-space-2xs truncate font-bold"
                  >
                    {selectedTarget.title}
                  </span>
                </div>

                <div className="flex items-center gap-space-2xs px-space-xs py-space-2xs rounded bg-surface-container-low shrink-0 border border-surface-container-high">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">record_voice_over</span>
                  <span className="font-telemetry-base text-telemetry-base text-tertiary font-bold">
                    {selectedTarget.confidence}
                  </span>
                </div>
              </div>

              {/* Sensor Readouts */}
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-space-2xs border border-surface-container-high/40">
                <div className="flex items-center justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Acoustic Signature:</span>
                  <span className="font-telemetry-sm text-telemetry-sm text-primary font-bold">
                    {selectedTarget.acoustic}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Atmospheric Sensor:</span>
                  <span className="font-telemetry-sm text-telemetry-sm text-tertiary font-bold">
                    {selectedTarget.atmospheric}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Est. Distance Ahead:</span>
                  <span className="font-telemetry-sm text-telemetry-sm text-on-surface font-bold">
                    {selectedTarget.distance}
                  </span>
                </div>
              </div>

              {/* Mesh Link Status */}
              <div className="flex items-center justify-between bg-surface-container-high px-space-sm py-space-xs rounded border border-surface-container-highest/60">
                <div className="flex items-center gap-space-xs min-w-0">
                  <span className="material-symbols-outlined text-primary text-[18px] shrink-0 animate-pulse">
                    cell_tower
                  </span>
                  <span className="font-telemetry-sm text-telemetry-sm text-on-surface truncate">
                    MESH LINK: {selectedTarget.meshLink}
                  </span>
                </div>
                <span className="font-telemetry-sm text-telemetry-sm text-primary shrink-0 font-bold">
                  LAST PKT: {selectedTarget.lastPkt}
                </span>
              </div>
            </div>

            {/* Tactical Action Buttons */}
            <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
              <button
                onClick={handlePushWaypoint}
                className="min-h-touch-min px-space-sm py-space-xs rounded bg-primary-container text-on-primary-container font-headline-sm text-headline-sm uppercase tracking-wider flex items-center justify-center gap-space-xs shadow active:scale-95 transition-transform hover:bg-primary font-bold"
              >
                <span className="material-symbols-outlined text-[20px]">navigation</span>
                <span>PUSH WAYPOINT</span>
              </button>

              <button
                onClick={handlePingBeacon}
                className="min-h-touch-min px-space-sm py-space-xs rounded bg-surface-container-highest hover:bg-surface-bright text-on-surface font-headline-sm text-headline-sm uppercase tracking-wider flex items-center justify-center gap-space-xs shadow active:scale-95 transition-transform font-bold"
              >
                <span className={`material-symbols-outlined text-[20px] text-secondary ${isPinging ? 'animate-spin' : ''}`}>
                  sensors
                </span>
                <span>PING BEACON</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
