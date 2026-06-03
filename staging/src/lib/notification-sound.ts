type NotificationTone = "success" | "error" | "warning" | "info";

type ToneConfig = {
  frequency: number;
  volume: number;
  duration: number;
};

const toneMap: Record<NotificationTone, ToneConfig> = {
  success: { frequency: 660, volume: 0.08, duration: 0.18 },
  error: { frequency: 320, volume: 0.11, duration: 0.24 },
  warning: { frequency: 440, volume: 0.09, duration: 0.2 },
  info: { frequency: 560, volume: 0.08, duration: 0.16 },
};

let cachedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (cachedAudioContext) return cachedAudioContext;
  if (typeof window === "undefined") return null;
  const Constructor = window.AudioContext ?? (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Constructor) return null;
  cachedAudioContext = new Constructor();
  return cachedAudioContext;
}

export function playNotificationSound(tone: NotificationTone = "success") {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    void ctx.resume();
  }

  const config = toneMap[tone] || toneMap.success;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = config.frequency;

  gain.gain.setValueAtTime(config.volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + config.duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + config.duration);
}
