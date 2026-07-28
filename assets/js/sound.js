/* ============================================================================
   WINGS OF SHALOM — sound.js
   Gentle background hymn — plays the real recording at assets/audio/…mp3
   (public-domain "Be Thou My Vision"). Quiet, looping, with a header button
   to play / mute. Starts on the first user gesture (browser autoplay policy)
   and remembers the visitor's choice.
   Swap the hymn by replacing SRC or the file it points to.
   ========================================================================== */
(function () {
  "use strict";
  var SRC = "assets/audio/be-thou-my-vision.mp3";
  var VOL = 0.32;                                   // calming, not too loud
  var KEY = "wos_music";
  var wantOn = localStorage.getItem(KEY) !== "off"; // default on until muted
  var audio = null, playing = false, fadeTimer = null;

  var ICON_ON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 17V4l10-2v12"/><circle cx="6.5" cy="18" r="2.6"/><circle cx="16.5" cy="16" r="2.6"/></svg>';
  var ICON_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 17V4l10-2v12"/><circle cx="6.5" cy="18" r="2.6"/><circle cx="16.5" cy="16" r="2.6"/><line x1="3" y1="3.5" x2="21" y2="21" stroke-width="2.1"/></svg>';

  function buttons() { return Array.prototype.slice.call(document.querySelectorAll("[data-sound-toggle]")); }
  function paint() {
    buttons().forEach(function (b) {
      b.innerHTML = playing ? ICON_ON : ICON_OFF;
      b.classList.toggle("on", playing);
      b.setAttribute("aria-pressed", playing ? "true" : "false");
      b.title = playing ? "Mute hymn" : "Play hymn";
    });
  }
  function ensure() {
    if (audio) return audio;
    audio = new Audio(SRC);
    audio.loop = true; audio.preload = "auto"; audio.volume = 0; audio.setAttribute("playsinline", "");
    return audio;
  }
  function fadeTo(target, ms) {
    clearInterval(fadeTimer);
    var steps = Math.max(1, Math.round(ms / 50)), i = 0, from = audio.volume, d = (target - from) / steps;
    fadeTimer = setInterval(function () {
      i++; audio.volume = Math.min(1, Math.max(0, from + d * i));
      if (i >= steps) { clearInterval(fadeTimer); if (target === 0) audio.pause(); }
    }, 50);
  }
  function start() {
    ensure();
    var pr = audio.play();
    if (pr && pr.then) pr.then(function () { playing = true; fadeTo(VOL, 1400); paint(); })
      .catch(function () { playing = false; paint(); });   // blocked until a gesture
    else { playing = true; fadeTo(VOL, 1400); paint(); }
  }
  function stop() { if (!audio) return; playing = false; fadeTo(0, 500); paint(); }
  function toggle() {
    if (playing) { wantOn = false; localStorage.setItem(KEY, "off"); stop(); }
    else { wantOn = true; localStorage.setItem(KEY, "on"); start(); }
  }

  document.addEventListener("click", function (e) { if (e.target.closest("[data-sound-toggle]")) { e.preventDefault(); toggle(); } });

  function firstGesture(e) {
    if (e && e.target && e.target.closest && e.target.closest("[data-sound-toggle]")) { cleanup(); return; }
    if (wantOn) start();
    cleanup();
  }
  function cleanup() { ["pointerdown", "keydown", "touchstart"].forEach(function (ev) { window.removeEventListener(ev, firstGesture); }); }
  window.addEventListener("pointerdown", firstGesture);
  window.addEventListener("keydown", firstGesture);
  window.addEventListener("touchstart", firstGesture, { passive: true });

  if (document.readyState !== "loading") setTimeout(paint, 30);
  else document.addEventListener("DOMContentLoaded", function () { setTimeout(paint, 30); });

  window.WOS_MUSIC = { start: start, stop: stop, toggle: toggle };
})();
