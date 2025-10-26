function mostrarResumen() {
  const objetivo = document.getElementById('objetivo').value || 'Sin objetivo';
  const monto = parseFloat(document.getElementById('monto').value) || 0;
  const meses = parseInt(document.getElementById('meses').value) || 1;
  const tarjeta = document.getElementById('tarjeta').value || 'Sin tarjeta';
  const ahorroMensual = (monto / meses).toFixed(2);

  // Mostrar resultado
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = `
    ✅ <strong>${objetivo}</strong><br>
    Monto total: <strong>$${monto}</strong><br>
    Duración: <strong>${meses}</strong> meses<br>
    Ahorro mensual: <strong>$${ahorroMensual}</strong><br>
    Tarjeta(s): <strong>${tarjeta}</strong>
  `;

  // Animación de progreso
  const circulos = document.querySelectorAll('.circulo');
  circulos.forEach((c, i) => {
    setTimeout(() => c.classList.add('activo'), i * 300);
  });
}

function goHome() {
  window.location.href = "Inicio.html";
}

document.addEventListener('DOMContentLoaded', () => {

    const goalForm = document.getElementById('goalForm');

    goalForm.addEventListener('submit', async (event) => {
        
        event.preventDefault();

        const nombre = document.getElementById('goalName').value;
        const monto = document.getElementById('goalAmount').value;
        const fecha = document.getElementById('goalDate').value;
        const tipo = document.querySelector('input[name="goalType"]:checked').value;

        try {
            const response = await fetch('guardar_objetivo.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: nombre,
                    monto: monto,
                    fecha: fecha,
                    tipo: tipo
                })
            });

            const result = await response.json();
            alert(result.message);

            if (result.success) {
                goalForm.reset();

            }

        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            alert('Error de conexión. Inténtalo de nuevo.');
        }
    });
});