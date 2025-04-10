document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let user = JSON.parse(localStorage.getItem('user')) || null;

    // Inicializações
    initMobileMenu();
    initCart();
    checkAuth();

    // Sistema de Autenticação
    function checkAuth() {
        if (window.location.pathname.includes('admin') && !user) {
            window.location.href = '../login.html';
        }
    }

    // Menu Mobile
    function initMobileMenu() {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            this.innerHTML = mobileMenu.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }

    // Carrinho de Compras
    function initCart() {
        updateCartCount();
        
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-to-cart')) {
                const product = {
                    id: e.target.dataset.id,
                    name: e.target.dataset.name,
                    price: parseFloat(e.target.dataset.price),
                    quantity: 1
                };
                addToCart(product);
            }
        });
    }

    function addToCart(product) {
        const existingItem = cartItems.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push(product);
        }
        
        updateCart();
        showNotification(`${product.name} adicionado ao carrinho!`);
    }

    function updateCart() {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartCount();
    }

    function updateCartCount() {
        const count = cartItems.reduce((total, item) => total + item.quantity, 0);
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) cartCount.textContent = count;
    }

    // Finalização de Pedido
    window.finalizarPedido = function() {
        if (cartItems.length === 0) return;
        
        const pedido = {
            user_id: user?.id || null,
            items: cartItems,
            total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            data: new Date().toISOString(),
            status: 'pendente'
        };

        fetch('api/pedidos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pedido)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.removeItem('cartItems');
                window.location.href = 'pedido-sucesso.html?id=' + data.pedidoId;
            }
        })
        .catch(error => console.error('Erro:', error));
    };

    // Sistema de Login/Cadastro
    window.loginUser = function(event) {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        fetch('api/auth.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'login', email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                user = data.user;
                localStorage.setItem('user', JSON.stringify(user));
                window.location.href = data.redirect || 'index.html';
            } else {
                showNotification(data.message || 'Erro no login', 'error');
            }
        });
    };

    window.registerUser = function(event) {
        event.preventDefault();
        const form = event.target;
        const userData = {
            action: 'register',
            nome: form.nome.value,
            email: form.email.value,
            telefone: form.telefone.value,
            endereco: form.endereco.value,
            password: form.password.value
        };

        fetch('api/auth.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Cadastro realizado com sucesso!', 'success');
                setTimeout(() => window.location.href = 'login.html', 2000);
            } else {
                showNotification(data.message || 'Erro no cadastro', 'error');
            }
        });
    };

    // Utilitários
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});