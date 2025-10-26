<?php
session_start();

try {
    if (!isset($_SESSION['usuario_id']) || !isset($_SESSION['customer_id_banco'])) {
        throw new Exception("Error: No has iniciado sesión.");
    }

    $apiKey = "f091eb11a0b63ab8e323f36a74da9a";
    $apiBaseUrl = "http://api.nessieisreal.com";
    $customer_id_banco = $_SESSION['customer_id_banco'];
    $usuario_id_local = $_SESSION['usuario_id'];

    $dbHost = "localhost";
    $dbUser = "root";
    $dbPass = "";
    $dbName = "app_crediticia";

    function callNessieAPI($url, $apiKey) {
        $fullUrl = $url . "?key=" . $apiKey;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $fullUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        $response = curl_exec($ch);
        if (curl_errno($ch)) {
            curl_close($ch);
            throw new Exception("Error al llamar a la API: " . curl_error($ch));
        }
        curl_close($ch);
        return json_decode($response, true);
    }

    $conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);
    if ($conn->connect_error) {
        throw new Exception("Error de conexión a BD local.");
    }
    
    $email_usuario = "";
    $score_racha = 0;
    
    $stmt = $conn->prepare("SELECT email, score_racha FROM Usuarios WHERE id = ?");
    $stmt->bind_param("i", $usuario_id_local);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($user = $result->fetch_assoc()) {
        $email_usuario = $user['email'];
        $score_racha = $user['score_racha'];
    }
    $stmt->close();
    $conn->close();


    $url_cliente = "{$apiBaseUrl}/customers/{$customer_id_banco}";
    $data_cliente = callNessieAPI($url_cliente, $apiKey);
    $nombre_api = $data_cliente['first_name'] . " " . $data_cliente['last_name'];


    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'email' => $email_usuario,
        'nombre_completo_api' => $nombre_api,
        'score' => $score_racha
    ]);

} catch (Exception $e) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>