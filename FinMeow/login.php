<?php
session_start();

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'];
$password = $data['password'];

// MYSQL
$serverName = "localhost";
$username = "root";
$password_db = "";
$dbName = "app_crediticia";

$conn = new mysqli($serverName, $username, $password_db, $dbName);

$response = [];

if ($conn->connect_error) {
    $response = ['success' => false, 'message' => 'Error de conexión a la BD.'];
} else {
   
    $stmt = $conn->prepare("SELECT id, password_hash, customer_id_banco FROM Usuarios WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user['password_hash'])) {
            $_SESSION['usuario_id'] = $user['id'];
            $_SESSION['customer_id_banco'] = $user['customer_id_banco'];
            
            $response = [
                'success' => true,
                'isConfigured' => ($user['customer_id_banco'] != null)
            ];
        } else {
            $response = ['success' => false, 'message' => 'Email o contraseña incorrectos.'];
        }
    } else {
        $response = ['success' => false, 'message' => 'Email o contraseña incorrectos.'];
    }
    $stmt->close();
    $conn->close();
}

header('Content-Type: application/json');
echo json_encode($response);
?>