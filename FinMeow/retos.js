document.addEventListener("DOMContentLoaded", () => {
  const progressBar = document.getElementById("progress-bar");
  const agregarBtn = document.getElementById("agregarBtn");
  const inputCantidad = document.getElementById("inputCantidad");
  const estadoText = document.getElementById("estadoText");
  const circuitsContainer = document.getElementById("circuits-container");
  const retosCompletados = document.getElementById("retosCompletados");

  const metaSemanal = 100;
  const totalCircuits = 5;

  // Crear círculos
  for (let i = 0; i < totalCircuits; i++) {
    const div = document.createElement("div");
    div.classList.add("circuit");
    circuitsContainer.appendChild(div);
  }

  let progresoActual = 0;

  agregarBtn.addEventListener("click", () => {
    let cantidad = parseFloat(inputCantidad.value);
    if (isNaN(cantidad) || cantidad <= 0) {
      estadoText.textContent = "⚠️ Ingresa una cantidad válida";
      return;
    }

    progresoActual += cantidad;
    if (progresoActual > metaSemanal) progresoActual = metaSemanal;

    let porcentaje = (progresoActual / metaSemanal) * 100;
    progressBar.style.width = porcentaje + "%";

    const circuitos = circuitsContainer.querySelectorAll(".circuit");
    circuitos.forEach((circuit, index) => {
      if ((progresoActual / metaSemanal) * totalCircuits > index) {
        circuit.classList.add("completed");
      } else {
        circuit.classList.remove("completed");
      }
    });

    if (progresoActual >= metaSemanal) {
      estadoText.textContent = "✅ ¡Meta alcanzada!";
    } else {
      estadoText.textContent = `Progreso: $${progresoActual.toFixed(2)} / $${metaSemanal}`;
    }

    retosCompletados.textContent = Math.round((progresoActual / metaSemanal) * totalCircuits);

    inputCantidad.value = "";
  });
});

// Función global para regresar al inicio
function goHome() {
  window.location.href = "Inicio.html";
}

document.addEventListener('DOMContentLoaded', () => {
    
    const scoreDisplay = document.getElementById('score-racha-display');
    const historialContainer = document.getElementById('retos-container');

    async function cargarDatosRetos() {
        if (!scoreDisplay || !historialContainer) {
            console.log("No se están en la página de retos, no se cargan datos.");
            return;
        }
        historialContainer.innerHTML = '<p>Cargando historial de retos...</p>';
        scoreDisplay.textContent = '...';

        try {

            const response = await fetch('obtener_retos.php');
            const data = await response.json();

            if (data.success === false) {
                throw new Error(data.message);
            }

            scoreDisplay.textContent = data.score;

            if (data.historial.length === 0) {
                historialContainer.innerHTML = '<p>Aún no tienes eventos en tu historial. ¡Completa un reto o realiza un pago!</p>';
                return;
            }

            let html = '<ul>';
            data.historial.forEach(item => {

                let iconClass = 'evento-neutral';
                if (item.evento_tipo.includes('Pago a Tiempo') || item.evento_tipo.includes('Meta Cumplida')) {
                    iconClass = 'evento-positivo'; // Verde
                } else if (item.evento_tipo.includes('Pago Atrasado')) {
                    iconClass = 'evento-negativo'; // Rojo
                }
                const fecha = new Date(item.fecha_evento).toLocaleDateString('es-MX', {
                    year: 'numeric', month: 'long', day: 'numeric'
                });

                html += `
                    <li class="evento-racha ${iconClass}">
                        <span class="fecha-evento">${fecha}</span>
                        <span class="desc-evento">${item.descripcion}</span>
                        <span class="tipo-evento">(${item.evento_tipo})</span>
                    </li>
                `;
            });
            html += '</ul>';
            historialContainer.innerHTML = html;

        } catch (error) {
            console.error('Error al cargar datos de retos:', error);
            scoreDisplay.textContent = 'Error';
            historialContainer.innerHTML = `<p class="error">${error.message}</p>`;
        }
    }
    cargarDatosRetos();
});
