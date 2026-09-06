# AEGIS-SAR: Subterranean Tactical Search & Rescue Command Hub

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Working%20Application-brightgreen?style=for-the-badge&logo=google-cloud)](https://ais-pre-t3yjfyb3cpydknvjo5gz7i-281662215462.europe-west2.run.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **Live Deployment Link:** [https://ais-pre-t3yjfyb3cpydknvjo5gz7i-281662215462.europe-west2.run.app](https://ais-pre-t3yjfyb3cpydknvjo5gz7i-281662215462.europe-west2.run.app)

---

## 📌 Executive Summary

**AEGIS-SAR** is an incident command user interface designed for Urban Search & Rescue (USAR) operations in GPS-denied, structurally compromised subterranean void environments. 

When structural collapse severs conventional cellular and GPS communications, AEGIS-SAR orchestrates autonomous robot swarms, micro-crawlers, and relay anchors to pinpoint trapped survivors, chart safe extraction corridors, and coordinate human rescue squads in real time.

---

## 🚀 Key Functional Modules

### 1. 🛰️ Live Tactical Map (Vector SLAM Viewport)
- **Interactive Multi-Level Void Floorplan**: Visualizes surveyed subterranean cavities, structural failure lines, and signal attenuation boundaries.
- **Layer Controls**: Instant toggles for **3D LiDAR Point Cloud Mesh**, **Thermal Heat Signatures (FLIR)**, and **Structural Obstacle Footprints**.
- **Interactive Field Unit Tracking**: Real-time telemetry inspect drawer for deployed units (`Vanguard-01`, `Talon-03`, `Scout-02`) and confirmed survivors (`Pocket S-04`).
- **Tactical Field Operations**: One-click drop relay anchor pods, hazard zone tagging, dynamic re-routing, and acoustic beacon ping transmission.

### 2. 🤖 Autonomous Robot Fleet Command
- **Fleet Telemetry Matrix**: High-level status bar tracking deployed units, dropped repeaters, homing status, and combined battery health.
- **Unit Profiles**:
  - **TALON-03 (Micro-Crawler)**: Live thermal feed viewport, sensor health meters, and an interactive **Teleoperation HUD Modal** with virtual drive actuators, crosshair reticle, and FLIR/Optical/NVG filter modes.
  - **SCOUT-02 (Agile Hexapod)**: Corroborated survivor acoustic hits, countdown timer to rendezvous node, and configurable drop vectors.
  - **VANGUARD-01 (Quadruped Bridge Root)**: Antenna link quality, 4-pod relay ejection carousel with dynamic visual tracking, and advance commands.
- **Safety Protocols**: Mesh sync broadcasts and an emergency **1.5s Hold-to-Recall** surface evacuation safety button.

### 3. 📡 Discovery Intel Stream
- **Emergency Triage HUD**: Real-time summary counters for confirmed survivors, structural hazards, and clear void routes.
- **Categorized Filtering**: Instant switching between All Intel, Confirmed Survivors, Blocked Zones, New Paths, and Structural Cavities.
- **Acoustic Cadence Analysis**: Live interactive audio waveform displaying the detected 420 Hz survivor tapping sequence.
- **Field Response Tools**: Dispatch Medic Bot Alpha, engage 2-way compressed voice channel, share MGRS coordinates, and broadcast 50m exclusion quarantines.

### 4. 🗺️ Route Planner & Passage Graph
- **Offline Mesh Bus**: Pushes waypoint passage graphs across all autonomous units via LoRa mesh packet delivery.
- **Passage Graph Timeline**: Step-by-step corridor verification (Staging Ramp → Collapsed Stairwell A with IR camera captures → Bypass Corridor 02 → Survivor Pocket S-04).
- **Hazard Mitigation Queue**: Prioritized actionable tasks (Heavy Breacher Jaws, RF Relay Bounces, HAZMAT gas exhaust blowers) with interactive asset assignment modals.

---

## 🎨 Design Philosophy & UX Highlights

- **Tactical Dark Theme**: Built strictly according to high-contrast tactical palettes (deep void obsidian `#0f131b` with signal amber, hazard crimson, and telemetry emeralds).
- **Synthesized Audio Feedback**: Built-in Web Audio API sound synthesizer generating subtle tactical clicks, 1.2 kHz sonar pings, and low-frequency alert pulses without external audio dependencies.
- **Fully Responsive Architecture**:
  - **Mobile (< 768px)**: Ergonomic bottom navigation with touch targets ≥ 44px.
  - **Tablet (768px – 1024px)**: 2-column adaptive bento-grid layouts.
  - **Desktop (≥ 1024px)**: Fixed left-hand tactical command rail with 12-column viewport layouts.

---

## 💻 Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom tactical typography and spatial design tokens
- **Audio Engine**: Web Audio API Sound Synthesizer
- **Bundler**: Vite
- **Icons**: Google Material Symbols Outlined

---

## 🛠️ Local Development & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   cd <YOUR-REPO-NAME>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📋 Challenge Submission Notes

- **Live URL**: [https://ais-pre-t3yjfyb3cpydknvjo5gz7i-281662215462.europe-west2.run.app](https://ais-pre-t3yjfyb3cpydknvjo5gz7i-281662215462.europe-west2.run.app)
- Designed and built for the UI/UX Search & Rescue Incident Command Challenge.
