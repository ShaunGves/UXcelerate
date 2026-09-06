import React, { useState } from 'react';
import { IntelItem } from '../types';
import { INITIAL_INTEL } from '../data/mockData';
import { playTacticalClick, playSonarPing } from '../utils/audio';

interface IntelScreenProps {
  onShowToast: (msg: string, icon?: string, color?: string) => void;
}

export const IntelScreen: React.FC<IntelScreenProps> = ({ onShowToast }) => {
  const [intelList] = useState<IntelItem[]>(INITIAL_INTEL);
  const [activeFilter, setActiveFilter] = useState<'all' | 'survivor' | 'hazard' | 'route' | 'structural'>('all');
  const [activeEvacRoutes, setActiveEvacRoutes] = useState<{ [id: string]: boolean }>({});
  const [isAudioLinkActive, setIsAudioLinkActive] = useState<boolean>(false);
  const [medicBotDispatched, setMedicBotDispatched] = useState<boolean>(false);

  const filteredItems = intelList.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  const filterCounts = {
    all: intelList.length,
    survivor: intelList.filter((i) => i.category === 'survivor').length,
    hazard: intelList.filter((i) => i.category === 'hazard').length,
    route: intelList.filter((i) => i.category === 'route').length,
    structural: intelList.filter((i) => i.category === 'structural').length,
  };

  const handleDispatchMedic = (item: IntelItem) => {
    playTacticalClick();
    setMedicBotDispatched(true);
    onShowToast(`MEDIC BOT PACK ALPHA DISPATCHED TO ${item.unit} • ETA 3m 40s`, 'medical_services', 'text-primary');
  };

  const handleToggleAudio = () => {
    playSonarPing(800);
    const next = !isAudioLinkActive;
    setIsAudioLinkActive(next);
    onShowToast(
      next
        ? 'TWO-WAY AUDIO CHANNEL ACTIVE • BROADCASTING 2.4kHz COMPRESSED VOICE'
        : 'TWO-WAY AUDIO CHANNEL TERMINATED',
      'record_voice_over',
      next ? 'text-secondary' : 'text-on-surface-variant'
    );
  };

  const handleShareCoords = (coords = '32UNA 8492 1923') => {
    playTacticalClick();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(coords);
    }
    onShowToast(`COORDINATES [${coords}] SYNCED TO EXTRACTION TEAM ALPHA`, 'share_location', 'text-secondary');
  };

  const handleToggleEvac = (id: string) => {
    playTacticalClick();
    const isEvac = !activeEvacRoutes[id];
    setActiveEvacRoutes((prev) => ({ ...prev, [id]: isEvac }));
    onShowToast(
      isEvac
        ? 'CORRIDOR VERIFIED & FLAGGED AS PRIMARY EVACUATION ROUTE'
        : 'CORRIDOR REVERTED TO STANDARD SURVEY CLASSIFICATION',
      'signpost',
      'text-tertiary'
    );
  };

  const handleBroadcastExclusion = () => {
    playTacticalClick();
    onShowToast('EXCLUSION ZONE BROADCAST: 50m Perimeter quarantine transmitted to all USAR units', 'broadcast_on_personal', 'text-error');
  };

  const handlePollSensors = () => {
    playTacticalClick();
    onShowToast('POLLING MESH BUFFER: All 7 node telemetry caches synchronized', 'sync', 'text-tertiary');
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-space-md pb-16">
      {/* EMERGENCY TRIAGE BANNER (TACTICAL HUD) */}
      <section className="px-space-md pt-space-xs">
        <div className="bg-surface-container-high rounded-xl p-space-md shadow-lg flex flex-col space-y-space-xs relative overflow-hidden border border-surface-container-highest">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-space-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping"></span>
              <span className="font-label-tactical text-label-tactical uppercase tracking-wider text-secondary font-bold">
                LIVE DISCOVERY TELEMETRY
              </span>
            </div>
            <span className="font-telemetry-sm text-telemetry-sm text-on-surface-variant uppercase font-bold">
              MGRS: 32UNA 8492 1923
            </span>
          </div>

          <div className="grid grid-cols-3 gap-space-xs pt-space-xs">
            <div className="bg-surface-container-low p-space-xs rounded flex flex-col items-center justify-center text-center border border-surface-container-high/40">
              <div className="flex items-baseline space-x-space-2xs">
                <span className="font-display-lg-mobile text-display-lg-mobile text-secondary leading-none font-bold">
                  {filterCounts.survivor}
                </span>
                <span className="material-symbols-outlined text-secondary text-[18px]">accessibility_new</span>
              </div>
              <span className="font-label-tactical text-label-tactical text-on-surface uppercase mt-space-2xs leading-tight font-bold">
                SURVIVORS
              </span>
            </div>

            <div className="bg-surface-container-low p-space-xs rounded flex flex-col items-center justify-center text-center border border-surface-container-high/40">
              <div className="flex items-baseline space-x-space-2xs">
                <span className="font-display-lg-mobile text-display-lg-mobile text-error leading-none font-bold">
                  {filterCounts.hazard}
                </span>
                <span className="material-symbols-outlined text-error text-[18px]">warning</span>
              </div>
              <span className="font-label-tactical text-label-tactical text-on-surface uppercase mt-space-2xs leading-tight font-bold">
                HAZARDS
              </span>
            </div>

            <div className="bg-surface-container-low p-space-xs rounded flex flex-col items-center justify-center text-center border border-surface-container-high/40">
              <div className="flex items-baseline space-x-space-2xs">
                <span className="font-display-lg-mobile text-display-lg-mobile text-tertiary leading-none font-bold">
                  {filterCounts.route}
                </span>
                <span className="material-symbols-outlined text-tertiary text-[18px]">alt_route</span>
              </div>
              <span className="font-label-tactical text-label-tactical text-on-surface uppercase mt-space-2xs leading-tight font-bold">
                VOID ROUTE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER CHIPS (TACTICAL HORIZONTAL SCROLL) */}
      <section className="px-space-md">
        <div className="flex items-center space-x-space-xs overflow-x-auto no-scrollbar py-space-2xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`filter-chip shrink-0 min-h-touch-min px-space-base rounded-full font-label-tactical text-label-tactical tracking-wider uppercase flex items-center space-x-space-xs shadow-md transition-all active:scale-95 border ${
              activeFilter === 'all'
                ? 'bg-primary text-on-primary border-primary font-bold'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface border-surface-container-highest'
            }`}
          >
            <span>ALL INTEL</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeFilter === 'all'
                  ? 'bg-on-primary/20 text-on-primary font-bold'
                  : 'bg-surface-container-lowest text-on-surface-variant'
              }`}
            >
              {filterCounts.all}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('survivor')}
            className={`filter-chip shrink-0 min-h-touch-min px-space-base rounded-full font-label-tactical text-label-tactical tracking-wider uppercase flex items-center space-x-space-xs transition-all active:scale-95 border ${
              activeFilter === 'survivor'
                ? 'bg-secondary text-on-secondary border-secondary font-bold'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface border-surface-container-highest'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span>SURVIVORS</span>
            <span className="bg-surface-container-lowest px-1.5 py-0.5 rounded-full text-secondary font-bold text-[10px]">
              {filterCounts.survivor}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('hazard')}
            className={`filter-chip shrink-0 min-h-touch-min px-space-base rounded-full font-label-tactical text-label-tactical tracking-wider uppercase flex items-center space-x-space-xs transition-all active:scale-95 border ${
              activeFilter === 'hazard'
                ? 'bg-error text-on-error border-error font-bold'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface border-surface-container-highest'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
            <span>BLOCKED</span>
            <span className="bg-surface-container-lowest px-1.5 py-0.5 rounded-full text-error font-bold text-[10px]">
              {filterCounts.hazard}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('route')}
            className={`filter-chip shrink-0 min-h-touch-min px-space-base rounded-full font-label-tactical text-label-tactical tracking-wider uppercase flex items-center space-x-space-xs transition-all active:scale-95 border ${
              activeFilter === 'route'
                ? 'bg-tertiary text-on-tertiary border-tertiary font-bold'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface border-surface-container-highest'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
            <span>NEW PATHS</span>
            <span className="bg-surface-container-lowest px-1.5 py-0.5 rounded-full text-tertiary font-bold text-[10px]">
              {filterCounts.route}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('structural')}
            className={`filter-chip shrink-0 min-h-touch-min px-space-base rounded-full font-label-tactical text-label-tactical tracking-wider uppercase flex items-center space-x-space-xs transition-all active:scale-95 border ${
              activeFilter === 'structural'
                ? 'bg-primary-container text-on-primary-container border-primary-container font-bold'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface border-surface-container-highest'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
            <span>STRUCTURAL</span>
            <span className="bg-surface-container-lowest px-1.5 py-0.5 rounded-full text-primary-container font-bold text-[10px]">
              {filterCounts.structural}
            </span>
          </button>
        </div>
      </section>

      {/* INTEL STREAM LIST (Responsive Grid on Tablet/Desktop) */}
      <section className="px-space-md space-y-space-base">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-base">
          {filteredItems.map((item) => {
            const isSurvivor = item.category === 'survivor';
            const isRoute = item.category === 'route';
            const isHazard = item.category === 'hazard';
            const isStructural = item.category === 'structural';

            const borderColor = isSurvivor
              ? 'bg-secondary'
              : isRoute
              ? 'bg-tertiary'
              : isHazard
              ? 'bg-error'
              : 'bg-primary-container';

            return (
              <article
                key={item.id}
                className="intel-card bg-surface-container rounded-xl shadow-xl overflow-hidden flex flex-col relative border border-surface-container-high"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${borderColor}`}></div>

                {/* Card Header */}
                <div className="p-space-md bg-surface-container-high flex flex-col space-y-space-xs pl-space-lg border-b border-surface-container-highest/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-space-xs">
                      <span
                        className={`px-2 py-0.5 rounded font-label-tactical text-label-tactical uppercase font-bold tracking-widest flex items-center space-x-1 ${
                          isSurvivor
                            ? 'bg-secondary/15 text-secondary'
                            : isRoute
                            ? 'bg-tertiary/15 text-tertiary'
                            : isHazard
                            ? 'bg-error/20 text-error'
                            : 'bg-primary-container/20 text-primary-container'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSurvivor
                              ? 'bg-secondary animate-ping'
                              : isRoute
                              ? 'bg-tertiary'
                              : isHazard
                              ? 'bg-error animate-ping'
                              : 'bg-primary-container'
                          }`}
                        ></span>
                        <span>{item.tagLabel}</span>
                      </span>
                      <span className="font-telemetry-sm text-telemetry-sm text-on-surface-variant">
                        {item.unit}
                      </span>
                    </div>
                    <span
                      className={`font-telemetry-sm text-telemetry-sm ${
                        isHazard ? 'text-error font-bold' : 'text-primary'
                      }`}
                    >
                      {item.timestamp}
                    </span>
                  </div>

                  <h2
                    className={`font-headline-sm text-headline-sm flex items-center justify-between font-bold text-left ${
                      isHazard ? 'text-error' : 'text-on-surface'
                    }`}
                  >
                    <span>{item.title}</span>
                    {item.confidence && (
                      <span className="font-telemetry-lg text-telemetry-lg text-secondary ml-2 shrink-0">
                        {item.confidence}
                      </span>
                    )}
                  </h2>
                </div>

                {/* Imagery / HUD Viewport */}
                {item.imageUrl && (
                  <div className="relative w-full h-44 bg-surface-container-lowest overflow-hidden border-b border-surface-container-high">
                    <img
                      className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500"
                      src={item.imageUrl}
                      alt={item.title}
                    />

                    {/* Overlay HUD tags */}
                    <div className="absolute inset-0 pointer-events-none p-space-sm flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        {item.radarDepth && (
                          <div className="bg-surface/85 backdrop-blur-md px-2 py-1 rounded text-secondary font-label-tactical text-label-tactical uppercase border border-secondary/30">
                            {item.radarDepth}
                          </div>
                        )}
                        {item.statusNote && (
                          <div
                            className={`bg-surface/85 backdrop-blur-md px-2 py-1 rounded font-label-tactical text-label-tactical uppercase flex items-center space-x-1 border ${
                              isSurvivor
                                ? 'text-tertiary border-tertiary/30'
                                : isHazard
                                ? 'text-error border-error/30'
                                : 'text-on-surface border-surface-container-high'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isSurvivor ? 'bg-tertiary' : isHazard ? 'bg-error' : 'bg-primary'
                              }`}
                            ></span>
                            <span>{item.statusNote}</span>
                          </div>
                        )}
                      </div>

                      {/* Center Crosshair for contact 4 */}
                      {isSurvivor && (
                        <div className="flex justify-center items-center">
                          <div className="w-12 h-12 rounded-full border border-secondary/40 flex items-center justify-center animate-pulse">
                            <span className="material-symbols-outlined text-secondary text-[24px]">adjust</span>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-end">
                        <span className="font-telemetry-sm text-telemetry-sm bg-surface/90 px-1.5 py-0.5 rounded text-on-surface-variant">
                          SUBTERRANEAN SENSOR ARRAY
                        </span>
                        {item.slabThickness && (
                          <span className="font-telemetry-sm text-telemetry-sm bg-surface/90 px-1.5 py-0.5 rounded text-primary font-bold">
                            SLAB THICKNESS: {item.slabThickness}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Sensor Telemetry & Audio Waveform */}
                <div className="p-space-md space-y-space-md pl-space-lg flex-1 flex flex-col justify-between">
                  <div className="space-y-space-sm text-left">
                    {/* Audio Waveform for Confirmed Survivor */}
                    {item.acousticPattern && (
                      <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col space-y-space-xs border border-surface-container-high/50">
                        <div className="flex items-center justify-between text-on-surface-variant">
                          <div className="flex items-center space-x-space-xs">
                            <span className="material-symbols-outlined text-[16px] text-secondary">
                              graphic_eq
                            </span>
                            <span className="font-label-tactical text-label-tactical uppercase text-on-surface font-bold">
                              ACOUSTIC CADENCE (420 Hz)
                            </span>
                          </div>
                          <span className="font-telemetry-sm text-telemetry-sm text-secondary font-bold">
                            {item.acousticPattern}
                          </span>
                        </div>

                        {/* Animated Soundwave Equalizer Bars */}
                        <div className="h-10 w-full flex items-end justify-between px-1 gap-1">
                          {[
                            { h: 'h-2', d: '0ms' },
                            { h: 'h-6', d: '75ms' },
                            { h: 'h-8', d: '150ms' },
                            { h: 'h-6', d: '220ms' },
                            { h: 'h-2', d: '0ms' },
                            { h: 'h-1', d: '0ms' },
                            { h: 'h-7', d: '120ms' },
                            { h: 'h-9', d: '200ms' },
                            { h: 'h-7', d: '300ms' },
                            { h: 'h-2', d: '0ms' },
                            { h: 'h-6', d: '180ms' },
                            { h: 'h-8', d: '250ms' },
                            { h: 'h-6', d: '90ms' },
                            { h: 'h-1', d: '0ms' },
                          ].map((bar, idx) => (
                            <div
                              key={idx}
                              className={`w-full bg-secondary ${bar.h} rounded-t animate-pulse transition-all`}
                              style={{ animationDelay: bar.d }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 gap-space-xs">
                      {Object.entries(item.metrics).map(([key, val]) => (
                        <div
                          key={key}
                          className="bg-surface-container-low p-space-xs rounded flex flex-col border border-surface-container-high/40 text-left"
                        >
                          <span className="font-label-tactical text-label-tactical text-on-surface-variant uppercase">
                            {key}
                          </span>
                          <span className="font-telemetry-base text-telemetry-base text-on-surface mt-space-2xs font-bold">
                            {val}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Detail explanation text */}
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      {item.details}
                    </p>
                  </div>

                  {/* High Consequence Action Buttons */}
                  <div className="flex flex-col space-y-space-xs pt-space-2xs">
                    {isSurvivor && (
                      <>
                        <button
                          onClick={() => handleDispatchMedic(item)}
                          disabled={medicBotDispatched}
                          className="w-full min-h-touch-min bg-primary-container text-on-primary-container font-headline-sm text-headline-sm uppercase tracking-wider rounded flex items-center justify-center space-x-space-xs hover:bg-primary transition-all active:scale-[0.98] shadow-md font-bold disabled:opacity-75"
                        >
                          <span className="material-symbols-outlined text-[20px]">medical_services</span>
                          <span>
                            {medicBotDispatched ? 'MEDIC BOT EN ROUTE (3m 40s)' : 'DISPATCH MEDIC BOT'}
                          </span>
                        </button>

                        <div className="grid grid-cols-2 gap-space-xs">
                          <button
                            onClick={handleToggleAudio}
                            className={`min-h-touch-min rounded flex items-center justify-center space-x-space-2xs transition-colors active:scale-95 border ${
                              isAudioLinkActive
                                ? 'bg-secondary text-on-secondary border-secondary font-bold'
                                : 'bg-surface-container-highest text-secondary hover:bg-surface-bright border-surface-container-highest'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {isAudioLinkActive ? 'mic' : 'record_voice_over'}
                            </span>
                            <span className="font-label-tactical text-label-tactical tracking-wider uppercase font-bold">
                              {isAudioLinkActive ? 'AUDIO LIVE' : '2-WAY AUDIO'}
                            </span>
                          </button>

                          <button
                            onClick={() => handleShareCoords()}
                            className="min-h-touch-min bg-surface-container-highest text-on-surface font-headline-sm text-headline-sm rounded flex items-center justify-center space-x-space-2xs hover:bg-surface-bright transition-colors active:scale-95 border border-surface-container-highest"
                          >
                            <span className="material-symbols-outlined text-[18px]">share_location</span>
                            <span className="font-label-tactical text-label-tactical tracking-wider uppercase font-bold">
                              SHARE COORDS
                            </span>
                          </button>
                        </div>
                      </>
                    )}

                    {isRoute && (
                      <button
                        onClick={() => handleToggleEvac(item.id)}
                        className={`w-full min-h-touch-min font-headline-sm text-headline-sm uppercase tracking-wider rounded flex items-center justify-center space-x-space-xs transition-all active:scale-[0.98] shadow-md font-bold ${
                          activeEvacRoutes[item.id]
                            ? 'bg-tertiary-container text-on-tertiary-container ring-2 ring-tertiary'
                            : 'bg-tertiary text-on-tertiary hover:bg-tertiary-container'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">signpost</span>
                        <span>
                          {activeEvacRoutes[item.id]
                            ? 'MARKED AS EVAC CORRIDOR (ACTIVE)'
                            : 'MARK AS EVAC CORRIDOR'}
                        </span>
                      </button>
                    )}

                    {isHazard && (
                      <div className="space-y-2">
                        <div className="bg-error-container/30 p-space-sm rounded-lg flex items-center space-x-space-sm border border-error/40 text-left">
                          <span className="material-symbols-outlined text-error text-[28px] shrink-0">dangerous</span>
                          <div className="flex flex-col min-w-0">
                            <span className="font-label-tactical text-label-tactical text-error uppercase font-bold">
                              CRITICAL LOAD BEARING ALERT
                            </span>
                            <span className="font-body-sm text-body-sm text-on-surface truncate">
                              Main girder buckling. Deflection speed: +1.2mm/min.
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={handleBroadcastExclusion}
                          className="w-full min-h-touch-min bg-error text-on-error font-headline-sm text-headline-sm uppercase tracking-wider rounded flex items-center justify-center space-x-space-xs hover:bg-error-container transition-all active:scale-[0.98] shadow-lg font-bold"
                        >
                          <span className="material-symbols-outlined text-[20px]">broadcast_on_personal</span>
                          <span>EXCLUSION ZONE BROADCAST</span>
                        </button>
                      </div>
                    )}

                    {isStructural && (
                      <button
                        onClick={() =>
                          onShowToast('STRUCTURAL AIR SHAFT PINNED AS LORA BOUNCE REPEAT ANCHOR', 'hub', 'text-primary')
                        }
                        className="w-full min-h-touch-min bg-primary-container text-on-primary-container font-headline-sm text-headline-sm uppercase tracking-wider rounded flex items-center justify-center space-x-space-xs hover:bg-primary transition-all active:scale-[0.98] font-bold"
                      >
                        <span className="material-symbols-outlined text-[20px]">cell_tower</span>
                        <span>DESIGNATE AS RF RELAY BOUNCE</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* PUSH TO REFRESH / MESH BUFFER AUDIT BAR */}
      <footer className="px-space-md pt-space-xs">
        <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between text-on-surface-variant border border-surface-container-high/60">
          <div className="flex items-center space-x-space-xs min-w-0 text-left">
            <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
            <span className="font-telemetry-sm text-telemetry-sm truncate font-bold">
              OFFLINE BUFFER: 0 PENDING / ALL PACKETS DELIVERED
            </span>
          </div>
          <button
            onClick={handlePollSensors}
            className="shrink-0 font-label-tactical text-label-tactical uppercase text-primary bg-surface-container px-3 py-1.5 rounded hover:bg-surface-container-high transition-colors font-bold border border-surface-container-highest shadow-sm active:scale-95"
          >
            POLL SENSORS
          </button>
        </div>
      </footer>
    </div>
  );
};
