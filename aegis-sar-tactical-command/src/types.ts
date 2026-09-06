export type ScreenType = 'live-tactical-map' | 'robot-fleet' | 'discovery-intel' | 'route-planner';

export type MapLayer = 'lidar' | 'thermal' | 'obstacle';

export interface RobotUnit {
  id: string;
  callsign: string;
  name: string;
  type: string;
  status: 'LIVE STREAM' | 'AUTONOMOUS' | 'BRIDGE ROOT' | 'HOMING' | 'OFFLINE';
  linkQuality: string;
  linkType: 'DIRECT MESH' | 'T-3m 12s CONTACT' | '94% LINK' | 'INTERMITTENT';
  battery: number;
  location: string;
  coords: string;
  ambientTemp?: string;
  missionStatus: string;
  imageUrl?: string;
  sensors: {
    flir: boolean;
    lidar: string;
    seismic: string;
  };
  podsRemaining?: number;
  totalPods?: number;
}

export interface IntelItem {
  id: string;
  title: string;
  category: 'survivor' | 'hazard' | 'route' | 'structural';
  unit: string;
  timestamp: string;
  confidence?: string;
  urgency: 'CRITICAL' | 'ACCESSIBLE' | 'EXTREME' | 'MONITOR';
  tagLabel: string;
  imageUrl?: string;
  radarDepth?: string;
  slabThickness?: string;
  co2Level?: number;
  respirationBpm?: number;
  acousticPattern?: string;
  details: string;
  metrics: { [key: string]: string | number };
  statusNote?: string;
}

export interface WaypointNode {
  step: string;
  title: string;
  status: 'CLEAR' | 'BLOCKED' | 'NEWLY MAPPED' | 'TARGET REACHED';
  statusClass: string;
  description: string;
  elevation?: string;
  clearance?: string;
  mappedBy?: string;
  vitals?: string;
  depth?: string;
  obstacleImage?: string;
  obstacleRef?: string;
}

export interface HazardTask {
  id: string;
  title: string;
  description: string;
  priority: string;
  tag: string;
  tagColor: string;
  assignedAsset: string;
  status: 'PENDING' | 'ASSIGNED' | 'DEPLOYING' | 'RESOLVED';
  actionLabel: string;
}
