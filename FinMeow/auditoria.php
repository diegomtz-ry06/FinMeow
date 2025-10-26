<?php
session_start();

if (!isset($_SESSION['usuario_id']) || !isset($_SESSION['customer_id_banco'])) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Error: No has iniciado sesión.']);
    exit;
}

$apiKey = "f091eb11a0b63ab8e323f36a74da9a"; // Nessie
$apiBaseUrl = "http://api.nessieisreal.com";

$id_tarjeta_credito = "68fd00289683f20dd51a4648"; // ID de tarjeta

$data = json_decode(file_get_contents('php://input'), true);
$mesSeleccionado = $data['mes']; // Formato: "YYYY-MM"

function callNessieAPI($url, $apiKey) {
    $fullUrl = $url . "?key=" . $apiKey;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $fullUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    $response = curl_exec($ch);
    if (curl_errno($ch)) {
        curl_close($ch);
        return null;
    }
    curl_close($ch);
    return json_decode($response, true);
}

$url_compras = "{$apiBaseUrl}/accounts/{$id_tarjeta_credito}/purchases";
$todasLasCompras = callNessieAPI($url_compras, $apiKey);

$comprasFiltradas = [];
$totalGastado = 0;

if (is_array($todasLasCompras)) {
    foreach ($todasLasCompras as $compra) {
        $mesCompra = date('Y-m', strtotime($compra['purchase_date']));
        
        // Si el mes de la compra coincide con el mes que seleccionó el usuario
        if ($mesCompra == $mesSeleccionado) {
            $comprasFiltradas[] = $compra; // La añadimos a la lista
            $totalGastado += $compra['amount']; // Sumamos al total
        }
    }
} else {
    // Error si la API no devolvió un array
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Error al obtener datos de la API.']);
    exit;
}

header('Content-Type: application/json');
echo json_encode([
    'success' => true,
    'mes' => $mesSeleccionado,
    'total' => $totalGastado,
    'compras' => $comprasFiltradas,
    'conteo' => count($comprasFiltradas)
]);
?>