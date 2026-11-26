/* =====================================================================
   NIEVE · Partículas en <canvas>, optimizadas para móviles
   - Densidad según el tamaño de pantalla
   - Se pausa con la pestaña oculta y respeta «reducir movimiento»
   ===================================================================== */
(function (PSC) {
  "use strict";

  let canvas, ctx, sprite, flakes = [], raf = 0, w = 0, h = 0, dpr = 1, last = 0, running = false;

  function makeSprite() {
    const c = document.createElement("canvas");
    c.width = c.height = 32;
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(255,255,255,.75)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 32, 32);
    return c;
  }

  function flake(randomY) {
    const depth = Math.random();
    return {
      x: Math.random() * w,
      y: randomY ? Math.random() * h : -10,
      r: 1.2 + depth * 3.2,
      vy: 18 + depth * 42,
      sway: 10 + Math.random() * 22,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.8,
      a: 0.35 + depth * 0.55,
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const target = Math.round(Math.min(110, Math.max(36, (w * h) / 13000)));
    while (flakes.length < target) flakes.push(flake(true));
    flakes.length = target;
  }

  function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    ctx.clearRect(0, 0, w, h);
    const t = now / 1000;
    for (const p of flakes) {
      p.y += p.vy * dt;
      const x = p.x + Math.sin(t * p.speed + p.phase) * p.sway;
      if (p.y > h + 10) Object.assign(p, flake(false));
      ctx.globalAlpha = p.a;
      ctx.drawImage(sprite, x - p.r, p.y - p.r, p.r * 2, p.r * 2);
    }
    raf = requestAnimationFrame(tick);
  }

  function play() {
    if (running) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }
  function pause() {
    running = false;
    cancelAnimationFrame(raf);
  }

  function start(el) {
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    canvas = el;
    ctx = canvas.getContext("2d");
    sprite = makeSprite();
    resize();

    let timer;
    window.addEventListener("resize", () => {
      clearTimeout(timer);
      timer = setTimeout(resize, 150);
    });
    document.addEventListener("visibilitychange", () => (document.hidden ? pause() : play()));
    play();
  }

  PSC.snow = { start };
})(window.PSC = window.PSC || {});
