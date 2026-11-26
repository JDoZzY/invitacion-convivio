/* =====================================================================
   MÚSICA AMBIENTAL
   - Solo suena tras una interacción del usuario (abrir el sobre o tocar el botón).
   - Un único <audio> en bucle: no se reinicia al recorrer la página.
   - Volumen con fundido; en http(s) usa Web Audio para que el volumen
     también funcione en iPhone (donde audio.volume es de solo lectura).
   ===================================================================== */
(function (PSC) {
  "use strict";

  let audio, btn, cfg;
  let ctx = null, gain = null;
  let playing = false, userPaused = false, resumeOnVisible = false, fadeRaf = 0;

  const canUseGraph = () =>
    /^https?:$/.test(location.protocol) && (window.AudioContext || window.webkitAudioContext);

  function setupGraph() {
    if (ctx || !canUseGraph()) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
      const source = ctx.createMediaElementSource(audio);
      gain = ctx.createGain();
      gain.gain.value = 0;
      source.connect(gain).connect(ctx.destination);
    } catch (e) {
      ctx = null;
      gain = null;
    }
  }

  /** Fundido de volumen hacia `to` en `ms` milisegundos. */
  function fade(to, ms) {
    cancelAnimationFrame(fadeRaf);
    if (gain && ctx) {
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(to, now + ms / 1000);
      audio.volume = 1;
      return new Promise((r) => setTimeout(r, ms));
    }
    return new Promise((resolve) => {
      const from = audio.volume;
      const t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / ms);
        audio.volume = Math.max(0, Math.min(1, from + (to - from) * k));
        if (k < 1) fadeRaf = requestAnimationFrame(step);
        else resolve();
      };
      fadeRaf = requestAnimationFrame(step);
    });
  }

  function render() {
    btn.classList.toggle("is-playing", playing);
    btn.setAttribute("aria-pressed", String(playing));
    btn.setAttribute("aria-label", playing ? "Pausar música" : "Reproducir música");
    btn.title = playing ? "Pausar música" : "Reproducir música";
  }

  function play() {
    setupGraph();
    if (ctx && ctx.state === "suspended") ctx.resume();
    if (!gain) audio.volume = 0;
    playing = true;
    btn.classList.remove("is-pristine");
    render();
    const p = audio.play();
    const onPlay = () => fade(cfg.volumen, 1800);
    if (p && typeof p.then === "function") {
      p.then(onPlay).catch(() => {
        playing = false;
        render();
      });
    } else onPlay();
  }

  function pause() {
    playing = false;
    render();
    fade(0, 450).then(() => {
      if (!playing) audio.pause();
    });
  }

  function toggle() {
    if (playing) {
      userPaused = true;
      pause();
    } else {
      userPaused = false;
      play();
    }
  }

  /** Inicio aprovechando el gesto del usuario al abrir el sobre. */
  function startFromGesture() {
    if (!playing && !userPaused) play();
  }

  function init(button, config) {
    btn = button;
    cfg = Object.assign({ volumen: 0.35 }, config);
    audio = new Audio();
    audio.loop = true;
    audio.preload = "none";
    audio.src = cfg.archivo;
    audio.addEventListener("error", () => {
      playing = false;
      render();
      btn.disabled = true;
      btn.title = "Música no disponible";
    });

    btn.classList.add("is-pristine");
    btn.addEventListener("click", toggle);
    render();

    // Precarga discreta cuando la página ya terminó de cargar
    window.addEventListener("load", () => setTimeout(() => (audio.preload = "auto"), 1200));

    // Pausa cortés si se cambia de aplicación o pestaña
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && playing) {
        resumeOnVisible = true;
        audio.pause();
      } else if (!document.hidden && resumeOnVisible) {
        resumeOnVisible = false;
        if (playing) {
          const p = audio.play();
          if (p && p.catch) p.catch(() => { playing = false; render(); });
        }
      }
    });
  }

  PSC.music = { init, toggle, startFromGesture };
})(window.PSC = window.PSC || {});
