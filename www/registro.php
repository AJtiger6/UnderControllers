<?php
header('Content-Type: application/json');
require_once 'db_config.php';

// Leer el JSON enviado desde el navegador
$inputJSON = file_get_contents('php://input');
$data = json_decode($inputJSON, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $data) {
    if (isset($data['name']) && isset($data['email']) && isset($data['password'])) {
        try {
            $name = $data['name'];
            $email = $data['email'];
            $password = $data['password'];

            // Comprobar si el usuario o el email ya existen
            $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ? OR name = ?");
            $stmt->execute([$email, $name]);
            if ($stmt->rowCount() > 0) {
                echo json_encode(["success" => false, "message" => "L'usuari o email ja existeix."]);
                exit;
            }

            // Insertar en la base de datos
            $stmt = $pdo->prepare("INSERT INTO usuarios (name, email, password) VALUES (?, ?, ?)");
            if ($stmt->execute([$name, $email, $password])) {
                echo json_encode(["success" => true, "message" => "Compte creat correctament."]);
            } else {
                echo json_encode(["success" => false, "message" => "Error al guardar a la base de dades."]);
            }
        } catch (PDOException $e) {
            // Si hay error en la DB (ej. la tabla no existe), lo mostramos
            echo json_encode(["success" => false, "message" => "Error SQL: " . $e->getMessage()]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Falten dades al formulari."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Petición incorrecta."]);
}
?>