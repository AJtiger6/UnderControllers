<?php
// Configuración para el entorno de producción (Dinaserver)
$host = "localhost"; // Generalmente es localhost, pero revisa si Dinaserver te dio una IP o host específico
$db_name = "under_diagnostic"; // El nombre que veo en tu captura
$username = "under_diagnostic";  // El usuario que creaste en el panel de Dinaserver
$password = "under_diagnostiC1";    // La contraseña de ese usuario

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8mb4", $username, $password);
    // IMPORTANTE: En producción, es mejor que los errores no den detalles sensibles
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    // Si falla, registramos el error pero no lo mostramos completo al usuario por seguridad
    error_log($e->getMessage());
    die("Error de conexión al servidor de datos.");
}
?>