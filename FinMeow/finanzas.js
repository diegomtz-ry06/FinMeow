function toggleFrequency() {
  const frequencyOptions = document.getElementById("frequency-options");
  frequencyOptions.classList.toggle("show");
  const reminderCheckbox = document.getElementById("reminder");

  if (reminderCheckbox.checked) {
    frequencyOptions.classList.remove("hidden");
    frequencyOptions.style.maxHeight = "500px";
    frequencyOptions.style.opacity = "1";
  } else {
    frequencyOptions.style.maxHeight = "0";
    frequencyOptions.style.opacity = "0";
    setTimeout(() => frequencyOptions.classList.add("hidden"), 300);
  }
}


function goHome() {
  window.location.href = "Inicio.html";
}


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("finance-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      tarjeta: document.getElementById("card").value.trim(),
      fecha: document.getElementById("due-date").value,
      creditos: document.getElementById("credits").value,
      pendiente: document.getElementById("pending").value,
      recordatorio: document.getElementById("reminder").checked,
    };

    if (!data.tarjeta || !data.fecha || !data.creditos || !data.pendiente) {
      alert("⚠️ Por favor completa todos los campos obligatorios.");
      return;
    }

    // Guardar en localStorage
    let registros = JSON.parse(localStorage.getItem("registrosFinancieros")) || [];
    registros.push(data);
    localStorage.setItem("registrosFinancieros", JSON.stringify(registros));

    alert("✅ Registro financiero guardado correctamente");
    form.reset();

    // Ocultar recordatorios al reiniciar
    const frequencyOptions = document.getElementById("frequency-options");
    frequencyOptions.classList.remove("show");
  });
  const cuentasContainer = document.getElementById('cuentas-container');
    const transaccionesContainer = document.getElementById('transacciones-container');

    async function cargarDatosFinanzas() {
        cuentasContainer.innerHTML = '<p>Cargando cuentas...</p>';
        transaccionesContainer.innerHTML = '<p>Cargando transacciones...</p>';

        try {
            const response = await fetch('obtener_finanzas.php');
            const data = await response.json();
            if (data.success === false) {
                throw new Error(data.message);
            }

            renderCuentas(data.cuentas);
            renderTransacciones(data.compras);

        } catch (error) {
            console.error('Error al cargar datos de finanzas:', error);
            cuentasContainer.innerHTML = `<p class="error">${error.message}</p>`;
            transaccionesContainer.innerHTML = `<p class="error">No se pudieron cargar las transacciones.</p>`;
        }
    }

    function renderCuentas(cuentas) {
        if (!cuentas || cuentas.length === 0) {
            cuentasContainer.innerHTML = '<p>No se encontraron cuentas.</p>';
            return;
        }

        let html = '<ul>';
        cuentas.forEach(cuenta => {
            html += `
                <li>
                    <span class="tipo-cuenta">${cuenta.nickname} (${cuenta.type})</span>
                    <span class="saldo-cuenta">$ ${cuenta.balance.toFixed(2)}</span>
                </li>
            `;
        });
        html += '</ul>';
        cuentasContainer.innerHTML = html;
    }
    function renderTransacciones(compras) {
        if (!compras || compras.length === 0) {
            transaccionesContainer.innerHTML = '<p>No se encontraron transacciones.</p>';
            return;
        }

        let html = '<ul>';
        compras.reverse().forEach(compra => {
            html += `
                <li>
                    <span class="fecha-transaccion">${compra.purchase_date}</span>
                    <span class="desc-transaccion">${compra.description || 'Compra'}</span>
                    <span class="monto-transaccion">-$ ${compra.amount.toFixed(2)}</span>
                </li>
            `;
        });
        html += '</ul>';
        transaccionesContainer.innerHTML = html;
    }
    cargarDatosFinanzas();
});
