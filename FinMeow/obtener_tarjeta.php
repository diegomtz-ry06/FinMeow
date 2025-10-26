<?php
session_start();

try {
    if (!isset($_SESSION['usuario_id']) || !isset($_SESSION['customer_id_banco'])) {
        throw new Exception("Error: No has iniciado sesión.");
    }

    $apiKey = "f091eb11a0b63ab8e323f36a74da9a"; // Nessie
    $apiBaseUrl = "http://api.nessieisreal.com";
    
    $id_tarjeta_credito = "68fd00289683f20dd51a4648"; 

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

    $url_detalles = "{$apiBaseUrl}/accounts/{$id_tarjeta_credito}";
    $detalles = callNessieAPI($url_detalles, $apiKey);
    
    $url_compras = "{$apiBaseUrl}/accounts/{$id_tarjeta_credito}/purchases";
    $compras = callNessieAPI($url_compras, $apiKey);

    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'detalles' => $detalles ?? null, 
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