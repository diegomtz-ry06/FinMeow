// script.js
function showCredit() {
  alert("Mostrando historial crediticio...");
}

function modifyPet() {
  alert("Abriendo editor de mascota...");
}

function openSettings() {
  alert("Abriendo configuración...");
}

function goHome() {
  window.location.href = "Inicio.html";
}

document.addEventListener('DOMContentLoaded', () => {
    
    const nombreApiElement = document.getElementById('perfil-nombre-api');
    const emailElement = document.getElementById('perfil-email');
    const scoreElement = document.getElementById('perfil-score');
    const logoutButton = document.getElementById('logout-button'); 

    async function cargarDatosPerfil() {

        if (nombreApiElement) nombreApiElement.textContent = 'Cargando...';
        if (emailElement) emailElement.textContent = 'Cargando...';
        if (scoreElement) scoreElement.textContent = '...';

        try {

            const response = await fetch('obtener_perfil.php');
            const data = await response.json();
            if (data.success === false) {
                throw new Error(data.message);
            }
            if (nombreApiElement) nombreApiElement.textContent = data.nombre_completo_api;
            if (emailElement) emailElement.textContent = data.email;
            if (scoreElement) scoreElement.textContent = data.score;

        } catch (error) {
            console.error('Error al cargar datos del perfil:', error);
            if (nombreApiElement) nombreApiElement.textContent = 'Error al cargar';
            if (emailElement) emailElement.textContent = 'Error';

            if (error.message.includes("No has iniciado sesión")) {
                window.location.href = 'InicioSesion.html';
            }
        }
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            window.location.href = 'logout.php';
        });
    }
    cargarDatosPerfil();
});