<?php
header('Content-Type: application/json');
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if ($data['action'] === 'login') {
    $email = $data['email'];
    $password = $data['password'];
    
    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if ($user && password_verify($password, $user['senha'])) {
        unset($user['senha']);
        echo json_encode([
            'success' => true,
            'user' => $user,
            'redirect' => 'index.html'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Credenciais inválidas']);
    }
} 
elseif ($data['action'] === 'register') {
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
    
    try {
        $stmt = $pdo->prepare("INSERT INTO usuarios (nome, email, telefone, endereco, senha) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['nome'],
            $data['email'],
            $data['telefone'],
            $data['endereco'],
            $hashedPassword
        ]);
        
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erro no cadastro: ' . $e->getMessage()]);
    }
}
?>