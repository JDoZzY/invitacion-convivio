/* =====================================================================
   INTRO · Secuencia de apertura del sobre
   Añade clases de estado a .intro en orden; las transiciones viven en CSS.
   ===================================================================== */
(function (PSC) {
  "use strict";

  // [clase, milisegundos desde el clic]
  const TIMELINE = [
    ["is-s1", 0],     // se rompe el sello
    ["is-s2", 480],   // se abre la solapa
    ["is-s3", 1250],  // la carta sale del sobre
    ["is-s4", 1850],  // el sobre desciende
    ["is-s5", 2350],  // la carta pasa al frente y se centra
    ["is-s6", 3300],  // se despliega la parte superior
    ["is-s7", 3850],  // se despliega la parte inferior
    ["is-s8", 4500],  // aparece el botón
  ];

  let intro, main, cta, opened = false, left = false, hooks = {};

  function run(steps, done) {
    const fast = PSC.effects.reduceMotion();
    steps.forEach(([cls, t]) => setTimeout(() => intro.classList.add(cls), fast ? t * 0.12 : t));
    const total = steps[steps.length - 1][1];
    setTimeout(done, fast ? total * 0.12 + 50 : total + 50);
  }

  function open() {
    if (opened) return;
    opened = true;
    if (hooks.onOpen) hooks.onOpen();
    run(TIMELINE, () => {
      cta.tabIndex = 0;
      cta.focus({ preventScroll: true });
    });
  }

  function leave() {
    if (left) return;
    left = true;
    const fast = PSC.effects.reduceMotion();
    intro.classList.add("is-leaving");
    document.documentElement.classList.remove("is-locked");
    window.scrollTo(0, 0);
    main.inert = false;

    setTimeout(() => {
      document.documentElement.classList.add("is-ready");
      if (hooks.onReveal) hooks.onReveal();
    }, fast ? 50 : 650);

    setTimeout(() => {
      intro.classList.add("is-gone");
      intro.setAttribute("aria-hidden", "true");
      const title = document.getElementById("hero-title");
      if (title) {
        title.tabIndex = -1;
        title.focus({ preventScroll: true });
      }
    }, fast ? 300 : 1500);
  }

  function skip() {
    if (!opened) {
      opened = true;
      if (hooks.onOpen) hooks.onOpen();
    }
    leave();
  }

  function init(options) {
    hooks = options || {};
    intro = document.getElementById("intro");
    main = document.getElementById("main");
    cta = document.getElementById("letter-cta");
    if (!intro) return;

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    main.inert = true;

    document.getElementById("open-envelope").addEventListener("click", open);
    document.getElementById("intro-skip").addEventListener("click", skip);
    cta.addEventListener("click", leave);
  }

  PSC.intro = { init };
})(window.PSC = window.PSC || {});
