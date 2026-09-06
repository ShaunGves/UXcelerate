import React, { useState, useEffect } from 'react';
import { ScreenType } from '../types';
import { AEGIS_EMBLEM_URL } from '../data/mockData';
import { playSosPulse, toggleMute, getMuteState } from '../utils/audio';

interface TacticalHeaderProps {
  currentScreen: ScreenType;
  onScreenChange: (screen: ScreenType) => void;
  onShowToast: (msg: string, icon?: string, color?: string) => void;
}

export const TacticalHeader: React.FC<TacticalHeaderProps> = ({
  currentScreen,
  onShowToast,
}) => {
  const [isSosActive, setIsSosActive] = useState(false);
  const [isMuted, setIsMuted] = useState(getMuteState());
  const [missionClock, setMissionClock] = useState('14:24:19 Z');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, '0');
      const m = String(now.getUTCMinutes()).padStart(2, '0');
      const s = String(now.getUTCSeconds()).padStart(2, '0');
      setMissionClock(`${h}:${m}:${s} Z`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getScreenTitle = (screen: ScreenType) => {
    switch (screen) {
      case 'live-tactical-map':
        return 'Live Tactical Map';
      case 'robot-fleet':
        return 'Robot Fleet';
      case 'discovery-intel':
        return 'Discovery Intel';
      case 'route-planner':
        return 'Route Planner';
    }
  };

  const handleToggleSos = () => {
    const nextState = !isSosActive;
    setIsSosActive(nextState);
    if (nextState) {
      playSosPulse();
      onShowToast('SOS BEACON ACTIVATED • BROADCASTING 880Hz EMERGENCY CADENCE', 'volume_up', 'text-primary-container');
    } else {
      onShowToast('SOS BEACON STANDBY • SILENCED', 'volume_off', 'text-on-surface-variant');
    }
  };

  const handleToggleAudio = () => {
    const nextMute = toggleMute();
    setIsMuted(nextMute);
    onShowToast(nextMute ? 'ACOUSTIC SYNTHESIZER MUTED' : 'ACOUSTIC SYNTHESIZER UNMUTED (1.2kHz)', nextMute ? 'volume_off' : 'volume_up', 'text-secondary');
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#0f131b]/95 backdrop-blur-xl pt-safe shadow-[0_1px_12px_rgba(0,0,0,0.6)] border-b border-[#262a32]">
      <div className="max-w-7xl mx-auto px-space-md py-space-xs flex flex-col justify-between gap-1">
        {/* Top Tier */}
        <div className="flex items-center justify-between gap-space-sm">
          {/* Brand & Active Screen Info */}
          <div className="flex items-center gap-space-sm min-w-0">
            <div className="relative shrink-0 w-8 h-8 rounded overflow-hidden bg-surface-container-low border border-outline-variant/30 flex items-center justify-center">
              <img
                src={AEGIS_EMBLEM_URL}
                alt="Aegis-SAR Emblem"
                className="h-8 w-auto object-contain"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-tactical text-label-tactical uppercase tracking-wider text-secondary flex items-center gap-1.5">
                AEGIS-SAR COMMAND
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                <span className="hidden sm:inline text-[10px] text-on-surface-variant tracking-normal font-telemetry-sm">SUB-VOID OPS</span>
              </span>
              <div className="flex items-center gap-space-2xs">
                <span className="font-headline-sm text-headline-sm uppercase text-on-surface tracking-tight leading-none truncate">
                  {getScreenTitle(currentScreen)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions / Clock / SOS / Profile */}
          <div className="flex items-center gap-space-xs shrink-0">
            {/* Mission Clock on Tablet/Desktop */}
            <div className="hidden md:flex items-center gap-1.5 px-space-xs py-1 rounded bg-surface-container-low border border-surface-container-high font-telemetry-sm text-telemetry-sm text-primary">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              <span>{missionClock}</span>
            </div>

            {/* Audio Synth Mute Toggle */}
            <button
              onClick={handleToggleAudio}
              title={isMuted ? 'Unmute Acoustic Audio' : 'Mute Acoustic Audio'}
              className="w-8 h-8 flex items-center justify-center rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isMuted ? 'volume_off' : 'volume_up'}
              </span>
            </button>

            {/* Emergency SOS Toggle */}
            <button
              onClick={handleToggleSos}
              aria-label="Toggle SOS Audio Beacon"
              className={`min-w-touch-min min-h-touch-min px-space-xs sm:px-space-sm flex items-center justify-center rounded transition-all active:scale-95 shadow-md ${
                isSosActive
                  ? 'bg-primary-container text-on-primary-container animate-pulse ring-2 ring-primary'
                  : 'bg-surface-container-high text-primary-container hover:bg-surface-container-highest'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isSosActive ? 'campaign' : 'volume_up'}
              </span>
              <span className="font-label-tactical text-label-tactical ml-space-2xs uppercase font-bold">
                SOS
              </span>
            </button>

            {/* User Avatar */}
            <div
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 ring-1 ring-primary-container shadow-sm cursor-pointer"
              title="USAR Field Operator: Alpha Lead"
              onClick={() => onShowToast('OPERATOR: USAR Lead Tech • Token Verified', 'badge', 'text-primary')}
            >
              <span className="material-symbols-outlined text-on-primary text-[18px]">
                person
              </span>
            </div>
          </div>
        </div>

        {/* Tactical Telemetry Strip */}
        <div className="flex items-center justify-between bg-surface-container-low px-space-sm py-1 rounded border border-surface-container-high/40">
          <div className="flex items-center gap-space-xs min-w-0 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 shrink-0">
              <span className="material-symbols-outlined text-tertiary text-[14px]">hub</span>
              <span className="font-telemetry-sm text-telemetry-sm text-on-surface truncate">
                MESH: 4/5 NODES
              </span>
            </div>
            <span className="text-outline-variant font-telemetry-sm text-telemetry-sm">|</span>
            <span className="font-telemetry-sm text-telemetry-sm text-primary truncate">1.8s</span>
            <span className="text-outline-variant font-telemetry-sm text-telemetry-sm">|</span>
            <span className="font-telemetry-sm text-telemetry-sm text-tertiary truncate">SYNC: ACT</span>
            <span className="hidden sm:inline text-outline-variant font-telemetry-sm text-telemetry-sm">|</span>
            <span className="hidden sm:inline font-telemetry-sm text-telemetry-sm text-secondary truncate">915MHz LoRa FHSS</span>
          </div>

          <div className="flex items-center gap-space-2xs shrink-0 ml-space-xs">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span className="font-label-tactical text-label-tactical uppercase text-on-surface-variant font-bold">
              SEC-07
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
