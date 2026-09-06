import React, { useState, useEffect, useRef } from 'react';
import { RobotUnit } from '../types';
import { INITIAL_ROBOTS } from '../data/mockData';
import { TeleoperationModal } from './TeleoperationModal';
import { playTacticalClick, playSonarPing, playSosPulse } from '../utils/audio';

interface FleetScreenProps {
  onShowToast: (msg: string, icon?: string, color?: string) => void;
}

export const FleetScreen: React.FC<FleetScreenProps> = ({ onShowToast }) => {
  const [robots, setRobots] = useState<RobotUnit[]>(INITIAL_ROBOTS);
  const [teleopOpen, setTeleopOpen] = useState<boolean>(false);
  const [rendezvousModalOpen, setRendezvousModalOpen] = useState<boolean>(false);
  const [selectedRendezvousNode, setSelectedRendezvousNode] = useState<string>('Mesh Node 3 (Spine Anchor)');

  // Scout countdown timer
  const [scoutSeconds, setScoutSeconds] = useState<number>(168);

  // Press-and-hold state for Emergency Recall
  const [holdProgress, setHoldProgress] = useState<number>(0);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const holdIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setScoutSeconds((s) => (s > 0 ? s - 1 : 180));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleDeployBeacon = (unitId: string) => {
    playSonarPing(1100);
    onShowToast(`${unitId}: Acoustic beacon deployed to void floor`, 'podcasts', 'text-secondary');
  };

  const handleEjectRelay = (unitId: string) => {
    playTacticalClick();
    setRobots((prev) =>
      prev.map((bot) => {
        if (bot.id === unitId && (bot.podsRemaining ?? 0) > 0) {
          const remaining = (bot.podsRemaining ?? 0) - 1;
          onShowToast(`${unitId}: Dropped relay anchor pod #${4 - remaining}`, 'eject', 'text-primary-container');
          return { ...bot, podsRemaining: remaining };
        }
        return bot;
      })
    );
  };

  const handleAdvance = (unitId: string, meters: number) => {
    playTacticalClick();
    onShowToast(`${unitId}: Advancing crawl route +${meters}m along spine`, 'north', 'text-secondary');
  };

  const handleBroadcastSync = () => {
    playTacticalClick();
    onShowToast('MESH: Broadcast Sync Packet emitted across all frequencies', 'cell_merge', 'text-secondary');
  };

  // Hold-to-recall mechanics
  const startEmergencyHold = () => {
    setIsHolding(true);
    setHoldProgress(0);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);

    holdIntervalRef.current = window.setInterval(() => {
      setHoldProgress((prev) => {
        if (prev >= 100) {
          if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
          playSosPulse(600);
          onShowToast('ALL UNITS: Immediate abort & return to surface command hub', 'warning', 'text-error');
          return 100;
        }
        return prev + 8;
      });
    }, 100);
  };

  const abortEmergencyHold = () => {
    setIsHolding(false);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    if (holdProgress < 100) {
      setHoldProgress(0);
    }
  };

  const talon = robots.find((r) => r.id === 'TALON-03');
  const scout = robots.find((r) => r.id === 'SCOUT-02');
  const vanguard = robots.find((r) => r.id === 'VANGUARD-01');

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-space-md space-y-space-md pb-16">
      {/* Fleet Telemetry Matrix Banner */}
      <div className="w-full bg-surface-container-low border border-surface-container-high/60 rounded-xl p-space-sm shadow-md">
        <div className="flex items-center justify-between mb-space-xs pb-space-2xs border-b border-surface-container-high/40">
          <div className="flex items-center gap-space-xs">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-ping"></span>
            <span className="font-label-tactical text-label-tactical uppercase tracking-wider text-on-surface-variant font-bold">
              FLEET TELEMETRY MATRIX
            </span>
          </div>
          <span className="font-telemetry-sm text-telemetry-sm text-tertiary font-bold">
            MESH CARRIER: ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-xs">
          <div className="bg-surface-container p-space-xs rounded flex items-center justify-between border border-surface-container-highest/40">
            <div className="flex items-center gap-space-xs min-w-0">
              <span className="material-symbols-outlined text-tertiary text-[18px]">precision_manufacturing</span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-tactical text-label-tactical uppercase text-on-surface-variant">
                  ACTIVE UNITS
                </span>
                <span className="font-telemetry-lg text-telemetry-lg text-on-surface truncate font-bold">
                  3 DEPLOYED
                </span>
              </div>
            </div>
            <div className="w-1.5 h-6 bg-tertiary rounded-full"></div>
          </div>

          <div className="bg-surface-container p-space-xs rounded flex items-center justify-between border border-surface-container-highest/40">
            <div className="flex items-center gap-space-xs min-w-0">
              <span className="material-symbols-outlined text-primary-container text-[18px]">cell_tower</span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-tactical text-label-tactical uppercase text-on-surface-variant">
                  MESH ANCHORS
                </span>
                <span className="font-telemetry-lg text-telemetry-lg text-primary truncate font-bold">
                  1 DROPPED
                </span>
              </div>
            </div>
            <div className="w-1.5 h-6 bg-primary-container rounded-full"></div>
          </div>

          <div className="bg-surface-container p-space-xs rounded flex items-center justify-between border border-surface-container-highest/40">
            <div className="flex items-center gap-space-xs min-w-0">
              <span className="material-symbols-outlined text-secondary text-[18px]">replay</span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-tactical text-label-tactical uppercase text-on-surface-variant">
                  OFFLINE RETURN
                </span>
                <span className="font-telemetry-lg text-telemetry-lg text-secondary-fixed-dim truncate font-bold">
                  1 HOMING
                </span>
              </div>
            </div>
            <div className="w-1.5 h-6 bg-secondary rounded-full"></div>
          </div>

          <div className="bg-surface-container p-space-xs rounded flex items-center justify-between border border-surface-container-highest/40">
            <div className="flex items-center gap-space-xs min-w-0">
              <span className="material-symbols-outlined text-tertiary-fixed-dim text-[18px]">battery_charging_full</span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-tactical text-label-tactical uppercase text-on-surface-variant">
                  AVG BATTERY
                </span>
                <span className="font-telemetry-lg text-telemetry-lg text-on-surface truncate font-bold">
                  68% COMBINED
                </span>
              </div>
            </div>
            <div className="w-1.5 h-6 bg-tertiary-container rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Grid of Robot Cards (Stacked on Mobile, 2 or 3-column on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
        {/* Unit 1: TALON-03 */}
        {talon && (
          <div className="bg-surface-container rounded-xl overflow-hidden shadow-lg border border-surface-container-high flex flex-col justify-between">
            <div>
              {/* Unit Header */}
              <div className="bg-surface-container-high px-space-md py-space-xs flex items-center justify-between border-b border-surface-container-highest/50">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded bg-surface-container-lowest flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">roller_shades</span>
                  </div>
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-headline-sm text-headline-sm text-on-surface uppercase font-bold">
                        {talon.name}
                      </span>
                      <span className="bg-tertiary/20 text-tertiary font-label-tactical text-label-tactical px-space-2xs py-0.5 rounded uppercase font-bold">
                        LIVE STREAM
                      </span>
                    </div>
                    <span className="font-label-tactical text-label-tactical text-on-surface-variant uppercase truncate">
                      {talon.type}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-space-2xs bg-tertiary/10 px-space-xs py-space-2xs rounded">
                  <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                  <span className="font-telemetry-sm text-telemetry-sm text-tertiary font-bold">
                    DIRECT MESH
                  </span>
                </div>
              </div>

              {/* Feed & Sensors */}
              <div className="p-space-md space-y-space-sm">
                <div className="relative w-full h-40 rounded-lg overflow-hidden bg-surface-container-lowest border border-surface-container-high">
                  <img
                    className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500"
                    src={talon.imageUrl}
                    alt="Thermal Subterranean Feed"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent pointer-events-none"></div>

                  <div className="absolute top-2 left-2 flex items-center gap-space-2xs bg-surface-container-lowest/90 px-space-xs py-space-2xs rounded backdrop-blur-md border border-surface-container-high/60">
                    <span className="material-symbols-outlined text-secondary text-[14px]">my_location</span>
                    <span className="font-telemetry-sm text-telemetry-sm text-on-surface font-bold">
                      {talon.location}
                    </span>
                  </div>

                  <div className="absolute top-2 right-2 flex items-center gap-space-2xs bg-surface-container-lowest/90 px-space-xs py-space-2xs rounded backdrop-blur-md border border-surface-container-high/60">
                    <span className="material-symbols-outlined text-primary-container text-[14px]">thermostat</span>
                    <span className="font-telemetry-sm text-telemetry-sm text-on-surface font-bold">
                      {talon.ambientTemp}
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-surface-container-lowest/80 px-space-xs py-space-2xs rounded text-on-surface border border-surface-container-high/40">
                    <div className="flex items-center gap-space-2xs min-w-0">
                      <span className="material-symbols-outlined text-tertiary text-[14px]">auto_mode</span>
                      <span className="font-telemetry-sm text-telemetry-sm truncate">
                        Autonomous void search: Grid A-4
                      </span>
                    </div>
                    <span className="font-telemetry-sm text-telemetry-sm text-tertiary font-bold shrink-0 ml-2">
                      {talon.battery}% (1h 45m)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-space-xs">
                  <div className="bg-surface-container-low p-space-xs rounded flex flex-col border border-surface-container-high/40">
                    <span className="font-label-tactical text-label-tactical text-on-surface-variant uppercase">
                      FLIR THERMAL
                    </span>
                    <div className="flex items-center gap-space-2xs mt-space-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                      <span className="font-telemetry-sm text-telemetry-sm text-on-surface font-bold">ONLINE</span>
                    </div>
                  </div>

                  <div className="bg-surface-container-low p-space-xs rounded flex flex-col border border-surface-container-high/40">
                    <span className="font-label-tactical text-label-tactical text-on-surface-variant uppercase">
                      3D LIDAR
                    </span>
                    <div className="flex items-center gap-space-2xs mt-space-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                      <span className="font-telemetry-sm text-telemetry-sm text-on-surface font-bold">
                        {talon.sensors.lidar}
                      </span>
                    </div>
                  </div>

                  <div className="bg-surface-container-low p-space-xs rounded flex flex-col border border-surface-container-high/40">
                    <span className="font-label-tactical text-label-tactical text-on-surface-variant uppercase">
                      SEISMIC SENSOR
                    </span>
                    <div className="flex items-center gap-space-2xs mt-space-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      <span className="font-telemetry-sm text-telemetry-sm text-on-surface font-bold">
                        {talon.sensors.seismic}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-space-md pt-0 grid grid-cols-2 gap-space-sm">
              <button
                onClick={() => setTeleopOpen(true)}
                className="min-h-touch-min bg-primary text-on-primary rounded font-headline-sm text-headline-sm uppercase font-bold flex items-center justify-center gap-space-xs shadow-md active:scale-95 transition-transform hover:bg-primary-container"
              >
                <span className="material-symbols-outlined text-[20px]">joystick</span>
                <span>Teleoperate</span>
              </button>

              <button
                onClick={() => handleDeployBeacon('TALON-03')}
                className="min-h-touch-min bg-surface-container-highest hover:bg-surface-bright text-on-surface rounded font-headline-sm text-headline-sm uppercase font-bold flex items-center justify-center gap-space-xs active:scale-95 transition-transform border border-surface-container-highest"
              >
                <span className="material-symbols-outlined text-secondary text-[20px]">podcasts</span>
                <span>Deploy Beacon</span>
              </button>
            </div>
          </div>
        )}

        {/* Unit 2: SCOUT-02 */}
        {scout && (
          <div className="bg-surface-container rounded-xl overflow-hidden shadow-lg border border-surface-container-high flex flex-col justify-between">
            <div>
              <div className="bg-surface-container-high px-space-md py-space-xs flex items-center justify-between border-b border-surface-container-highest/50">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded bg-surface-container-lowest flex items-center justify-center text-primary-container">
                    <span className="material-symbols-outlined text-[20px]">pest_control</span>
                  </div>
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-headline-sm text-headline-sm text-on-surface uppercase font-bold">
                        {scout.name}
                      </span>
                      <span className="bg-primary-container/20 text-primary-container font-label-tactical text-label-tactical px-space-2xs py-0.5 rounded uppercase font-bold">
                        AUTONOMOUS
                      </span>
                    </div>
                    <span className="font-label-tactical text-label-tactical text-on-surface-variant uppercase truncate">
                      {scout.type}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-space-2xs bg-surface-container-lowest px-space-xs py-space-2xs rounded border border-surface-container-high">
                  <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                  <span className="font-telemetry-sm text-telemetry-sm text-primary font-bold">
                    T-3m 12s CONTACT
                  </span>
                </div>
              </div>

              <div className="p-space-md space-y-space-sm">
                <div className="bg-surface-container-low p-space-sm rounded-lg flex items-start gap-space-sm border border-secondary/30">
                  <span className="material-symbols-outlined text-secondary text-[24px] mt-0.5 shrink-0">radar</span>
                  <div className="flex flex-col min-w-0 text-left">
                    <span className="font-telemetry-base text-telemetry-base text-secondary font-bold">
                      SURVIVOR ACOUSTIC HIT DETECTED
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">
                      Corroborated 18Hz intermittent tapping frequency behind collapsed rebar wall. Target flagged on local unit memory.
                    </p>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-space-sm rounded-lg space-y-space-xs border border-surface-container-high/60 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-label-tactical text-label-tactical uppercase text-on-surface-variant">
                      AUTO-PROTOCOL SEQUENCE
                    </span>
                    <span className="font-telemetry-sm text-telemetry-sm text-primary font-bold">
                      MISSION CACHE v4.2
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface">
                    Traversing Faraday rubble corridor. Mapping fissure line and returning to Mesh Anchor 3.
                  </p>
                  <div className="flex items-center justify-between pt-space-2xs border-t border-surface-container-high/30">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-tertiary text-[16px]">timelapse</span>
                      <span className="font-telemetry-sm text-telemetry-sm text-tertiary">EST. RENDEZVOUS:</span>
                    </div>
                    <span className="font-telemetry-base text-telemetry-base text-tertiary font-bold tracking-widest">
                      {formatTimer(scoutSeconds)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-space-xs">
                  <div className="bg-surface-container-low p-space-xs rounded flex items-center justify-between border border-surface-container-high/40">
                    <span className="font-label-tactical text-label-tactical text-on-surface-variant uppercase">
                      POWER STATE
                    </span>
                    <span className="font-telemetry-sm text-telemetry-sm text-on-surface font-bold">
                      {scout.battery}% BATTERY
                    </span>
                  </div>
                  <div className="bg-surface-container-low p-space-xs rounded flex items-center justify-between border border-surface-container-high/40">
                    <span className="font-label-tactical text-label-tactical text-on-surface-variant uppercase">
                      PAYLOAD CUTTER
                    </span>
                    <span className="font-telemetry-sm text-telemetry-sm text-secondary font-bold">
                      ARMED / READY
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-space-md pt-0">
              <button
                onClick={() => setRendezvousModalOpen(true)}
                className="w-full min-h-touch-min bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded font-headline-sm text-headline-sm uppercase font-bold flex items-center justify-center gap-space-xs active:scale-95 transition-transform border border-surface-container-highest"
              >
                <span className="material-symbols-outlined text-primary text-[20px]">sync_alt</span>
                <span>Configure Auto-Rendezvous</span>
              </button>
            </div>
          </div>
        )}

        {/* Unit 3: VANGUARD-01 */}
        {vanguard && (
          <div className="bg-surface-container rounded-xl overflow-hidden shadow-lg border border-surface-container-high flex flex-col justify-between">
            <div>
              <div className="bg-surface-container-high px-space-md py-space-xs flex items-center justify-between border-b border-surface-container-highest/50">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded bg-surface-container-lowest flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[20px]">shield_with_house</span>
                  </div>
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-headline-sm text-headline-sm text-on-surface uppercase font-bold">
                        {vanguard.name}
                      </span>
                      <span className="bg-secondary/20 text-secondary font-label-tactical text-label-tactical px-space-2xs py-0.5 rounded uppercase font-bold">
                        BRIDGE ROOT
                      </span>
                    </div>
                    <span className="font-label-tactical text-label-tactical text-on-surface-variant uppercase truncate">
                      {vanguard.type}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-space-2xs bg-tertiary/10 px-space-xs py-space-2xs rounded">
                  <span className="material-symbols-outlined text-tertiary text-[14px]">signal_cellular_alt</span>
                  <span className="font-telemetry-sm text-telemetry-sm text-tertiary font-bold">
                    {vanguard.linkQuality}
                  </span>
                </div>
              </div>

              <div className="p-space-md space-y-space-sm">
                <div className="relative w-full h-28 rounded-lg overflow-hidden bg-surface-container-lowest border border-surface-container-high">
                  <img
                    className="w-full h-full object-cover opacity-80"
                    src={vanguard.imageUrl}
                    alt="Vanguard-01 Quadruped Carrier"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent pointer-events-none"></div>

                  <div className="absolute top-2 left-2 flex items-center gap-space-2xs bg-surface-container-lowest/90 px-space-xs py-space-2xs rounded backdrop-blur-md border border-surface-container-high/60">
                    <span className="material-symbols-outlined text-secondary text-[14px]">hub</span>
                    <span className="font-telemetry-sm text-telemetry-sm text-on-surface font-bold">
                      STATIONARY REPEAT ANCHOR
                    </span>
                  </div>

                  <div className="absolute bottom-2 right-2 flex items-center gap-space-2xs bg-surface-container-lowest/90 px-space-xs py-space-2xs rounded backdrop-blur-md border border-surface-container-high/60">
                    <span className="material-symbols-outlined text-primary text-[14px]">battery_horiz_075</span>
                    <span className="font-telemetry-sm text-telemetry-sm text-on-surface font-bold">
                      {vanguard.battery}% POWER
                    </span>
                  </div>
                </div>

                {/* Relay Pod Carousel */}
                <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between border border-surface-container-high/40">
                  <div className="flex items-center gap-space-xs text-left">
                    <span className="material-symbols-outlined text-primary-container text-[20px]">settings_input_antenna</span>
                    <div className="flex flex-col">
                      <span className="font-label-tactical text-label-tactical uppercase text-on-surface-variant">
                        RELAY POD CAROUSEL
                      </span>
                      <span className="font-telemetry-base text-telemetry-base text-on-surface font-bold">
                        {vanguard.podsRemaining}/{vanguard.totalPods} PODS REMAINING
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: vanguard.totalPods ?? 4 }).map((_, i) => {
                      const isRemaining = i < (vanguard.podsRemaining ?? 0);
                      return (
                        <span
                          key={i}
                          className={`w-3.5 h-3.5 rounded-full transition-all ${
                            isRemaining ? 'bg-tertiary shadow-[0_0_6px_#56e5a9]' : 'bg-surface-container-highest opacity-40'
                          }`}
                          title={`Pod ${i + 1}: ${isRemaining ? 'Ready to Deploy' : 'Deployed'}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-space-md pt-0 grid grid-cols-2 gap-space-sm">
              <button
                onClick={() => handleEjectRelay('VANGUARD-01')}
                disabled={(vanguard.podsRemaining ?? 0) <= 0}
                className="min-h-touch-min bg-primary-container text-on-primary-container disabled:opacity-40 rounded font-headline-sm text-headline-sm uppercase font-bold flex items-center justify-center gap-space-xs shadow-md active:scale-95 transition-transform hover:bg-primary"
              >
                <span className="material-symbols-outlined text-[20px]">eject</span>
                <span>Eject Relay Pod</span>
              </button>

              <button
                onClick={() => handleAdvance('VANGUARD-01', 15)}
                className="min-h-touch-min bg-surface-container-highest hover:bg-surface-bright text-on-surface rounded font-headline-sm text-headline-sm uppercase font-bold flex items-center justify-center gap-space-xs active:scale-95 transition-transform border border-surface-container-highest"
              >
                <span className="material-symbols-outlined text-secondary text-[20px]">north</span>
                <span>Advance 15m</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* High-Consequence Batch Protocols Bar */}
      <div className="w-full bg-surface-container-high rounded-xl p-space-sm shadow-2xl flex flex-col space-y-space-xs border border-surface-container-highest">
        <div className="flex items-center justify-between px-space-2xs">
          <span className="font-label-tactical text-label-tactical uppercase text-on-surface-variant font-bold">
            HIGH-CONSEQUENCE BATCH PROTOCOLS
          </span>
          <span className="font-telemetry-sm text-telemetry-sm text-primary font-bold">
            FIELD LEVEL OVERRIDE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
          <button
            onClick={handleBroadcastSync}
            className="min-h-touch-tactical bg-surface-container-low hover:bg-surface-container-highest text-secondary rounded p-space-xs flex flex-col items-center justify-center text-center active:scale-95 transition-transform border border-secondary/30"
          >
            <div className="flex items-center gap-space-2xs">
              <span className="material-symbols-outlined text-[18px]">cell_merge</span>
              <span className="font-headline-sm text-headline-sm font-bold uppercase">
                Broadcast Sync
              </span>
            </div>
            <span className="font-label-tactical text-label-tactical text-on-surface-variant mt-0.5">
              PUSH CACHE TO RELAYS
            </span>
          </button>

          {/* Press and Hold Recall Button */}
          <button
            id="recall-btn"
            onMouseDown={startEmergencyHold}
            onMouseUp={abortEmergencyHold}
            onMouseLeave={abortEmergencyHold}
            onTouchStart={startEmergencyHold}
            onTouchEnd={abortEmergencyHold}
            className="min-h-touch-tactical bg-error-container text-on-error-container rounded p-space-xs flex flex-col items-center justify-center text-center active:scale-95 transition-transform relative overflow-hidden border border-error/40 shadow-lg"
          >
            <div className="flex items-center gap-space-2xs relative z-10">
              <span className="material-symbols-outlined text-[18px]">warning</span>
              <span className="font-headline-sm text-headline-sm font-bold uppercase">
                Recall All
              </span>
            </div>
            <span className="font-label-tactical text-label-tactical text-on-error-container mt-0.5 relative z-10 font-bold">
              {isHolding
                ? `RECALLING... ${Math.min(Math.round(holdProgress), 100)}%`
                : 'HOLD 1.5S FOR SURFACE EVAC'}
            </span>

            {/* Dynamic Hold Progress Fill */}
            <div className="w-full bg-surface-container-lowest h-1.5 mt-1 rounded-full overflow-hidden relative z-10">
              <div
                className="bg-error h-full transition-all duration-75"
                style={{ width: `${holdProgress}%` }}
              ></div>
            </div>
          </button>
        </div>
      </div>

      {/* Teleoperation Modal */}
      <TeleoperationModal
        isOpen={teleopOpen}
        onClose={() => setTeleopOpen(false)}
        onShowToast={onShowToast}
      />

      {/* Configure Auto-Rendezvous Modal for SCOUT-02 */}
      {rendezvousModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container rounded-2xl max-w-md w-full p-space-md space-y-space-md border border-primary/40 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-surface-container-highest pb-space-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">sync_alt</span>
                <span className="font-headline-sm text-headline-sm uppercase font-bold text-on-surface">
                  Configure Auto-Rendezvous
                </span>
              </div>
              <button
                onClick={() => setRendezvousModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Select the rendezvous anchor node where SCOUT-02 will dump its high-resolution LiDAR and acoustic SLAM point cache after navigating the Faraday corridor:
            </p>

            <div className="space-y-2">
              {[
                'Mesh Node 3 (Spine Anchor)',
                'Vanguard-01 (Bridge Root Quadruped)',
                'Surface Mobile Staging Mast',
              ].map((node) => (
                <button
                  key={node}
                  onClick={() => setSelectedRendezvousNode(node)}
                  className={`w-full p-space-sm rounded-lg flex items-center justify-between transition-all ${
                    selectedRendezvousNode === node
                      ? 'bg-primary-container text-on-primary-container font-bold'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <span className="font-body-sm text-body-sm">{node}</span>
                  {selectedRendezvousNode === node && (
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  )}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setRendezvousModalOpen(false)}
                className="py-2 rounded bg-surface-container-highest text-on-surface font-headline-sm text-[13px] uppercase font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setRendezvousModalOpen(false);
                  onShowToast(`SCOUT-02: Auto-Rendezvous node assigned to [${selectedRendezvousNode}]`, 'done_all', 'text-tertiary');
                }}
                className="py-2 rounded bg-primary text-on-primary font-headline-sm text-[13px] uppercase font-bold hover:bg-primary-container shadow"
              >
                Confirm Vector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
