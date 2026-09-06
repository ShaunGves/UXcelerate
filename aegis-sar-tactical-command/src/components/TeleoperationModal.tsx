import React, { useState } from 'react';
import { TALON_THERMAL_STREAM_URL } from '../data/mockData';
import { playTacticalClick, playSonarPing } from '../utils/audio';

interface TeleoperationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, icon?: string, color?: string) => void;
}

export const TeleoperationModal: React.FC<TeleoperationModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [filterMode, setFilterMode] = useState<'FLIR' | 'OPTICAL' | 'NVG'>('FLIR');
  const [headlight, setHeadlight] = useState<boolean>(true);
  const [torqueMode, setTorqueMode] = useState<'STANDARD' | 'HIGH_TORQUE'>('HIGH_TORQUE');
  const [pitch, setPitch] = useState<number>(4);
  const [roll, setRoll] = useState<number>(-2);

  if (!isOpen) return null;

  const handleDrive = (direction: string) => {
    playTacticalClick();
    if (direction === 'FWD') {
      setPitch((p) => p + 1);
    } else if (direction === 'REV') {
      setPitch((p) => p - 1);
    } else if (direction === 'LEFT') {
      setRoll((r) => r - 1);
    } else if (direction === 'RIGHT') {
      setRoll((r) => r + 1);
    }
    onShowToast(`TALON-03: DRIVE VECTOR [${direction}] ACKNOWLEDGED`, 'joystick', 'text-tertiary');
  };

  const handleSonarPulse = () => {
    playSonarPing(950);
    onShowToast('TALON-03: FORWARD ACOUSTIC SONAR SCAN FIRED', 'sensors', 'text-secondary');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-space-sm sm:p-space-md bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-surface-container rounded-2xl overflow-hidden shadow-2xl border border-secondary/40 flex flex-col max-h-[95vh]">
        {/* Modal Header */}
        <div className="bg-surface-container-high px-space-md py-space-sm flex items-center justify-between border-b border-surface-container-highest">
          <div className="flex items-center gap-space-sm">
            <div className="w-3 h-3 rounded-full bg-secondary animate-ping"></div>
            <div className="flex flex-col text-left">
              <span className="font-label-tactical text-label-tactical uppercase text-secondary font-bold">
                DIRECT TELEOPERATION LINK
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface uppercase font-bold">
                TALON-03 MICRO-CRAWLER
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm">
            <span className="font-telemetry-sm text-telemetry-sm text-tertiary bg-surface-container-lowest px-space-xs py-1 rounded">
              LATENCY: 18ms
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-highest text-on-surface flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Video Viewport & HUD Overlay */}
        <div className="relative w-full aspect-video bg-black overflow-hidden flex items-center justify-center">
          <img
            src={TALON_THERMAL_STREAM_URL}
            alt="Live Thermal Stream"
            className={`w-full h-full object-cover transition-all duration-300 ${
              filterMode === 'FLIR'
                ? 'hue-rotate-15 contrast-125'
                : filterMode === 'NVG'
                ? 'grayscale sepia contrast-150 brightness-110 hue-rotate-[90deg]'
                : 'contrast-100 brightness-90'
            }`}
          />

          {/* Crosshair Center Reticle */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="relative w-24 h-24 border border-secondary/40 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-secondary rounded-full animate-ping"></div>
              <div className="absolute top-0 w-0.5 h-3 bg-secondary/80"></div>
              <div className="absolute bottom-0 w-0.5 h-3 bg-secondary/80"></div>
              <div className="absolute left-0 w-3 h-0.5 bg-secondary/80"></div>
              <div className="absolute right-0 w-3 h-0.5 bg-secondary/80"></div>
              <span className="absolute -bottom-6 font-telemetry-sm text-[10px] text-secondary tracking-widest">
                LOCK: 14.2M
              </span>
            </div>
          </div>

          {/* Top HUD Stats */}
          <div className="absolute top-2 left-2 flex items-center gap-2 bg-surface/85 backdrop-blur-md px-2 py-1 rounded font-telemetry-sm text-[11px] text-on-surface">
            <span className="material-symbols-outlined text-secondary text-[14px]">explore</span>
            <span>HDG: 042° NE</span>
            <span className="text-outline-variant">|</span>
            <span>PITCH: {pitch}°</span>
            <span className="text-outline-variant">|</span>
            <span>ROLL: {roll}°</span>
          </div>

          <div className="absolute top-2 right-2 flex items-center gap-2 bg-surface/85 backdrop-blur-md px-2 py-1 rounded font-telemetry-sm text-[11px] text-on-surface">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            <span>FLIR RAD: 38.4°C</span>
            <span className="text-outline-variant">|</span>
            <span className="text-primary font-bold">PWR: 74%</span>
          </div>

          {/* Filter Mode Selector Overlay */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-surface/90 backdrop-blur-md p-1 rounded-lg border border-surface-container-highest">
            {(['FLIR', 'OPTICAL', 'NVG'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`px-2 py-0.5 rounded text-[10px] font-label-tactical uppercase font-bold transition-all ${
                  filterMode === mode
                    ? 'bg-secondary text-on-secondary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Toggle Headlight / Torpedo Sonar */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button
              onClick={() => setHeadlight(!headlight)}
              className={`p-1.5 rounded-lg bg-surface/90 backdrop-blur-md border border-surface-container-highest flex items-center gap-1 font-label-tactical text-[10px] uppercase font-bold ${
                headlight ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {headlight ? 'lightbulb' : 'lightbulb_outline'}
              </span>
              <span>LED FLOOD</span>
            </button>
            <button
              onClick={handleSonarPulse}
              className="p-1.5 rounded-lg bg-surface/90 backdrop-blur-md border border-secondary/40 text-secondary flex items-center gap-1 font-label-tactical text-[10px] uppercase font-bold active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">podcasts</span>
              <span>SONAR PING</span>
            </button>
          </div>
        </div>

        {/* Teleoperation Control Deck */}
        <div className="p-space-md bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-md border-t border-surface-container-high">
          {/* Virtual D-Pad / Drive Actuators */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => handleDrive('FWD')}
              className="w-12 h-10 rounded bg-surface-container-high hover:bg-surface-container-highest text-primary flex items-center justify-center shadow active:scale-95 border border-primary/30"
              title="Drive Forward"
            >
              <span className="material-symbols-outlined text-[24px]">keyboard_arrow_up</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDrive('LEFT')}
                className="w-12 h-10 rounded bg-surface-container-high hover:bg-surface-container-highest text-primary flex items-center justify-center shadow active:scale-95 border border-primary/30"
                title="Turn Left"
              >
                <span className="material-symbols-outlined text-[24px]">keyboard_arrow_left</span>
              </button>
              <button
                onClick={() => handleDrive('STOP')}
                className="w-12 h-10 rounded bg-error/20 hover:bg-error/30 text-error flex items-center justify-center shadow active:scale-95 border border-error/40 font-label-tactical text-[10px] font-bold"
                title="Brake"
              >
                STOP
              </button>
              <button
                onClick={() => handleDrive('RIGHT')}
                className="w-12 h-10 rounded bg-surface-container-high hover:bg-surface-container-highest text-primary flex items-center justify-center shadow active:scale-95 border border-primary/30"
                title="Turn Right"
              >
                <span className="material-symbols-outlined text-[24px]">keyboard_arrow_right</span>
              </button>
            </div>
            <button
              onClick={() => handleDrive('REV')}
              className="w-12 h-10 rounded bg-surface-container-high hover:bg-surface-container-highest text-primary flex items-center justify-center shadow active:scale-95 border border-primary/30"
              title="Reverse"
            >
              <span className="material-symbols-outlined text-[24px]">keyboard_arrow_down</span>
            </button>
          </div>

          {/* Motor Configuration & Sensor Status */}
          <div className="flex-1 space-y-space-xs text-left w-full">
            <div className="flex items-center justify-between">
              <span className="font-label-tactical text-label-tactical uppercase text-on-surface-variant">
                TRACK DRIVE SYSTEM
              </span>
              <button
                onClick={() =>
                  setTorqueMode(torqueMode === 'STANDARD' ? 'HIGH_TORQUE' : 'STANDARD')
                }
                className={`px-2 py-0.5 rounded font-label-tactical text-[10px] font-bold ${
                  torqueMode === 'HIGH_TORQUE'
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container text-on-surface'
                }`}
              >
                {torqueMode}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-surface-container p-2 rounded">
                <span className="font-label-tactical text-[9px] text-on-surface-variant uppercase block">
                  SPEED
                </span>
                <span className="font-telemetry-sm text-on-surface font-bold">0.42 m/s</span>
              </div>
              <div className="bg-surface-container p-2 rounded">
                <span className="font-label-tactical text-[9px] text-on-surface-variant uppercase block">
                  SLIPPAGE
                </span>
                <span className="font-telemetry-sm text-tertiary font-bold">2.1% (MINIMAL)</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full min-h-touch-min bg-surface-container-highest hover:bg-surface-bright text-on-surface rounded font-headline-sm text-headline-sm uppercase font-bold flex items-center justify-center gap-2 mt-2"
            >
              <span className="material-symbols-outlined text-[18px]">done</span>
              <span>RELINQUISH MANUAL CONTROL TO AUTONOMOUS PILOT</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
