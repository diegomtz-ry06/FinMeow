<?php
// --- 1. RECIBIR DATOS ---
$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'];
$password = $data['password'];
$password_hash = password_hash($password, PASSWORD_DEFAULT);

$serverName = "localhost";
$username = "root";   
$password_db = "";     
$dbName = "app_crediticia"; 

$conn = new mysqli($serverName, $username, $password_db, $dbName);

$response = [];

if ($conn->connect_error) {
    $response = ['success' => false, 'message' => 'Error de conexión a la BD.'];
} else {

    $stmt = $conn->prepare("INSERT INTO Usuarios (email, password_hash) VALUES (?, ?)");
    $stmt->bind_param("ss", $email, $password_hash); 

    if ($stmt->execute()) {
        $response = ['success' => true, 'message' => '¡Usuario registrado!'];
    } else {
        $response = ['success' => false, 'message' => 'Error al registrar.'];
    }
    $stmt->close();
    $conn->close();
}

header('Content-Type: application/json');
echo json_encode($response);
?>