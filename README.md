# Invitación web · Convivio Navideño de Pastoral Social Cáritas

Invitación interactiva hecha con HTML, CSS y JavaScript, sin dependencias ni proceso de compilación.

## Cómo editar los datos del evento

Todo el contenido está en **`js/config.js`**: textos, fecha, horarios, lugares, programa y música.

- Los textos entre `[corchetes]` son datos pendientes: reemplázalos por los reales.
- **Horarios:** escribe la hora en el campo `hora` de cada actividad (p. ej. `"9:00 a. m."`). Si lo dejas vacío, se muestra «Por confirmar».
- **Descripciones:** cada actividad acepta una `descripcion` opcional. Si está vacía, no se muestra.
- **Santa Misa:** lleva `destacado: true`, por eso aparece con su diseño especial. Con `etapa: "misa"` o `"convivio"` se agrupa en el primer o en el segundo momento.
- **Mapas:** pega un enlace de Google Maps en `mapa` y aparecerá el botón «Cómo llegar».
- **Cuenta regresiva y «Agregar al calendario»:** completa `fechaISO` (p. ej. `"2026-12-19T08:00:00-06:00"`). Si está vacío, ambos se ocultan.
- **Indicaciones:** si borras el texto de `nota`, ese párrafo se oculta.

## Música

`assets/audio/villancico.mp3` es un arreglo instrumental original de «Noche de paz» (Franz X. Gruber, 1818, dominio público). Se generó por síntesis, así que no tiene derechos de terceros. Está preparado para repetirse sin cortes.

Para cambiarlo, sustituye el archivo usando el mismo nombre o cambia la ruta en `musica.archivo`. El volumen se ajusta en `musica.volumen` (de 0 a 1).

La música empieza solo cuando la persona abre el sobre o pulsa el botón de música, porque los navegadores no permiten la reproducción automática.

## Ver en local

Puedes abrir `index.html` directamente en el navegador. Para probar igual que en internet (por ejemplo, el control de volumen en iPhone), sírvelo con cualquier servidor estático:

```
npx serve .
```

## Publicar

Sube la carpeta completa a cualquier hosting estático, como Netlify, GitHub Pages, Vercel o Cloudflare Pages. Después, en `index.html`, cambia `og:image` y `og:url` por direcciones **absolutas** (`https://tu-dominio/...`). Así WhatsApp mostrará la vista previa con el sobre (`assets/img/og-cover.jpg`).

## Estructura

```
index.html              Estructura de la página
css/base.css            Paleta, tipografías y reinicio
css/components.css      Botones, tarjetas, reproductor, apariciones al desplazarse
css/intro.css           Sobre, sello y carta plegada
css/sections.css        Secciones de la página principal
js/config.js            DATOS DEL EVENTO (editar aquí)
js/modules/content.js   Inserta los datos en la página
js/modules/decor.js     Ilustraciones SVG generadas (pino, sello, luces, corona…)
js/modules/intro.js     Secuencia de apertura del sobre
js/modules/music.js     Reproductor de música
js/modules/snow.js      Nieve en canvas
js/modules/effects.js   Animaciones al desplazarse, parallax, cuenta regresiva, compartir
js/app.js               Punto de entrada
```

Si el dispositivo tiene activada la opción «reducir movimiento», se respeta: la nieve y los destellos se desactivan y las transiciones se acortan.
