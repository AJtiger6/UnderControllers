<?php
header('Content-Type: application/json');
require_once 'db_config.php';

$data = json_decode(file_get_contents('php://input'), true);

if ($data && isset($data['id_post'], $data['autor'], $data['mensaje'])) {
    try {
        $stmt = $pdo->prepare("INSERT INTO forum_respuestas (id_post, autor, mensaje) VALUES (?, ?, ?)");
        $stmt->execute([$data['id_post'], $data['autor'], $data['mensaje']]);
        echo json_encode(["success" => true]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Dades incompletes."]);
}
?>