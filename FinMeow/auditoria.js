// Variables de referencia
const progressBar = document.getElementById("progress-bar");
const agregarBtn = document.getElementById("agregarBtn");
const inputCantidad = document.getElementById("inputCantidad");
const estadoText = document.getElementById("estadoText");
const circuitsContainer = document.getElementById("circuits-container");

// Configuración de ejemplo: meta semanal $100 y 5 círculos
const metaSemanal = 100;
const totalCircuits = 5;

// Crear círculos al cargar la página
for (let i = 0; i < totalCircuits; i++) {
  const div = document.createElement("div");
  div.classList.add("circuit");
  circuitsContainer.appendChild(div);
}

// Estado actual del progreso
let progresoActual = 0;

agregarBtn.addEventListener("click", () => {
  let cantidad = parseFloat(inputCantidad.value);
  if (isNaN(cantidad) || cantidad <= 0) {
    estadoText.textContent = "⚠️ Ingresa una cantidad válida";
    return;
  }

  progresoActual += cantidad;
  if (progresoActual > metaSemanal) progresoActual = metaSemanal;

  // Actualizar barra de progreso
  let porcentaje = (progresoActual / metaSemanal) * 100;
  progressBar.style.width = porcentaje + "%";

  // Actualizar los círculos según el progreso
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

  inputCantidad.value = "";
});

document.addEventListener('DOMContentLoaded', () => {

    const auditForm = document.getElementById('auditForm');
    const auditResult = document.getElementById('auditResult');
    auditForm.addEventListener('submit', async (event) => {
        
        event.preventDefault();
        auditResult.innerHTML = '<p>Generando auditoría, por favor espera...</p>';

        // formato "YYYY-MM"
        const mes = document.getElementById('monthSelect').value;
        try {
            const response = await fetch('auditoria.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mes: mes })
            });

            const result = await response.json();

            if (result.success) {
                renderResultados(result);
            } else {
                auditResult.innerHTML = `<p class="error">${result.message}</p>`;
            }

        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            auditResult.innerHTML = '<p class="error">Error de conexión. ¿Está XAMPP funcionando?</p>';
        }
    });

    function renderResultados(data) {
        let html = `<h4>Resumen de Gastos para ${data.mes}</h4>`;
        
        if (data.conteo === 0) {
            html += '<p>No se encontraron gastos para este mes.</p>';
        } else {
            html += `<p class="total-gastado">Total Gastado: <strong>$ ${data.total.toFixed(2)} MXN</strong> en ${data.conteo} compras.</p>`;
            html += '<ul class="lista-compras">';
            data.compras.forEach(compra => {
                html += `
                    <li>
                        <span class="fecha">${compra.purchase_date}</span>
                        <span class="descripcion">${compra.description || 'Sin descripción'}</span>
                        <span class="monto">$ ${compra.amount.toFixed(2)}</span>
                    </li>
                `;
            });
            
            html += '</ul>';
        }
        auditResult.innerHTML = html;
    }
});


function goHome() {
  window.location.href = "Inicio.html";
}
