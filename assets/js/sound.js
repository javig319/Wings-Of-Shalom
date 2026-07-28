/* ============================================================================
   WINGS OF SHALOM — sound.js
   Gentle background hymn (public-domain "Amazing Grace" / New Britain),
   synthesized with the Web Audio API — no external files, fully self-contained.
   Quiet by default, loops softly, with a header button to play / mute.
   Starts only after a user gesture (browser autoplay policy) and remembers the
   visitor's choice. To use a real recording instead, drop an <audio> in and
   call WOS_MUSIC.useElement(el).
   ========================================================================== */
(function () {
  "use strict";
  var KEY = "wos_music";
  var wantOn = localStorage.getItem(KEY) !== "off";   // default: on (until user mutes)
  var ctx, master, delay, playing = false, loopTimer = null, pedal = null;

  var NOTE = { D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25 };
  var BEAT = 0.64;                                     // slow, calming
  var MEL = [
    ["D4",1],["G4",2],["B4",1],["G4",1],["B4",2],["A4",1],["G4",2],["E4",1],["D4",3],
    ["D4",1],["G4",2],["B4",1],["G4",1],["B4",2],["A4",1],["D5",3],["D5",1],
    ["E5",2],["D5",1],["B4",2],["G4",1],["B4",2],["A4",1],["G4",2],["E4",1],["D4",3],
    ["D4",1],["G4",2],["B4",1],["G4",1],["B4",2],["A4",1],["G4",3]
  ];

  var ICON_ON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 17V4l10-2v12"/><circle cx="6.5" cy="18" r="2.6"/><circle cx="16.5" cy="16" r="2.6"/></svg>';
  var ICON_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 17V4l10-2v12"/><circle cx="6.5" cy="18" r="2.6"/><circle cx="16.5" cy="16" r="2.6"/><line x1="3" y1="3.5" x2="21" y2="21" stroke-width="2.1"/></svg>';

  function buttons() { return Array.prototype.slice.call(document.querySelectorAll("[data-sound-toggle]")); }
  function paint() {
    buttons().forEach(function (b) {
      b.innerHTML = playing ? ICON_ON : ICON_OFF;
      b.classList.toggle("on", playing);
      b.setAttribute("aria-pressed", playing ? "true" : "false");
      b.title = playing ? "Mute hymns" : "Play hymns";
    });
  }

  function build() {
    var AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    delay = ctx.createDelay(); delay.delayTime.value = 0.28;
    var fb = ctx.createGain(); fb.gain.value = 0.32;
    var wet = ctx.createGain(); wet.gain.value = 0.5;
    delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(master);
    // soft tonic pedal for warmth
    pedal = ctx.createOscillator(); pedal.type = "sine"; pedal.frequency.value = 196.00; // G3
    var pg = ctx.createGain(); pg.gain.value = 0.02; pedal.connect(pg); pg.connect(master); pedal.start();
    build._delay = delay;
  }

  function voice(freq, start, dur) {
    var o = ctx.createOscillator(); o.type = "triangle"; o.frequency.value = freq;
    var o2 = ctx.createOscillator(); o2.type = "sine"; o2.frequency.value = freq * 2;
    var g = ctx.createGain(), g2 = ctx.createGain(); g2.gain.value = 0.22;
    var lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2300;
    o.connect(g); o2.connect(g2); g2.connect(g); g.connect(lp); lp.connect(master); lp.connect(build._delay);
    var a = 0.06, r = Math.min(0.32, dur * 0.45);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.linearRampToValueAtTime(0.85, start + a);
    g.gain.setValueAtTime(0.85, start + Math.max(a, dur - r));
    g.gain.exponentialRampToValueAtTime(0.0008, start + dur);
    o.start(start); o2.start(start); o.stop(start + dur + 0.05); o2.stop(start + dur + 0.05);
  }

  function schedule() {
    var t = ctx.currentTime + 0.2;
    for (var i = 0; i < MEL.length; i++) { var f = NOTE[MEL[i][0]], d = MEL[i][1] * BEAT; if (f) voice(f, t, d * 0.95); t += d; }
    var total = t - ctx.currentTime;
    loopTimer = setTimeout(function () { if (playing) schedule(); }, (total + 2.5) * 1000);
  }

  function start() {
    if (playing) return;
    if (!ctx) build();
    if (ctx.state === "suspended") ctx.resume();
    playing = true;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.085, ctx.currentTime + 1.4);   // gentle fade-in, low volume
    schedule(); paint();
  }
  function stop() {
    if (!playing) return;
    playing = false; clearTimeout(loopTimer);
    if (master) { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6); }
    paint();
  }
  function toggle() {
    if (playing) { wantOn = false; localStorage.setItem(KEY, "off"); stop(); }
    else { wantOn = true; localStorage.setItem(KEY, "on"); start(); }
  }

  // Toggle button (header is injected, so delegate)
  document.addEventListener("click", function (e) { if (e.target.closest("[data-sound-toggle]")) { e.preventDefault(); toggle(); } });

  // Auto-start on the first genuine gesture (unless muted or that gesture IS the button)
  function firstGesture(e) {
    if (e && e.target && e.target.closest && e.target.closest("[data-sound-toggle]")) { cleanup(); return; }
    if (wantOn) start();
    cleanup();
  }
  function cleanup() {
    ["pointerdown", "keydown", "touchstart"].forEach(function (ev) { window.removeEventListener(ev, firstGesture); });
  }
  window.addEventListener("pointerdown", firstGesture);
  window.addEventListener("keydown", firstGesture);
  window.addEventListener("touchstart", firstGesture, { passive: true });

  // Initial icon (muted look until it actually plays)
  if (document.readyState !== "loading") setTimeout(paint, 40);
  else document.addEventListener("DOMContentLoaded", function () { setTimeout(paint, 40); });

  window.WOS_MUSIC = { start: start, stop: stop, toggle: toggle };
})();
