/* =====================================================================
   CONTENIDO · Inserta los datos de config.js en la página
   - [data-content="ruta.al.dato"] → texto
   - [data-list="ruta"]            → lista de párrafos
   - Programa y lugares            → plantillas generadas
   ===================================================================== */
(function (PSC) {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";

  const get = (obj, path) =>
    path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);

  const isPlaceholder = (text) => /^\s*\[.*\]\s*$/.test(text);

  function setText(el, text) {
    el.textContent = text;
    el.classList.toggle("is-placeholder", isPlaceholder(text));
  }

  /** Crea un elemento HTML con clases y texto opcionales. */
  function h(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text != null) setText(el, String(text));
    return el;
  }

  /** Icono del sprite SVG. */
  function icon(id, className = "icon") {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", className);
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS(SVG_NS, "use");
    use.setAttribute("href", "#" + id);
    svg.appendChild(use);
    return svg;
  }

  function bind(data, root = document) {
    root.querySelectorAll("[data-content]").forEach((el) => {
      const value = get(data, el.dataset.content);
      if (value != null && value !== "") setText(el, String(value));
      else if (el.matches(".details__note, .section-lead")) el.hidden = true;
    });

    root.querySelectorAll("[data-list]").forEach((el) => {
      const items = get(data, el.dataset.list) || [];
      el.replaceChildren(
        ...items.map((text, i) => {
          const p = h("p", null, text);
          p.dataset.reveal = "up";
          p.style.setProperty("--d", `${0.08 + i * 0.1}s`);
          return p;
        })
      );
    });
  }

  function timeChip(hora) {
    const pending = !hora || isPlaceholder(hora);
    const chip = h("span", "tl-time" + (pending ? " is-pending" : ""), pending ? "Por confirmar" : hora);
    chip.classList.remove("is-placeholder");
    return chip;
  }

  /** Línea de tiempo agrupada por etapas (Santa Misa → Convivio). */
  function renderTimeline(container, programa) {
    const frag = document.createDocumentFragment();
    const etapas = programa.etapas || {};
    let currentStage = null;
    let side = 0;

    programa.actividades.forEach((act) => {
      if (act.etapa && act.etapa !== currentStage) {
        if (currentStage && programa.transicion) {
          const tr = h("p", "tl-transition", programa.transicion);
          tr.dataset.reveal = "up";
          frag.appendChild(tr);
        }
        currentStage = act.etapa;
        const info = etapas[act.etapa];
        if (info) {
          const stage = h("div", "tl-stage");
          stage.dataset.reveal = "up";
          stage.append(
            h("span", "tl-stage__num", info.numero),
            h("p", "tl-stage__name", info.nombre),
            h("h3", "tl-stage__title", info.titulo)
          );
          frag.appendChild(stage);
        }
      }

      const item = h("div", "tl-item");
      const node = h("span", "tl-item__node");
      node.appendChild(icon("i-" + (act.icono || "celebracion")));

      if (act.destacado) {
        item.classList.add("tl-item--featured");
        item.dataset.reveal = "zoom";
        const card = h("div", "tl-featured");
        const iconWrap = h("span", "tl-featured__icon");
        iconWrap.appendChild(icon("i-" + (act.icono || "misa")));
        const cross = icon("s-estrella", "tl-featured__cross");
        card.append(
          h("span", "tl-featured__halo"),
          iconWrap,
          h("p", "tl-featured__label", programa.etiquetaDestacado || ""),
          h("h3", "tl-featured__title", act.titulo),
          timeChip(act.hora)
        );
        if (act.descripcion) card.appendChild(h("p", "tl-item__desc", act.descripcion));
        card.appendChild(cross);
        item.append(node, card);
      } else {
        item.classList.add(side++ % 2 === 0 ? "is-left" : "is-right");
        item.dataset.reveal = "up";
        const card = h("div", "tl-item__card");
        card.append(timeChip(act.hora), h("h3", "tl-item__title", act.titulo));
        if (act.descripcion) card.appendChild(h("p", "tl-item__desc", act.descripcion));
        item.append(node, card);
      }
      frag.appendChild(item);
    });

    container.appendChild(frag);
  }

  /** Tarjetas de lugares con botón «Cómo llegar». */
  function renderPlaces(container, fechaLugar) {
    const frag = document.createDocumentFragment();
    (fechaLugar.lugares || []).forEach((lugar, i) => {
      const card = h("article", "info-card place-card");
      if (/misa/i.test(lugar.etiqueta || "")) card.classList.add("place-card--misa");
      card.dataset.reveal = "up";
      card.style.setProperty("--d", `${i * 0.12}s`);

      const iconWrap = h("span", "info-card__icon");
      iconWrap.appendChild(icon("i-lugar"));
      card.append(
        iconWrap,
        h("span", "place-card__tag", lugar.etiqueta),
        h("h3", "place-card__name", lugar.nombre),
        h("p", "place-card__address", lugar.direccion)
      );

      if (lugar.mapa) {
        const link = h("a", "btn btn--ghost");
        link.href = lugar.mapa;
        link.target = "_blank";
        link.rel = "noopener";
        link.append(h("span", null, "Cómo llegar"), icon("i-mapa"));
        link.setAttribute("aria-label", `Cómo llegar a ${lugar.nombre}`);
        card.appendChild(link);
      }
      frag.appendChild(card);
    });
    container.appendChild(frag);
  }

  PSC.content = { get, bind, icon, isPlaceholder, renderTimeline, renderPlaces };
})(window.PSC = window.PSC || {});
