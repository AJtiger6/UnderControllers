<?php
header('Content-Type: application/json');
require_once 'db_config.php';

$inputJSON = file_get_contents('php://input');
$data = json_decode($inputJSON, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $data) {
    if (isset($data['user']) && isset($data['password'])) {
        try {
            $user = $data['user'];
            $password = $data['password'];

            // Buscar si coinciden
            $stmt = $pdo->prepare("SELECT name, email FROM usuarios WHERE (name = ? OR email = ?) AND password = ?");
            $stmt->execute([$user, $user, $password]);
            $userData = $stmt->fetch();

            if ($userData) {
                echo json_encode(["success" => true, "user" => $userData]);
            } else {
                echo json_encode(["success" => false, "message" => "Usuari o contrasenya incorrectes."]);
            }
        } catch (PDOException $e) {
            // Si hay error en la DB, lo capturamos
            echo json_encode(["success" => false, "message" => "Error SQL: " . $e->getMessage()]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Falten dades al formulari."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Petición incorrecta."]);
}
?>