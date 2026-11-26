/* =====================================================================
   APP · Punto de entrada: arma la página con los datos de config.js
   ===================================================================== */
(function (PSC, EVENTO) {
  "use strict";

  if (!EVENTO) return;

  document.title = `${EVENTO.bienvenida.titulo} · ${EVENTO.organizacion}`;

  // 1. Ilustraciones y contenido
  PSC.decor.init();
  PSC.content.bind(EVENTO);
  PSC.content.renderTimeline(document.getElementById("timeline"), EVENTO.programa);
  PSC.content.renderPlaces(document.getElementById("places"), EVENTO.fechaLugar);
  PSC.effects.splitHeroTitle(document.querySelector("[data-hero-title]"));

  // 2. Interacciones
  PSC.effects.init(EVENTO);
  PSC.music.init(document.getElementById("music"), EVENTO.musica);
  PSC.snow.start(document.getElementById("snow"));

  // 3. Sobre de bienvenida: el primer clic inicia también la música
  PSC.intro.init({
    onOpen: () => PSC.music.startFromGesture(),
  });
})(window.PSC, window.EVENTO);
