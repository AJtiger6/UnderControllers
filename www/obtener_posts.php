<?php
header('Content-Type: application/json');
require_once 'db_config.php';

try {
    // 1. Obtenemos todos los posts
    $stmt = $pdo->query("SELECT * FROM forum_posts ORDER BY fecha DESC");
    $posts = $stmt->fetchAll();

    $resultado = [];

    foreach ($posts as $post) {
        // 2. Para cada post, buscamos sus respuestas
        $stmtRep = $pdo->prepare("SELECT * FROM forum_respuestas WHERE id_post = ? ORDER BY fecha ASC");
        $stmtRep->execute([$post['id']]);
        $respuestas = $stmtRep->fetchAll();

        // Guardamos todo en un array
        $post['respuestas'] = $respuestas;
        $resultado[] = $post;
    }

    echo json_encode(["success" => true, "posts" => $resultado]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>