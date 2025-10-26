<?php
session_start();
if (!isset($_SESSION['usuario_id'])) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Error: No has iniciado sesión.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$usuario_id = $_SESSION['usuario_id'];
$nombreMeta = $data['nombre'];
$montoMeta = $data['monto'];
$fechaMeta = $data['fecha'];
$tipoMeta = $data['tipo']; // Ahorro o Deuda

$dbHost = "localhost";
$dbUser = "root";
$dbPass = "";
$dbName = "app_crediticia";

$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

$response = [];

if ($conn->connect_error) {
    $response = ['success' => false, 'message' => 'Error de conexión a la BD.'];
} else {
    $sql = "INSERT INTO Metas_Financieras (usuario_id, nombre_meta, tipo_meta, monto_objetivo, fecha_limite, estado) 
            VALUES (?, ?, ?, ?, ?, 'Activo')";
            
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("issds", $usuario_id, $nombreMeta, $tipoMeta, $montoMeta, $fechaMeta);

    if ($stmt->execute()) {
        $response = ['success' => true, 'message' => '¡Meta guardada correctamente!'];
    } else {
        $response = ['success' => false, 'message' => 'Error al guardar la meta: ' . $stmt->error];
    }
    
    $stmt->close();
    $conn->close();
}

header('Content-Type: application/json');
echo json_encode($response);
?>