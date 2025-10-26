
///////////////////////////////////////////////////
const cards = document.querySelectorAll('.card');
let current = 0;

// Aplicamos una transición suave
cards.forEach(card => {
    card.style.transition = "transform 0.6s ease, opacity 0.6s ease";
});

function updateCards() {
    const total = cards.length;

    cards.forEach((card, i) => {
        const index = (i - current + total) % total;

        // Calculamos posición circular
        if (index === 0) {
            // Carta principal (al frente)
            card.style.transform = "translateX(0) scale(1) translateZ(100px)";
            card.style.zIndex = 3;
            card.style.opacity = 1;
        } else if (index === 1) {
            // Siguiente a la derecha
            card.style.transform = "translateX(120px) scale(0.85) translateZ(-80px)";
            card.style.zIndex = 2;
            card.style.opacity = 0.7;
        } else if (index === total - 1) {
            // Anterior a la izquierda
            card.style.transform = "translateX(-120px) scale(0.85) translateZ(-80px)";
            card.style.zIndex = 2;
            card.style.opacity = 0.7;
        } else {
            // Cartas fuera de vista
            card.style.transform = "translateX(0) scale(0.7) translateZ(-200px)";
            card.style.zIndex = 1;
            card.style.opacity = 0;
        }
    });
}

// Botones de control
document.getElementById('nextBtn').addEventListener('click', () => {
    current = (current + 1) % cards.length;
    updateCards();
});

document.getElementById('prevBtn').addEventListener('click', () => {
    current = (current - 1 + cards.length) % cards.length;
    updateCards();
});

// Inicializar
updateCards();
//////////////////////////
async function mostrarSugerencias() {
  const sugerenciaDiv = document.getElementById("sugerencias");

  const response = await fetch("/resultado.txt"); // ahora con la ruta correcta
  if (response.ok) {
    const texto = await response.text();
    sugerenciaDiv.textContent = texto;
  } else {
    sugerenciaDiv.textContent = "No se pudo cargar el archivo.";
  }
}

document.getElementById("btnMostrar").addEventListener("click", mostrarSugerencias);




async function cambiar_Estado() {
  const estadoDiv = document.getElementById("estado");
  const imagenEstado = document.getElementById("imagenMundo");

  const response = await fetch("/estado.txt"); // ahora con la ruta correcta
  if (response.ok) {
    const texto = await response.text();

    if(texto=="1" || texto=="2" || texto=="3" || texto=="4"){
      estadoDiv.textContent = "Estas pobre";
      imagenEstado.style.backgroundImage = "url('gatoPobre.jpg')";
  } else if(texto=="5" || texto=="6" || texto=="7"){
      estadoDiv.textContent = "Estas estable";
      imagenEstado.style.backgroundImage = "url('gatoEstable.jpg')";
  } else{
      estadoDiv.textContent = "Estas super dupis";
      imagenEstado.style.backgroundImage = "url('gatoFeliz.jpeg')";
  }
}
}

document.getElementById("btnMostrar2").addEventListener("click", cambiar_Estado);

// Ejecutar al cargar la página
cambiar_Estado();




/////////////////////////////////////////////

let lecciones = ["titulo1", "titulo2", "titulo3"];
let info = ["descripción1", "descripción2", "descripción3"];
let index = 0;

function leccion_Siguiente() {
  index++;
  if (index >= lecciones.length) {
    index = 0;
  }
  actualizarLeccion();
}

function leccion_Anterior() {
  index--;
  if (index < 0) {
    index = lecciones.length - 1;
  }
  actualizarLeccion();
}

function actualizarLeccion() {
  const titulo = document.getElementById("nombreLeccion");
  const description = document.getElementById("descripcion");
  titulo.textContent = lecciones[index];
  description.textContent = info[index];
}

mostrarSugerencias();