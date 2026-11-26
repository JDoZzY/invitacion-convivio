/* =====================================================================
   DATOS DEL EVENTO · Edita SOLO este archivo para cambiar el contenido.
   ---------------------------------------------------------------------
   - Los textos entre [corchetes] son marcadores pendientes de confirmar.
   - Las horas vacías ("") se muestran como «Por confirmar».
   - Si dejas vacío un enlace de mapa, el botón «Cómo llegar» se oculta.
   ===================================================================== */
window.EVENTO = {
  organizacion: "Pastoral Social Cáritas",

  /* Pantalla inicial (sobre) */
  sobre: {
    titulo: "¡Tienes una invitación especial!",
    indicacion: "Toca el sobre para abrirlo",
    destinatario: "Para ti, con cariño",
  },

  /* Carta que sale del sobre */
  carta: {
    saludo: "Querida familia de",
    mensaje:
      "Con el corazón lleno de gratitud, queremos invitarte a celebrar juntos el nacimiento de Jesús en nuestro Convivio Navideño. Tu presencia hará de este encuentro un momento aún más especial.",
    firma: "Con cariño,",
    boton: "Descubrir la invitación",
  },

  /* A. Bienvenida */
  bienvenida: {
    antetitulo: "Celebremos juntos",
    titulo: "Convivio Navideño",
    subtitulo: "Pastoral Social Cáritas",
    frase:
      "Donde hay un corazón agradecido y una mesa compartida, allí vuelve a nacer la Navidad.",
    anio: "2026",
  },

  /* B. Invitación especial */
  invitacion: {
    antetitulo: "Con alegría",
    titulo: "Una invitación especial",
    parrafos: [
      "Al concluir un año de servicio, entrega y esperanza, deseamos reunirnos como una sola familia para dar gracias a Dios por cada persona que hace posible nuestra misión.",
      "Por ello, tenemos el gusto de invitar a todo el personal, voluntarios y colaboradores de Pastoral Social Cáritas a compartir una jornada de fraternidad, alegría y agradecimiento en nuestro Convivio Navideño.",
    ],
    despedida: "Con aprecio,",
    firma: "Pastoral Social Cáritas",
  },

  /* C. Programa de actividades
     etapa: "misa" | "convivio"  → agrupa la línea de tiempo en dos momentos.
     destacado: true             → tratamiento visual especial (Santa Misa).
     icono: recepcion | misa | traslado | palabras | convivio | comida | juegos | celebracion | cierre
     hora: escribe la hora, p. ej. "9:00 a. m." (vacío = «Por confirmar»).
     descripcion: texto breve opcional (vacío = no se muestra). */
  programa: {
    antetitulo: "Así viviremos este día",
    titulo: "Programa de actividades",
    introduccion: "Iniciaremos nuestra jornada en oración, celebrando juntos la Santa Misa; después compartiremos el convivio.",
    transicion: "Concluida la Santa Misa, continuamos la celebración",
    etiquetaDestacado: "Primer momento de la celebración",
    etapas: {
      misa: { numero: "I", nombre: "Primer momento", titulo: "Celebración Eucarística" },
      convivio: { numero: "II", nombre: "Segundo momento", titulo: "Convivio Navideño" },
    },
    actividades: [
      { hora: "", titulo: "Recepción de participantes", descripcion: "", icono: "recepcion", etapa: "misa" },
      { hora: "", titulo: "Santa Misa", descripcion: "Damos gracias a Dios por el año compartido y por el don de la Navidad.", icono: "misa", etapa: "misa", destacado: true },
      { hora: "", titulo: "Traslado al convivio", descripcion: "", icono: "traslado", etapa: "convivio" },
      { hora: "", titulo: "Palabras de bienvenida", descripcion: "", icono: "palabras", etapa: "convivio" },
      { hora: "", titulo: "Inicio del convivio", descripcion: "", icono: "convivio", etapa: "convivio" },
      { hora: "", titulo: "Almuerzo o cena", descripcion: "", icono: "comida", etapa: "convivio" },
      { hora: "", titulo: "Actividades recreativas y dinámicas", descripcion: "", icono: "juegos", etapa: "convivio" },
      { hora: "", titulo: "Convivencia y celebración", descripcion: "", icono: "celebracion", etapa: "convivio" },
      { hora: "", titulo: "Cierre de la actividad", descripcion: "", icono: "cierre", etapa: "convivio" },
    ],
  },

  /* D. Fecha y lugar */
  fechaLugar: {
    antetitulo: "Reserva la fecha",
    titulo: "Fecha y lugar",
    fecha: "[Día] de diciembre de 2026",   // Texto visible, p. ej. "Sábado 19 de diciembre de 2026"
    horaInicio: "[Hora de inicio]",        // p. ej. "8:00 a. m."
    /* Opcional: fecha y hora en formato ISO para activar la cuenta regresiva
       y el botón «Agregar al calendario». Ej.: "2026-12-19T08:00:00-06:00"
       duracionHoras: duración aproximada del evento para el calendario. */
    fechaISO: "",
    duracionHoras: 6,
    lugares: [
      {
        etiqueta: "Santa Misa",
        nombre: "[Nombre de la parroquia o capilla]",
        direccion: "[Dirección completa]",
        mapa: "", // Enlace de Google Maps, p. ej. "https://maps.app.goo.gl/..."
      },
      {
        etiqueta: "Convivio",
        nombre: "[Nombre del lugar del convivio]",
        direccion: "[Dirección completa]",
        mapa: "",
      },
    ],
    nota: "[Indicaciones adicionales: vestimenta, confirmación de asistencia, etc.]",
  },

  /* E. Cierre */
  cierre: {
    frase:
      "Que esta Navidad nos recuerde que los mejores momentos se construyen compartiendo, agradeciendo y caminando juntos.",
    invitacion: "¡Te esperamos!",
    firma: "Con cariño, Pastoral Social Cáritas",
    compartir: "Compartir invitación",
  },

  /* Música ambiental: reemplaza el archivo manteniendo la ruta o cambia la ruta. */
  musica: {
    archivo: "assets/audio/villancico.mp3",
    volumen: 0.35, // 0 a 1
    titulo: "Noche de paz · arreglo instrumental",
  },
};
