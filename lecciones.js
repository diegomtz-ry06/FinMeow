let preguntaActual = 0;
const preguntas = [
  {
    leccion: "Historial crediticio",
    pregunta: "¿Qué es el historial crediticio?",
    opciones: {
      A: "Registro de pagos",
      B: "Número de tarjeta",
      C: "Fecha de corte"
    },
    correcta: "A",
    explicacion: "El historial crediticio es el registro de cómo has pagado tus deudas."
  },
  {
    leccion: "Día de corte y CAT",
    pregunta: "¿Qué es el CAT?",
    opciones: {
      A: "Costo Anual Total",
      B: "Código de tarjeta",
      C: "Crédito automático"
    },
    correcta: "A",
    explicacion: "El CAT incluye todos los costos asociados a un crédito."
  }
];

function cargarLeccion(nombre) {
  const leccion = preguntas.find(p => p.leccion === nombre);
  if (leccion) {
    preguntaActual = preguntas.indexOf(leccion);
    actualizarVista();
  }
}

function actualizarVista() {
  const p = preguntas[preguntaActual];
  document.getElementById("tituloLeccion").innerText = p.leccion;
  document.getElementById("preguntaQuiz").innerText = p.pregunta;
  document.querySelectorAll(".opciones button").forEach((btn, i) => {
    const key = Object.keys(p.opciones)[i];
    btn.innerText = `${key}: ${p.opciones[key]}`;
    btn.setAttribute("onclick", `verificarRespuesta('${key}')`);
  });
  document.getElementById("feedback").innerText = "";
}

function verificarRespuesta(opcion) {
  const p = preguntas[preguntaActual];
  const feedback = document.getElementById("feedback");
  if (opcion === p.correcta) {
    feedback.innerText = "✅ ¡Correcto!";
  } else {
    feedback.innerText = `❌ Incorrecto. ${p.explicacion}`;
  }
}

function siguientePregunta() {
  preguntaActual = (preguntaActual + 1) % preguntas.length;
  actualizarVista();
}

function goHome() {
  window.location.href = "Inicio.html";
}