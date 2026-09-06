import React, { useState } from 'react';
import { WaypointNode, HazardTask } from '../types';
import { INITIAL_WAYPOINTS, INITIAL_HAZARD_TASKS } from '../data/mockData';
import { playTacticalClick, playSonarPing } from '../utils/audio';

interface RoutesScreenProps {
  onShowToast: (msg: string, icon?: string, color?: string) => void;
}

export const RoutesScreen: React.FC<RoutesScreenProps> = ({ onShowToast }) => {
  const [waypoints] = useState<WaypointNode[]>(INITIAL_WAYPOINTS);
  const [tasks, setTasks] = useState<HazardTask[]>(INITIAL_HAZARD_TASKS);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncDone, setSyncDone] = useState<boolean>(false);
  const [assignModalTask, setAssignModalTask] = useState<HazardTask | null>(null);

  const handlePushMeshGraph = () => {
    playSonarPing(1000);
    setIsSyncing(true);
    onShowToast('TRANSMITTING ROUTE GRAPH TO 3 FIELD ROBOTS VIA LORA MESH BUS', 'satellite_alt', 'text-primary');

    setTimeout(() => {
      setIsSyncing(false);
      setSyncDone(true);
      playTacticalClick();
      onShowToast('GRAPH SYNCED TO ALL 5 NODES • BYPASS CORRIDOR 02 ACTIVE', 'done_all', 'text-tertiary');

      setTimeout(() => {
        setSyncDone(false);
      }, 3500);
    }, 1800);
  };

  const handleDeployNode = (task: HazardTask) => {
    playTacticalClick();
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: 'DEPLOYING', actionLabel: 'Deploying...' } : t))
    );
    onShowToast(`TASK: [${task.title}] DEPLOYMENT TRIGGERED FOR ${task.assignedAsset}`, 'bolt', 'text-secondary');
  };

  const handleFlagHazmat = (task: HazardTask) => {
    playTacticalClick();
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: 'RESOLVED', actionLabel: 'HAZMAT FlAGGED' } : t))
    );
    onShowToast(`HAZMAT ALERT FLAGGED: POSITIVE-AIR BLOWER DISPATCHED TO ZONE 4`, 'flag', 'text-error');
  };

  const handleAssignConfirm = (assignee: string) => {
    if (!assignModalTask) return;
    playTacticalClick();
    setTasks((prev) =>
      prev.map((t) =>
        t.id === assignModalTask.id
          ? { ...t, assignedAsset: assignee, status: 'ASSIGNED', actionLabel: 'Assigned' }
          : t
      )
    );
    onShowToast(`TASK ASSIGNED TO: ${assignee}`, 'assignment_ind', 'text-primary');
    setAssignModalTask(null);
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-space-md space-y-space-md pb-16">
      {/* Offline Route Mesh Sync Notification Banner */}
      <section className="bg-surface-container-high rounded-xl p-space-sm shadow-md border border-surface-container-highest">
        <div className="flex items-start justify-between gap-space-sm">
          <div className="flex items-center gap-space-xs min-w-0 text-left">
            <span className="material-symbols-outlined text-primary text-[20px] shrink-0 animate-pulse">
              cloud_sync
            </span>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-xs">
                <span className="font-label-tactical text-label-tactical uppercase text-primary tracking-wider font-bold">
                  OFFLINE MESH BUS
                </span>
                <span className="bg-surface-container px-space-xs py-0.5 rounded font-telemetry-sm text-telemetry-sm text-on-surface-variant font-bold">
                  REV 04.9
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface truncate">
                3 Autonomous Units awaiting route graph vector push
              </span>
            </div>
          </div>
          <span className="font-telemetry-sm text-telemetry-sm text-primary-fixed bg-surface-container-lowest px-space-xs py-space-2xs rounded shrink-0 font-bold border border-primary/20">
            14-QUEUED
          </span>
        </div>

        <button
          onClick={handlePushMeshGraph}
          disabled={isSyncing}
          className={`w-full mt-space-sm min-h-touch-min font-headline-sm text-headline-sm uppercase tracking-tight rounded flex items-center justify-center gap-space-xs transition-all active:scale-[0.98] shadow-md font-bold ${
            syncDone
              ? 'bg-tertiary-container text-on-tertiary-container'
              : isSyncing
              ? 'bg-surface-container-highest text-primary animate-pulse'
              : 'bg-primary-container hover:bg-primary text-on-primary-container'
          }`}
          id="push-mesh-btn"
        >
          <span
            className={`material-symbols-outlined text-[18px] ${
              isSyncing ? 'animate-spin' : ''
            }`}
          >
            {syncDone ? 'done_all' : isSyncing ? 'autorenew' : 'satellite_alt'}
          </span>
          <span>
            {syncDone
              ? 'GRAPH SYNCED TO ALL MESH NODES'
              : isSyncing
              ? 'BROADCASTING WAYPOINT GRAPH (3/3 UNITS)...'
              : 'Push Graph To All Autonomous Units'}
          </span>
        </button>
      </section>

      {/* Active Extraction Corridors Status Bar */}
      <section className="bg-surface-container-low rounded-xl p-space-sm shadow-sm space-y-space-xs border border-surface-container-high/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping shrink-0"></span>
            <span className="font-label-tactical text-label-tactical uppercase tracking-wider text-error font-bold">
              STATUS: COMPROMISED
            </span>
          </div>
          <span className="font-telemetry-sm text-telemetry-sm text-on-surface-variant font-bold">
            CRITICALITY: ALPHA-1
          </span>
        </div>

        <div className="bg-surface-container rounded-lg p-space-xs border border-error/30 text-left">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-error text-[18px] shrink-0">report</span>
            <p className="font-telemetry-base text-telemetry-base text-on-surface font-bold tracking-tight">
              SECTOR 7 SURFACE → VOID B3
            </p>
          </div>
          <p className="font-body-sm text-body-sm text-error mt-space-2xs">
            Primary Route compromised: 1 Obstacle detected in Stairwell A shaft. Re-routing through bypass corridor active.
          </p>
        </div>

        {/* Live Telemetry Ticker */}
        <div className="grid grid-cols-3 gap-space-2xs pt-space-2xs">
          <div className="bg-surface-container-lowest p-space-xs rounded flex flex-col border border-surface-container-high/40 text-left">
            <span className="font-label-tactical text-label-tactical text-on-surface-variant font-bold">
              SURVIVOR CONF
            </span>
            <span className="font-telemetry-lg text-telemetry-lg text-tertiary font-bold">96.8%</span>
          </div>
          <div className="bg-surface-container-lowest p-space-xs rounded flex flex-col border border-surface-container-high/40 text-left">
            <span className="font-label-tactical text-label-tactical text-on-surface-variant font-bold">
              ROUTE DIST
            </span>
            <span className="font-telemetry-lg text-telemetry-lg text-primary font-bold">64.2 M</span>
          </div>
          <div className="bg-surface-container-lowest p-space-xs rounded flex flex-col border border-surface-container-high/40 text-left">
            <span className="font-label-tactical text-label-tactical text-on-surface-variant font-bold">
              GAS LEVEL
            </span>
            <span className="font-telemetry-lg text-telemetry-lg text-error font-bold">184 PPM</span>
          </div>
        </div>
      </section>

      {/* 2-Column Responsive Layout for Desktop/Tablet: Timeline on Left, Hazards Queue on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
        {/* Interactive Waypoint Passage Graph */}
        <section className="lg:col-span-7 space-y-space-xs">
          <div className="flex items-center justify-between px-space-2xs">
            <span className="font-headline-sm text-headline-sm uppercase text-on-surface tracking-wider flex items-center gap-space-xs font-bold">
              <span className="material-symbols-outlined text-secondary text-[20px]">timeline</span>
              Passage Graph Timeline
            </span>
            <span className="font-label-tactical text-label-tactical text-secondary uppercase font-bold">
              MGRS: 32UNA 4820 9012
            </span>
          </div>

          <div className="space-y-space-xs">
            {waypoints.map((node, index) => {
              const isClear = node.status === 'CLEAR';
              const isBlocked = node.status === 'BLOCKED';
              const isNew = node.status === 'NEWLY MAPPED';
              const isReached = node.status === 'TARGET REACHED';

              const circleBg = isClear
                ? 'bg-tertiary text-on-tertiary'
                : isBlocked
                ? 'bg-error text-on-error'
                : isNew
                ? 'bg-secondary text-on-secondary'
                : 'bg-tertiary-container text-on-tertiary-container';

              return (
                <div
                  key={node.step}
                  className="bg-surface-container rounded-xl p-space-sm shadow-sm flex gap-space-sm relative border border-surface-container-high text-left"
                >
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className={`w-7 h-7 rounded-full ${circleBg} flex items-center justify-center font-telemetry-sm text-telemetry-sm font-bold shadow-sm`}
                    >
                      {node.step}
                    </div>
                    {index < waypoints.length - 1 && (
                      <div
                        className={`w-0.5 h-full my-1 ${
                          isBlocked
                            ? 'bg-error/40'
                            : isNew
                            ? 'bg-secondary/40'
                            : 'bg-surface-container-highest'
                        }`}
                      ></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-headline-sm text-headline-sm truncate font-bold ${
                          isBlocked ? 'text-on-surface' : isNew ? 'text-secondary' : isReached ? 'text-tertiary' : 'text-on-surface'
                        }`}
                      >
                        {node.title}
                      </span>
                      <span
                        className={`font-label-tactical text-label-tactical px-space-xs py-0.5 rounded font-bold ${node.statusClass}`}
                      >
                        {node.status}
                      </span>
                    </div>

                    <p
                      className={`font-body-sm text-body-sm mt-0.5 ${
                        isBlocked ? 'text-error' : 'text-on-surface-variant'
                      }`}
                    >
                      {node.description}
                    </p>

                    {/* Step 1 Tags */}
                    {isClear && (
                      <div className="flex items-center gap-space-sm mt-space-xs font-telemetry-sm text-telemetry-sm text-on-surface-variant font-bold">
                        <span className="flex items-center gap-space-2xs">
                          <span className="material-symbols-outlined text-[13px] text-tertiary">terrain</span>
                          ELEV: {node.elevation}
                        </span>
                        <span className="flex items-center gap-space-2xs">
                          <span className="material-symbols-outlined text-[13px] text-secondary">sensors</span>
                          {node.mappedBy}
                        </span>
                      </div>
                    )}

                    {/* Step 2 Obstacle Visual Capture */}
                    {isBlocked && node.obstacleImage && (
                      <div className="mt-space-xs rounded overflow-hidden bg-surface-container-lowest flex items-center gap-space-xs p-space-xs border border-surface-container-high">
                        <div className="w-16 h-12 rounded bg-surface-container-high shrink-0 relative flex items-center justify-center overflow-hidden">
                          <img
                            className="w-full h-full object-cover"
                            src={node.obstacleImage}
                            alt="Obstacle capture"
                          />
                          <span className="absolute bottom-0.5 right-0.5 font-label-tactical text-[8px] bg-surface-dim/80 text-primary px-0.5 font-bold">
                            IR
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-label-tactical text-label-tactical text-on-surface-variant block">
                            LOGGED BY: ROV VANGUARD-1
                          </span>
                          <span className="font-telemetry-sm text-telemetry-sm text-on-surface truncate block font-bold">
                            OBSTACLE REF {node.obstacleRef}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Step 3 Clearance Tags */}
                    {isNew && (
                      <div className="flex flex-wrap items-center gap-space-xs mt-space-xs">
                        <span className="bg-surface-container-low font-telemetry-sm text-telemetry-sm text-on-surface-variant px-space-xs py-space-2xs rounded flex items-center gap-space-2xs border border-surface-container-high/40">
                          <span className="material-symbols-outlined text-[13px] text-primary">straighten</span>
                          CLR: {node.clearance}
                        </span>
                        <span className="bg-surface-container-low font-telemetry-sm text-telemetry-sm text-on-surface-variant px-space-xs py-space-2xs rounded flex items-center gap-space-2xs border border-surface-container-high/40">
                          <span className="material-symbols-outlined text-[13px] text-tertiary">smart_toy</span>
                          {node.mappedBy}
                        </span>
                      </div>
                    )}

                    {/* Step 4 Target Reached Telemetry */}
                    {isReached && (
                      <div className="flex items-center justify-between mt-space-xs bg-surface-container-lowest p-space-xs rounded border border-tertiary/20">
                        <div className="flex items-center gap-space-xs">
                          <span className="material-symbols-outlined text-tertiary text-[18px]">favorite</span>
                          <span className="font-telemetry-sm text-telemetry-sm text-on-surface font-bold">
                            {node.vitals}
                          </span>
                        </div>
                        <span className="font-label-tactical text-label-tactical text-tertiary uppercase font-bold">
                          DEPTH: {node.depth}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Barrier & Hazard Mitigation Task Manager */}
        <section className="lg:col-span-5 space-y-space-xs">
          <div className="flex items-center justify-between px-space-2xs">
            <span className="font-headline-sm text-headline-sm uppercase text-on-surface tracking-wider flex items-center gap-space-xs font-bold">
              <span className="material-symbols-outlined text-primary text-[20px]">handyman</span>
              Hazard Mitigation Queue
            </span>
            <span className="font-telemetry-sm text-telemetry-sm text-primary font-bold">
              {tasks.length} ACTIVE
            </span>
          </div>

          <div className="space-y-space-xs">
            {tasks.map((task) => {
              const isPriority1 = task.priority === 'PRIORITY 1';
              const isRf = task.priority === 'RF REPEAT';
              const isLethal = task.priority === 'LETHAL ENV';

              return (
                <div
                  key={task.id}
                  className="bg-surface-container rounded-xl p-space-sm shadow-sm space-y-space-xs border border-surface-container-high text-left"
                >
                  <div className="flex items-start justify-between gap-space-xs">
                    <div className="min-w-0">
                      <div className="flex items-center gap-space-xs">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            isPriority1 ? 'bg-primary' : isRf ? 'bg-secondary' : 'bg-error'
                          }`}
                        ></span>
                        <span className="font-headline-sm text-headline-sm text-on-surface truncate font-bold">
                          {task.title}
                        </span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">
                        {task.description}
                      </span>
                    </div>
                    <span
                      className={`font-label-tactical text-label-tactical px-space-xs py-0.5 rounded shrink-0 font-bold ${
                        isPriority1
                          ? 'bg-primary-fixed-dim/20 text-primary-fixed-dim'
                          : isRf
                          ? 'bg-secondary-fixed/20 text-secondary-fixed'
                          : 'bg-error-container text-on-error-container'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  {/* Action row */}
                  {isPriority1 && (
                    <div className="bg-surface-container-low p-space-xs rounded flex flex-col gap-space-2xs border border-surface-container-high/40">
                      <span className="font-label-tactical text-label-tactical text-on-surface-variant uppercase font-bold">
                        RECOMMENDED ALLOCATION:
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="font-telemetry-base text-telemetry-base text-on-surface flex items-center gap-space-2xs font-bold truncate">
                          <span className="material-symbols-outlined text-primary text-[16px]">
                            precision_manufacturing
                          </span>
                          {task.assignedAsset !== 'Unassigned' ? task.assignedAsset : task.tag}
                        </span>
                        <button
                          onClick={() => setAssignModalTask(task)}
                          className="bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-headline-sm uppercase tracking-tight px-space-md py-space-xs rounded min-h-touch-min flex items-center gap-space-2xs transition-colors shadow-sm font-bold shrink-0 ml-2"
                        >
                          <span className="material-symbols-outlined text-[16px]">send</span>
                          <span>{task.actionLabel}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {isRf && (
                    <div className="bg-surface-container-low p-space-xs rounded flex items-center justify-between border border-surface-container-high/40">
                      <div className="flex items-center gap-space-xs min-w-0">
                        <div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center text-secondary shrink-0">
                          <span className="material-symbols-outlined text-[18px]">cell_tower</span>
                        </div>
                        <div className="truncate">
                          <span className="font-label-tactical text-label-tactical text-on-surface-variant block">
                            ASSIGNED ASSET:
                          </span>
                          <span className="font-telemetry-base text-telemetry-base text-on-surface font-bold">
                            {task.tag}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeployNode(task)}
                        className="bg-secondary hover:bg-secondary-container text-on-secondary font-headline-sm text-headline-sm uppercase tracking-tight px-space-md py-space-xs rounded min-h-touch-min flex items-center gap-space-2xs transition-colors shadow-sm font-bold shrink-0 ml-2"
                      >
                        <span className="material-symbols-outlined text-[16px]">bolt</span>
                        <span>{task.actionLabel}</span>
                      </button>
                    </div>
                  )}

                  {isLethal && (
                    <div className="bg-surface-container-low p-space-xs rounded flex items-center justify-between border border-surface-container-high/40">
                      <div className="flex items-center gap-space-xs min-w-0">
                        <span className="material-symbols-outlined text-error text-[20px] shrink-0">warning</span>
                        <span className="font-telemetry-sm text-telemetry-sm text-error font-bold truncate">
                          REQUIRED BEFORE HUMAN ENTRY
                        </span>
                      </div>
                      <button
                        onClick={() => handleFlagHazmat(task)}
                        className="bg-surface-container-highest hover:bg-error hover:text-on-error text-error font-headline-sm text-headline-sm uppercase tracking-tight px-space-md py-space-xs rounded min-h-touch-min flex items-center gap-space-2xs transition-colors font-bold border border-error/30 shrink-0 ml-2"
                      >
                        <span className="material-symbols-outlined text-[16px]">flag</span>
                        <span>{task.actionLabel}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Task Assignment Modal */}
      {assignModalTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container rounded-2xl max-w-md w-full p-space-md space-y-space-md border border-primary/40 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-surface-container-highest pb-space-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">assignment_ind</span>
                <span className="font-headline-sm text-headline-sm uppercase font-bold text-on-surface">
                  Assign Task Resource
                </span>
              </div>
              <button
                onClick={() => setAssignModalTask(null)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Select deployment asset for <span className="text-on-surface font-bold">{assignModalTask.title}</span>:
            </p>

            <div className="space-y-2">
              {[
                { name: 'Vanguard-01 + Heavy Breacher Jaw Kit', status: 'Ready • 88% PWR' },
                { name: 'USAR Tactical Breaching Squad Alpha', status: 'Staging Surface • 4 Min ETA' },
                { name: 'Scout-02 Micro-Cutter Payload', status: 'Ready • Armed' },
              ].map((res) => (
                <button
                  key={res.name}
                  onClick={() => handleAssignConfirm(res.name)}
                  className="w-full p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container-high border border-surface-container-highest/60 flex items-center justify-between text-left transition-all"
                >
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-[13px] font-bold text-on-surface">
                      {res.name}
                    </span>
                    <span className="font-telemetry-sm text-[11px] text-tertiary">
                      {res.status}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-primary text-[18px]">send</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setAssignModalTask(null)}
              className="w-full py-2 rounded bg-surface-container-highest text-on-surface font-headline-sm text-[13px] uppercase font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
