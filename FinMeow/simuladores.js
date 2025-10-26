function calcularPenalizacion() {
  const monto = parseFloat(document.getElementById("monto").value);
  const dias = parseInt(document.getElementById("dias").value);

  if (isNaN(monto) || monto <= 0) {
    mostrarResultado("resultadoPenalizacion", "Ingresa un monto válido");
    return;
  }

  if (isNaN(dias) || dias < 0) {
    mostrarResultado("resultadoPenalizacion", "Ingresa un número válido de días");
    return;
  }

  const penalizacion = monto * 0.01 * dias;
  const total = monto + penalizacion;

  const mensaje =
    dias > 0
      ? `Pagando tarde pagarías: <b>$${total.toFixed(2)}</b> (penalización: <b>$${penalizacion.toFixed(2)}</b>)`
      : `Pagando a tiempo pagarías: <b>$${monto.toFixed(2)}</b> sin penalización`;

  mostrarResultado("resultadoPenalizacion", mensaje);
}

function calcularCapacidad() {
  const ingreso = parseFloat(document.getElementById("ingreso").value);
  const deuda = parseFloat(document.getElementById("deuda").value);

  if (isNaN(ingreso) || ingreso <= 0) {
    mostrarResultado("resultadoCapacidad", "Ingresa un ingreso válido");
    return;
  }

  if (isNaN(deuda) || deuda < 0) {
    mostrarResultado("resultadoCapacidad", "Ingresa una deuda válida");
    return;
  }

  const porcentaje = (deuda / ingreso) * 100;

  let resultado = "";
  if (porcentaje < 30) {
    resultado = "Capacidad de endeudamiento: Baja → ¡Buen trabajo!";
  } else if (porcentaje < 50) {
    resultado = "Capacidad de endeudamiento: Media → Estable";
  } else {
    resultado = "Capacidad de endeudamiento: Alta → ¡Cuidado con el endeudamiento!";
  }

  mostrarResultado("resultadoCapacidad", resultado);
}

function mostrarResultado(id, mensaje) {
  const div = document.getElementById(id);
  div.innerHTML = mensaje;
  div.style.opacity = 0;
  div.style.transform = "translateY(-10px)";
  setTimeout(() => {
    div.style.transition = "all 0.4s ease";
    div.style.opacity = 1;
    div.style.transform = "translateY(0)";
  }, 50);
}

function goHome() {
  window.location.href = "Inicio.html";
}

document.addEventListener('DOMContentLoaded', () => {

    const simulationForm = document.getElementById('simulationForm');
    const simulationResult = document.getElementById('simulationResult');


    simulationForm.addEventListener('submit', (event) => {
        
        event.preventDefault();
        const monto = parseFloat(document.getElementById('loanAmount').value);
        const tasaAnual = parseFloat(document.getElementById('interestRate').value);
        const plazoMeses = parseInt(document.getElementById('loanTerm').value);


        const tasaMensual = (tasaAnual / 100) / 12;

        // Fórmula de pago mensual (Amortización)
        // M = P [ i(1+i)^n ] / [ (1+i)^n – 1]
        const i = tasaMensual;
        const n = plazoMeses;
        const P = monto;
        
        const pagoMensual = P * ( (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1) );
        const pagoTotal = pagoMensual * plazoMeses;
        const interesTotal = pagoTotal - monto;

        // Simulación de "Pagar Tarde" (ej. 10% de penalización sobre el pago)
        const penalizacion = pagoMensual * 0.10; // 10% de multa
        const pagoMensualTarde = pagoMensual + penalizacion;
        const pagoTotalTarde = pagoMensualTarde * plazoMeses;

        // Limpiamos resultados anteriores
        simulationResult.innerHTML = ''; 

        // Creamos el HTML para los resultados
        const resultadoHTML = `
            <h4>Resultados de tu Simulación:</h4>
            
            <div class="result-item">
                <strong>Pago Mensual (Pagando a tiempo):</strong>
                <p>$ ${pagoMensual.toFixed(2)} MXN</p>
            </div>
            
            <div class="result-item">
                <strong>Pago Total (Pagando a tiempo):</strong>
                <p>$ ${pagoTotal.toFixed(2)} MXN</p>
            </div>
            
            <div class="result-item">
                <strong>Intereses Totales (Pagando a tiempo):</strong>
                <p>$ ${interesTotal.toFixed(2)} MXN</p>
            </div>
            
            <hr>
            
            <h5>Simulación "Pagando Tarde":</h5>
            <p>Si pagas tarde cada mes (con 10% de penalización):</p>
            
            <div class="result-item result-late">
                <strong>Pago Mensual (Pagando tarde):</strong>
                <p>$ ${pagoMensualTarde.toFixed(2)} MXN</p>
            </div>
            
            <div class="result-item result-late">
                <strong>Pago Total (Pagando tarde):</strong>
                <p>$ ${pagoTotalTarde.toFixed(2)} MXN</p>
            </div>
        `;
        
        // Insertamos el HTML en el div
        simulationResult.innerHTML = resultadoHTML;
    });
});