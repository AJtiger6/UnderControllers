<?php
header('Content-Type: application/json');
require_once 'db_config.php';

$inputJSON = file_get_contents('php://input');
$data = json_decode($inputJSON, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $data) {
    // Comprovem que totes les claus existeixen
    if (isset($data['autor'], $data['titulo'], $data['categoria'], $data['mensaje'])) {
        try {
            $stmt = $pdo->prepare("INSERT INTO forum_posts (autor, titulo, categoria, mensaje) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $data['autor'], 
                $data['titulo'], 
                $data['categoria'], 
                $data['mensaje']
            ]);
            
            echo json_encode(["success" => true, "message" => "Post guardat correctament."]);
        } catch (PDOException $e) {
            echo json_encode(["success" => false, "message" => "Error de Base de Dades: " . $e->getMessage()]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Falten camps: " . json_encode(array_keys($data))]);
    }
} else {
    echo json_encode(["success" => false, "message" => "No s'ha rebut cap dada JSON."]);
}
?>