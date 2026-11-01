// Web Audio API Synthesized Emergency Siren
// Generates audible alarm without external audio dependencies

let audioCtx = null;
let osc = null;
let gainNode = null;
let lfo = null;
let isPlaying = false;

export function startEmergencySiren() {
  if (isPlaying) return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    audioCtx = new AudioContext();

    // Primary Tone Oscillator
    osc = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);

    // Modulation Oscillator (LFO for classic European/Indian dual-tone siren sweep)
    lfo = audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(2.5, audioCtx.currentTime); // 2.5 cycles per sec

    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(350, audioCtx.currentTime); // sweep between 450Hz and 1150Hz

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    // Master Volume Gain
    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.35, audioCtx.currentTime + 0.2); // gradual ramp up

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    lfo.start();
    isPlaying = true;
  } catch (err) {
    console.warn('Web Audio emergency siren not permitted or supported:', err);
  }
}

export function stopEmergencySiren() {
  if (!isPlaying) return;

  try {
    if (gainNode && audioCtx) {
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    }
    setTimeout(() => {
      if (osc) {
        osc.stop();
        osc.disconnect();
      }
      if (lfo) {
        lfo.stop();
        lfo.disconnect();
      }
      if (audioCtx) {
        audioCtx.close();
      }
      osc = null;
      lfo = null;
      gainNode = null;
      audioCtx = null;
      isPlaying = false;
    }, 120);
  } catch {
    isPlaying = false;
  }
}
