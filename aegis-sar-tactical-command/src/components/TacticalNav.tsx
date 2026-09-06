import React from 'react';
import { ScreenType } from '../types';
import { playTacticalClick } from '../utils/audio';

interface TacticalNavProps {
  currentScreen: ScreenType;
  onScreenChange: (screen: ScreenType) => void;
  survivorCount?: number;
  deployedBotCount?: number;
}

export const TacticalNav: React.FC<TacticalNavProps> = ({
  currentScreen,
  onScreenChange,
  survivorCount = 2,
  deployedBotCount = 3,
}) => {
  const navItems: { id: ScreenType; label: string; icon: string; badge?: string | number; badgeColor?: string }[] = [
    {
      id: 'live-tactical-map',
      label: 'Map',
      icon: 'explore',
      badge: 'LIVE',
      badgeColor: 'bg-secondary/20 text-secondary',
    },
    {
      id: 'robot-fleet',
      label: 'Fleet',
      icon: 'smart_toy',
      badge: `${deployedBotCount}`,
      badgeColor: 'bg-primary/20 text-primary',
    },
    {
      id: 'discovery-intel',
      label: 'Intel',
      icon: 'radar',
      badge: `${survivorCount} HIT`,
      badgeColor: 'bg-tertiary/20 text-tertiary',
    },
    {
      id: 'route-planner',
      label: 'Routes',
      icon: 'alt_route',
      badge: '1 CORR',
      badgeColor: 'bg-surface-container-highest text-on-surface-variant',
    },
  ];

  const handleSelect = (id: ScreenType) => {
    playTacticalClick();
    onScreenChange(id);
  };

  return (
    <>
      {/* Mobile & Tablet Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#0f131b]/95 backdrop-blur-xl shadow-[0_-1px_12px_rgba(0,0,0,0.6)] border-t border-[#262a32] lg:hidden"
        data-active-classes="text-primary font-headline-sm"
      >
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-space-xs">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center justify-center flex-1 min-h-[48px] transition-colors relative ${
                  isActive
                    ? 'text-primary font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <span
                    className={`material-symbols-outlined text-[24px] transition-transform ${
                      isActive ? 'scale-110 text-primary' : ''
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.badge && (
                    <span
                      className={`absolute -top-1 -right-3 text-[8px] font-label-tactical font-bold px-1 rounded-full ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="font-label-tactical text-label-tactical tracking-wider uppercase mt-1">
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 w-8 h-0.5 bg-primary rounded-full shadow-[0_0_8px_#ffc174]"></span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sticky Rail (Left side navigation on large screens) */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-28 bottom-0 w-64 bg-[#0f131b]/90 backdrop-blur-xl border-r border-[#262a32] z-40 p-space-md justify-between">
        <div className="space-y-space-md">
          <div className="px-space-xs py-space-2xs">
            <span className="font-label-tactical text-label-tactical uppercase text-on-surface-variant tracking-wider">
              OPERATIONAL COMMAND
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-space-md py-space-sm rounded-lg transition-all text-left ${
                    isActive
                      ? 'bg-surface-container-high text-primary border-l-4 border-primary font-bold shadow-md'
                      : 'bg-transparent text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-[22px]">
                      {item.icon}
                    </span>
                    <span className="font-headline-sm text-headline-sm uppercase tracking-wide">
                      {item.label}
                    </span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-label-tactical px-1.5 py-0.5 rounded ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tactical Quick Overview Card on Desktop Sidebar */}
          <div className="bg-surface-container-low border border-surface-container-high/60 rounded-xl p-space-sm space-y-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-label-tactical text-label-tactical uppercase text-secondary">
                SECTOR S-07 STATUS
              </span>
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-left">
              <div className="bg-surface-container-lowest p-2 rounded">
                <span className="font-label-tactical text-[9px] text-on-surface-variant block">SURVIVORS</span>
                <span className="font-telemetry-lg text-secondary font-bold">2 CONF</span>
              </div>
              <div className="bg-surface-container-lowest p-2 rounded">
                <span className="font-label-tactical text-[9px] text-on-surface-variant block">HAZARDS</span>
                <span className="font-telemetry-lg text-error font-bold">4 ACTIVE</span>
              </div>
            </div>
            <div className="text-[10px] font-telemetry-sm text-on-surface-variant pt-1 border-t border-surface-container-high">
              RF Carrier: 915MHz • Direct LoRa Link
            </div>
          </div>
        </div>

        {/* Footer Station Status */}
        <div className="bg-surface-container-lowest border border-surface-container-high/40 p-space-sm rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-[18px]">verified_user</span>
            <div className="flex flex-col text-left">
              <span className="font-label-tactical text-[9px] text-on-surface-variant uppercase">COMMAND STATION</span>
              <span className="font-telemetry-sm text-on-surface font-bold">ALPHA MOBILE HUB</span>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-tertiary"></span>
        </div>
      </aside>
    </>
  );
};
