<?php
session_start();

try {
    if (!isset($_SESSION['usuario_id']) || !isset($_SESSION['customer_id_banco'])) {
        throw new Exception("Error: No has iniciado sesión.");
    }

    $apiKey = "f091eb11a0b63ab8e323f36a74da9a"; // Nessie
    $apiBaseUrl = "http://api.nessieisreal.com";
    $customer_id_banco = $_SESSION['customer_id_banco'];
    $id_tarjeta_credito = "68fd00289683f20dd51a4648"; // ID de tarjeta
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

    $url_cuentas = "{$apiBaseUrl}/customers/{$customer_id_banco}/accounts";
    $cuentas = callNessieAPI($url_cuentas, $apiKey);
    $url_compras = "{$apiBaseUrl}/accounts/{$id_tarjeta_credito}/purchases";
    $compras = callNessieAPI($url_compras, $apiKey);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'cuentas' => $cuentas ?? [],
        'compras' => $compras ?? []
    ]);

} catch (Exception $e) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>