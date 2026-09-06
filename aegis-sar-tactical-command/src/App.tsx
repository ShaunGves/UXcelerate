/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ScreenType } from './types';
import { TacticalHeader } from './components/TacticalHeader';
import { TacticalNav } from './components/TacticalNav';
import { MapScreen } from './components/MapScreen';
import { FleetScreen } from './components/FleetScreen';
import { IntelScreen } from './components/IntelScreen';
import { RoutesScreen } from './components/RoutesScreen';
import { ToastBanner } from './components/ToastBanner';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('live-tactical-map');
  const [toast, setToast] = useState<{ message: string; icon?: string; color?: string } | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const showToast = (message: string, icon = 'info', color = 'text-primary') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, icon, color });
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0f131b] text-[#dfe2ed] flex flex-col antialiased selection:bg-primary/30 selection:text-primary">
      {/* Tactical Status Header */}
      <TacticalHeader
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
        onShowToast={showToast}
      />

      {/* Global Toast Notification */}
      <ToastBanner
        message={toast?.message ?? null}
        icon={toast?.icon}
        colorClass={toast?.color}
      />

      {/* Responsive Navigation: Left Sidebar on Desktop (lg+), Bottom Nav on Mobile/Tablet */}
      <TacticalNav
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
        survivorCount={2}
        deployedBotCount={3}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full pt-28 pb-24 lg:pb-8 lg:pl-64 transition-all">
        <div className="w-full">
          {currentScreen === 'live-tactical-map' && (
            <MapScreen
              onShowToast={showToast}
              onNavigateToFleet={() => setCurrentScreen('robot-fleet')}
            />
          )}

          {currentScreen === 'robot-fleet' && (
            <FleetScreen onShowToast={showToast} />
          )}

          {currentScreen === 'discovery-intel' && (
            <IntelScreen onShowToast={showToast} />
          )}

          {currentScreen === 'route-planner' && (
            <RoutesScreen onShowToast={showToast} />
          )}
        </div>
      </main>
    </div>
  );
}
