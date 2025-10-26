function actualizarAhorro() {
  const meta = parseFloat(document.getElementById("meta").value);
  const actual = parseFloat(document.getElementById("actual").value);
  const barra = document.getElementById("barraAhorro");

  if (meta > 0) {
    const porcentaje = (actual / meta) * 100;
    barra.value = Math.min(porcentaje, 100);
  } else {
    barra.value = 0;
  }
}

function calcularGastos() {
  const transporte = parseFloat(document.getElementById("transporte").value) || 0;
  const comida = parseFloat(document.getElementById("comida").value) || 0;
  const ninos = parseFloat(document.getElementById("ninos").value) || 0;
  const total = transporte + comida + ninos;

  document.getElementById("resultadoGastos").innerText =
    `Total de gastos: $${total.toFixed(2)}`;
}

function guardarTarjeta() {
  const nombre = document.getElementById("nombreTarjeta").value.trim();
  const resultado = document.getElementById("tarjetaGuardada");

  if (nombre) {
    resultado.textContent = `✅ Tarjeta guardada: ${nombre}`;
  } else {
    resultado.textContent = "⚠️ Escribe un nombre o número de tarjeta";
  }
}

function goHome() {
  window.location.href = "Inicio.html";
}

document.addEventListener('DOMContentLoaded', () => {
    
    const cardNickname = document.getElementById('card-nickname');
    const cardBalance = document.getElementById('card-balance');
    const cardType = document.getElementById('card-type');
    const cardRewards = document.getElementById('card-rewards');
    const transaccionesContainer = document.getElementById('card-transactions-list');

    async function cargarDatosTarjeta() {
        if (!cardNickname || !transaccionesContainer) {
            return; 
        }

        cardNickname.textContent = 'Cargando...';
        cardBalance.textContent = '...';
        cardType.textContent = '...';
        cardRewards.textContent = '...';
        transaccionesContainer.innerHTML = '<p>Cargando transacciones...</p>';

        try {
            // 3. Llamar a nuestro nuevo backend
            const response = await fetch('obtener_tarjeta.php');
            const data = await response.json();

            if (data.success === false) {
                throw new Error(data.message);
            }

            renderDetalles(data.detalles);
            renderTransacciones(data.compras);

        } catch (error) {
            console.error('Error al cargar datos de la tarjeta:', error);
            cardNickname.textContent = 'Error';
            transaccionesContainer.innerHTML = `<p class="error">${error.message}</p>`;
        }
    }

    function renderDetalles(detalles) {
        if (!detalles) {
            cardNickname.textContent = 'No encontrada';
            return;
        }
        cardNickname.textContent = detalles.nickname;
        cardBalance.textContent = `$ ${detalles.balance.toFixed(2)}`;
        cardType.textContent = detalles.type;
        cardRewards.textContent = detalles.rewards;
    }

    function renderTransacciones(compras) {
        if (!compras || compras.length === 0) {
            transaccionesContainer.innerHTML = '<p>No se encontraron transacciones recientes.</p>';
            return;
        }

        let html = '<ul>';

        compras.reverse().forEach(compra => {
            html += `
                <li>
                    <span class="fecha">${compra.purchase_date}</span>
                    <span class="descripcion">${compra.description || 'Compra'}</span>
                    <span class="monto">-$ ${compra.amount.toFixed(2)}</span>
                </li>
            `;
        });
        html += '</ul>';
        transaccionesContainer.innerHTML = html;
    }


    cargarDatosTarjeta();
});