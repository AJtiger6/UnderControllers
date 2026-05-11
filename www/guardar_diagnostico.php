<?php
header('Content-Type: application/json');
require_once 'db_config.php';

// Leer el JSON enviado desde el navegador
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $input) {
    
    try {
        // Preparar la sentencia SQL para evitar inyecciones SQL
        $sql = "INSERT INTO diagnosticos (plataforma, modelo_mando, numero_serie, resultado_test) 
                VALUES (:plat, :mod, :serie, :res)";
        
        $stmt = $pdo->prepare($sql);
        
        // Ejecutar con los datos recibidos
        $stmt->execute([
            ':plat'  => $input['plataforma'],
            ':mod'   => $input['modelo'],
            ':serie' => $input['serie'] ?? null, // El número de serie es opcional
            ':res'   => $input['resultado']
        ]);

        echo json_encode([
            "status" => "success",
            "id_registro" => $pdo->lastInsertId(),
            "message" => "Diagnóstico guardado correctamente."
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }

} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Datos inválidos o método no permitido"]);
}
?>