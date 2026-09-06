// Web Audio API Synthesizer for Subterranean Acoustic Radar & SOS Beacons

let audioCtx: AudioContext | null = null;
let isMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function toggleMute(muted?: boolean): boolean {
  if (muted !== undefined) {
    isMuted = muted;
  } else {
    isMuted = !isMuted;
  }
  return isMuted;
}

export function getMuteState(): boolean {
  return isMuted;
}

/**
 * Play a tactical high-frequency sonar ping
 */
export function playSonarPing(frequency = 1200): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.6, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // Graceful fallback
  }
}

/**
 * Play Morse Code SOS pattern (3 short, 3 long, 3 short)
 */
let sosInterval: number | null = null;

export function playSosPulse(frequency = 880): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const dot = 0.08;
  const dash = 0.22;
  const gap = 0.06;

  // Pattern: 3 dots, 3 dashes, 3 dots
  const sequence = [
    { duration: dot, pause: gap },
    { duration: dot, pause: gap },
    { duration: dot, pause: gap * 2 },
    { duration: dash, pause: gap },
    { duration: dash, pause: gap },
    { duration: dash, pause: gap * 2 },
    { duration: dot, pause: gap },
    { duration: dot, pause: gap },
    { duration: dot, pause: gap },
  ];

  let currentTimeOffset = ctx.currentTime;

  sequence.forEach(({ duration, pause }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, currentTimeOffset);

    gain.gain.setValueAtTime(0.15, currentTimeOffset);
    gain.gain.exponentialRampToValueAtTime(0.001, currentTimeOffset + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(currentTimeOffset);
    osc.stop(currentTimeOffset + duration);

    currentTimeOffset += duration + pause;
  });
}

/**
 * Tactical Telemetry Click
 */
export function playTacticalClick(): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // Ignore
  }
}
