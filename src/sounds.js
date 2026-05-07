export function playCheckSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    // Two-note chime: E5 then G5
    const notes = [
      { freq: 659.25, start: 0,    dur: 0.12 },
      { freq: 783.99, start: 0.1,  dur: 0.18 },
    ];
    notes.forEach(({ freq, start, dur }) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime  + start + dur + 0.05);
    });
  } catch {}
}
