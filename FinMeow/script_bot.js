async function getInput() {
    const input = document.getElementById("dialogo_persona");
    const botResponse = document.getElementById("dialogo_bot");
    let name = document.getElementById("name").value.trim();
    
    if (!name) return;
    
    // Mostrar pregunta del usuario
    input.textContent = name;     

    // 1. Guardar pregunta
    try {
        const response = await fetch('/save-pregunta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: name })
        });

        if (!response.ok) {
            console.error('Error guardando la pregunta');
            return;
        }

        // 2. Procesar con Gemini (llamada al servidor)
        const processResponse = await fetch('/process-question', {
            method: 'POST'
        });

        if (!processResponse.ok) {
            console.error('Error procesando la pregunta');
            return;
        }

        // 3. Esperar un momento para que Gemini genere la respuesta
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 4. Obtener y mostrar la respuesta
        const solutionResponse = await fetch('/solucion.txt');
        if (solutionResponse.ok) {
            const solution = await solutionResponse.text();
            botResponse.textContent = solution;
        } else {
            console.error('Error obteniendo la solución');
            botResponse.textContent = "Lo siento, hubo un error generando la respuesta.";
        }

    } catch (err) {
        console.error('Error en el proceso:', err);
        botResponse.textContent = "Ocurrió un error procesando tu pregunta.";
    }

    // Limpiar el input y mantener foco
    document.getElementById("name").value = '';
    document.getElementById("name").focus();
}

/////Diseño
// 💬 Mejora visual del chat — los mensajes se acumulan con burbujas y animación
document.addEventListener("DOMContentLoaded", () => {
  const chat = document.getElementById("chat");
  const inputField = document.getElementById("name");
  const sendButton = document.querySelector("#userForm button");

  // Cuando se haga clic o se presione Enter
  sendButton.addEventListener("click", addMessage);
  inputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addMessage();
    }
  });

  function addMessage() {
    const text = inputField.value.trim();
    if (text === "") return;

    // Crear burbuja del usuario
    const userMsg = document.createElement("p");
    userMsg.classList.add("user-msg");
    userMsg.textContent = text;
    chat.appendChild(userMsg);

    // Simular una burbuja del bot de carga
    const botMsg = document.createElement("p");
    botMsg.classList.add("bot-msg");
    botMsg.textContent = "Escribiendo...";
    chat.appendChild(botMsg);

    // Bajar al final del chat
    chat.scrollTop = chat.scrollHeight;

    // Limpiar input
    inputField.value = "";
  }
});
