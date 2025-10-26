<?php
session_start();

try {
    // --- 1. CONFIGURACIÓN ---
    $apiKey = "b4f091eb11a0b63ab8e323f36a74da9a"; 
    $apiBaseUrl = "http://api.nessieisreal.com";

    // --- TUS IDs DE POSTMAN ---
    $default_customer_id = "68fcf1b19683f20dd51a4600";
    $default_account_id_credit_card = "68fd00289683f20dd51a4648"; // Tarjeta de Crédito
    
    $default_account_id_savings = "68fd8e889683f20dd51a4a93"; 

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
            throw new Exception("Error de cURL: " . curl_error($ch));
        }
        curl_close($ch);
        return json_decode($response, true);
    }

    if (!isset($_SESSION['usuario_id'])) {
        throw new Exception("No autorizado. Inicie sesión.");
    }

    $usuario_id_local = $_SESSION['usuario_id'];
    $customer_id_banco = $_SESSION['customer_id_banco'];

    $conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);
    if ($conn->connect_error) {
        throw new Exception("Error de conexión a BD local: " . $conn->connect_error);
    }

    if ($customer_id_banco == null) {
        $customer_id_banco = $default_customer_id;
        $stmt = $conn->prepare("UPDATE Usuarios SET customer_id_banco = ? WHERE id = ?");
        $stmt->bind_param("si", $customer_id_banco, $usuario_id_local);
        $stmt->execute();
        $stmt->close();
        $_SESSION['customer_id_banco'] = $customer_id_banco;
    }

    $score_racha = 100; 
    $stmt_score = $conn->prepare("SELECT score_racha FROM Usuarios WHERE id = ?");
    $stmt_score->bind_param("i", $usuario_id_local);
    $stmt_score->execute();
    $result_score = $stmt_score->get_result();
    if ($user_data = $result_score->fetch_assoc()) {
        $score_racha = (int)$user_data['score_racha'];
    }
    $stmt_score->close();
    $conn->close(); 
    $saldo_ahorros = 0;
    $total_gastos = 0;
    $nombre_usuario = "Usuario";

    $url_cliente = "{$apiBaseUrl}/customers/{$customer_id_banco}";
    $data_cliente = callNessieAPI($url_cliente, $apiKey);
    if (isset($data_cliente['first_name'])) {
        $nombre_usuario = $data_cliente['first_name'] . " " . $data_cliente['last_name'];
    }

    if ($default_account_id_savings != "ID_DE_TU_CUENTA_DE_AHORROS") {
        $url_ahorros = "{$apiBaseUrl}/accounts/{$default_account_id_savings}";
        $data_ahorros = callNessieAPI($url_ahorros, $apiKey);
        if (isset($data_ahorros['balance'])) {
            $saldo_ahorros = $data_ahorros['balance'];
        }
    }

    $url_compras = "{$apiBaseUrl}/accounts/{$default_account_id_credit_card}/purchases";
    $compras = callNessieAPI($url_compras, $apiKey);
    if (is_array($compras)) {
        foreach ($compras as $compra) {
            $total_gastos += $compra['amount'];
        }
    }

    $response_data = [
        'success' => true,
        'nombre_usuario' => $nombre_usuario,
        'ingresos' => 30000.00,
        'ahorros' => $saldo_ahorros,
        'gastos' => $total_gastos,
        'score_racha' => $score_racha
    ];

} catch (Exception $e) {
    $response_data = [
        'success' => false,
        'error' => $e->getMessage()
    ];
}

// --- 10. ENVIAR RESPUESTA ---
header('Content-Type: application/json');
echo json_encode($response_data);
?>