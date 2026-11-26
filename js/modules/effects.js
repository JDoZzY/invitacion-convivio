/* =====================================================================
   EFECTOS · Apariciones al desplazarse, título animado, parallax,
   progreso de la línea de tiempo, cuenta regresiva, calendario y compartir
   ===================================================================== */
(function (PSC) {
  "use strict";

  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Aparición progresiva ---------- */
  function reveal() {
    const items = document.querySelectorAll("[data-reveal], [data-wreath], .tl-item");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ---------- Título principal: palabra manuscrita + letras en cascada ---------- */
  function splitHeroTitle(el) {
    if (!el) return;
    const text = el.textContent.trim();
    const [first, ...rest] = text.split(/\s+/);
    el.textContent = "";

    const sr = document.createElement("span");
    sr.className = "visually-hidden";
    sr.textContent = text;

    const visual = document.createElement("span");
    visual.setAttribute("aria-hidden", "true");
    visual.style.display = "contents";

    const script = document.createElement("span");
    script.className = "hero__title-script";
    script.dataset.enter = "";
    script.style.setProperty("--d", ".35s");
    script.textContent = first;
    visual.appendChild(script);

    if (rest.length) {
      const main = document.createElement("span");
      main.className = "hero__title-main";
      [...rest.join(" ")].forEach((ch, i) => {
        const c = document.createElement("span");
        c.className = "hero__char";
        c.style.setProperty("--i", i);
        c.textContent = ch === " " ? " " : ch;
        main.appendChild(c);
      });
      visual.appendChild(main);
    }
    el.append(sr, visual);
  }

  /* ---------- Desplazamiento: progreso, parallax y línea de tiempo ---------- */
  function scrollEffects() {
    const bar = document.querySelector(".scroll-progress span");
    const timeline = document.getElementById("timeline");
    const hero = document.querySelector(".hero");
    const parallax = reduceMotion() ? [] : [...document.querySelectorAll("[data-parallax]")];
    let ticking = false;

    function update() {
      ticking = false;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      if (bar) bar.style.setProperty("--p", max > 0 ? (y / max).toFixed(4) : 0);

      if (hero && y < hero.offsetHeight * 1.2) {
        parallax.forEach((el) => {
          el.style.translate = `0 ${(y * parseFloat(el.dataset.parallax)).toFixed(1)}px`;
        });
      }
      if (timeline) {
        const r = timeline.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh * 0.62 - r.top) / r.height));
        timeline.style.setProperty("--tp", p.toFixed(4));
      }
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  /* ---------- Aviso breve ---------- */
  let toastTimer;
  function toast(msg) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2800);
  }

  /* ---------- Fecha del evento (opcional) ---------- */
  function eventDate(cfg) {
    const iso = cfg.fechaLugar && cfg.fechaLugar.fechaISO;
    if (!iso) return null;
    const d = new Date(iso);
    return isNaN(d) ? null : d;
  }

  function countdown(cfg) {
    const date = eventDate(cfg);
    const box = document.getElementById("countdown");
    if (!date || !box) return;
    const out = {};
    box.querySelectorAll("[data-cd]").forEach((el) => (out[el.dataset.cd] = el));
    const tick = () => {
      const diff = date - Date.now();
      if (diff <= 0) {
        box.hidden = true;
        clearInterval(timer);
        return;
      }
      box.hidden = false;
      out.d.textContent = Math.floor(diff / 864e5);
      out.h.textContent = String(Math.floor(diff / 36e5) % 24).padStart(2, "0");
      out.m.textContent = String(Math.floor(diff / 6e4) % 60).padStart(2, "0");
      out.s.textContent = String(Math.floor(diff / 1e3) % 60).padStart(2, "0");
    };
    const timer = setInterval(tick, 1000);
    tick();
  }

  function calendar(cfg) {
    const date = eventDate(cfg);
    const btn = document.getElementById("add-calendar");
    if (!date || !btn) return;
    btn.hidden = false;
    btn.addEventListener("click", () => {
      const fl = cfg.fechaLugar;
      const end = new Date(date.getTime() + (fl.duracionHoras || 4) * 36e5);
      const stamp = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
      const esc = (s) => String(s || "").replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
      const place = (fl.lugares || [])[0] || {};
      const ics = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Invitacion//Convivio//ES", "BEGIN:VEVENT",
        `UID:${stamp(date)}-convivio@invitacion`,
        `DTSTAMP:${stamp(new Date())}`,
        `DTSTART:${stamp(date)}`,
        `DTEND:${stamp(end)}`,
        `SUMMARY:${esc(cfg.bienvenida.titulo + " · " + cfg.organizacion)}`,
        `LOCATION:${esc([place.nombre, place.direccion].filter(Boolean).join(", "))}`,
        `DESCRIPTION:${esc(cfg.invitacion.parrafos.join("\n\n"))}`,
        "END:VEVENT", "END:VCALENDAR",
      ].join("\r\n");
      const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
      const a = Object.assign(document.createElement("a"), { href: url, download: "convivio-navideno.ics" });
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    });
  }

  function share(cfg) {
    const btn = document.getElementById("share");
    if (!btn) return;
    btn.addEventListener("click", async () => {
      const url = location.href.split("#")[0];
      const text = `${cfg.sobre.titulo} ${cfg.bienvenida.titulo} · ${cfg.organizacion}`;
      if (navigator.share) {
        try {
          await navigator.share({ title: document.title, text, url });
        } catch (e) { /* el usuario canceló */ }
        return;
      }
      window.open(`https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`, "_blank", "noopener");
    });
  }

  /* Distribuye el retraso de entrada en los elementos de la bienvenida */
  function heroEntrance() {
    const seq = [
      [".hero__star", 0.15], [".hero__kicker", 0.3], [".hero__divider", 1.25],
      [".hero__org", 1.4], [".hero__phrase", 1.65], [".hero__badge", 1.95], [".scroll-cue", 2.3],
    ];
    seq.forEach(([sel, d]) => {
      const el = document.querySelector(sel);
      if (el) {
        el.dataset.enter = "";
        el.style.setProperty("--d", d + "s");
      }
    });
  }

  function init(cfg) {
    heroEntrance();
    reveal();
    scrollEffects();
    countdown(cfg);
    calendar(cfg);
    share(cfg);
  }

  PSC.effects = { init, splitHeroTitle, toast, reduceMotion };
})(window.PSC = window.PSC || {});
