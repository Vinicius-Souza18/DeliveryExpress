<?php
header('Content-Type: application/json');
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

try {
    $stmt = $pdo->prepare("INSERT INTO pedidos (usuario_id, items, total, status) VALUES (?, ?, ?, ?)");
    $stmt->execute([
        $data['user_id'],
        json_encode($data['items']),
        $data['total'],
        $data['status']
    ]);
    
    echo json_encode([
        'success' => true,
        'pedidoId' => $pdo->lastInsertId()
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro ao salvar pedido: ' . $e->getMessage()]);
}
?>