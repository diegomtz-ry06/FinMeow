<?php
session_start();

try {
    if (!isset($_SESSION['usuario_id'])) {
        throw new Exception("Error: No has iniciado sesión.");
    }
    $usuario_id_local = $_SESSION['usuario_id'];

    $dbHost = "localhost";
    $dbUser = "root";
    $dbPass = "";
    $dbName = "app_crediticia";

    $conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);
    if ($conn->connect_error) {
        throw new Exception("Error de conexión a BD local.");
    }
    $score_racha = 0;
    $stmt_score = $conn->prepare("SELECT score_racha FROM Usuarios WHERE id = ?");
    $stmt_score->bind_param("i", $usuario_id_local);
    $stmt_score->execute();
    $result_score = $stmt_score->get_result();
    if ($user = $result_score->fetch_assoc()) {
        $score_racha = (int)$user['score_racha'];
    }
    $stmt_score->close();

    $historial = [];
    $stmt_historial = $conn->prepare("SELECT evento_tipo, descripcion, fecha_evento FROM Historial_Racha WHERE usuario_id = ? ORDER BY fecha_evento DESC");
    $stmt_historial->bind_param("i", $usuario_id_local);
    $stmt_historial->execute();
    $result_historial = $stmt_historial->get_result();
    while ($fila = $result_historial->fetch_assoc()) {
        $historial[] = $fila;
    }
    $stmt_historial->close();
    $conn->close();

    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'score' => $score_racha,
        'historial' => $historial
    ]);

} catch (Exception $e) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>