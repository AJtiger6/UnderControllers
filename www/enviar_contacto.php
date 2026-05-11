<?php
header('Content-Type: application/json');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require 'Exception.php';
require 'PHPMailer.php';
require 'SMTP.php';

$inputJSON = file_get_contents('php://input');
$data = json_decode($inputJSON, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $data) {
    $mail = new PHPMailer(true);

    try {
        // --- CONFIGURACIÓ DINANET BLINDADA ---
        $mail->isSMTP();
        $mail->Host       = 'mail.undercontrollers.cat'; 
        $mail->SMTPAuth   = true;
        $mail->Username   = 'admin@undercontrollers.cat';
        $mail->Password   = 'Alvijaru@1221';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // TLS
        $mail->Port       = 587;                            // Port 587
        $mail->CharSet    = 'UTF-8';

        // EL TRUC MÀGIC: Ignorar errors de certificat SSL
        $mail->SMTPOptions = array(
            'ssl' => array(
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            )
        );

        // --- ENVIAMENT ---
        $mail->setFrom('admin@undercontrollers.cat', 'Web Under Controllers');
        $mail->addAddress('admin@undercontrollers.cat'); 
        $mail->addReplyTo($data['email'], $data['name']);

        $mail->isHTML(true);
        $mail->Subject = 'NOU MISSATGE: ' . $data['subject'];
        $mail->Body    = "<strong>Nom:</strong> {$data['name']}<br><strong>Email:</strong> {$data['email']}<br><br><strong>Missatge:</strong><br>{$data['message']}";

        $mail->send();
        echo json_encode(["success" => true, "message" => "Enviat correctament!"]);

    } catch (Exception $e) {
        // Devolvem l'error per saber què passa
        echo json_encode(["success" => false, "message" => "Error SMTP: " . $mail->ErrorInfo]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Dades no rebudes."]);
}