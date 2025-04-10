document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const cartButton = document.getElementById('cart-button');
    const mobileCartButton = document.getElementById('mobile-cart-button');
    const cartModal = document.querySelector('.cart-modal');
    const closeModal = document.querySelector('.close-modal');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCountElements = document.querySelectorAll('.cart-count');
    const cartTotal = document.querySelector('.total-price');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const userGreeting = document.getElementById('user-greeting');
    const mobileLoginLink = document.getElementById('mobile-login-link');
    const mobileLogoutLink = document.getElementById('mobile-logout-link');
    const mobileUserGreeting = document.getElementById('mobile-user-greeting');
  
    // Carrinho
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Menu Mobile
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
      this.innerHTML = mobileMenu.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
  
    // Fechar menu ao clicar em um link
    document.querySelectorAll('#mobile-menu a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  
    // Abrir/Fechar Carrinho
    function toggleCart() {
      cartModal.style.display = cartModal.style.display === 'flex' ? 'none' : 'flex';
      renderCartItems();
    }
  
    cartButton.addEventListener('click', function(e) {
      e.preventDefault();
      toggleCart();
    });
  
    mobileCartButton.addEventListener('click', function(e) {
      e.preventDefault();
      toggleCart();
    });
  
    closeModal.addEventListener('click', function() {
      cartModal.style.display = 'none';
    });
  
    cartModal.addEventListener('click', function(e) {
      if (e.target === cartModal) {
        cartModal.style.display = 'none';
      }
    });
  
    // Adicionar ao Carrinho
    addToCartButtons.forEach(button => {
      button.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const product = {
          id: this.dataset.id,
          name: this.dataset.name,
          price: parseFloat(this.dataset.price),
          image: productCard.querySelector('img').src,
          quantity: 1
        };
  
        addToCart(product);
      });
    });
  
    function addToCart(product) {
      const existingItem = cart.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push(product);
      }
  
      updateCart();
      showNotification(`${product.name} adicionado ao carrinho!`);
    }
  
    function updateCart() {
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      renderCartItems();
    }
  
    function updateCartCount() {
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      cartCountElements.forEach(el => {
        el.textContent = count;
      });
    }
  
    function renderCartItems() {
      cartItemsContainer.innerHTML = '';
      
      if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="cart-empty"><p>Seu carrinho está vazio</p></div>';
        checkoutBtn.disabled = true;
        cartTotal.textContent = 'R$ 0,00';
        return;
      }
  
      let total = 0;
  
      cart.forEach(item => {
        total += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
            <div class="cart-item-actions">
              <button class="quantity-btn minus" data-id="${item.id}">-</button>
              <span class="quantity">${item.quantity}</span>
              <button class="quantity-btn plus" data-id="${item.id}">+</button>
              <button class="remove-item" data-id="${item.id}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `;
  
        cartItemsContainer.appendChild(cartItem);
      });
  
      cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')`;
      checkoutBtn.disabled = false;
  
       Eventos para os botões de quantidade
      document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const id = this.dataset.id;
          const item = cart.find(item => item.id === id);
          
          if (this.classList.contains('minus')) {
            if (item.quantity > 1) {
              item.quantity--;
            } else {
              cart = cart.filter(item => item.id !== id);
            }
          } else if (this.classList.contains('plus')) {
            item.quantity++;
          }
  
          updateCart();
        });
      });
  
      // Eventos para remover itens
      document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
          const id = this.dataset.id;
          cart = cart.filter(item => item.id !== id);
          updateCart();
        });
      });
    }
  
    // Finalizar Pedido
    checkoutBtn.addEventListener('click', function() {
      if (cart.length === 0) return;
      
      // Simulação de pedido
      alert('Pedido realizado com sucesso! Obrigado por comprar conosco.');
      cart = [];
      updateCart();
      cartModal.style.display = 'none';
    });
  
    // Sistema de Autenticação (simulado)
    function checkAuth() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        updateAuthUI(user);
      }
    }
  
    function updateAuthUI(user) {
      userGreeting.style.display = 'inline';
      userGreeting.textContent = `Olá, ${user.name.split(' ')[0]}`;
      logoutLink.style.display = 'inline';
      loginLink.style.display = 'none';
      
      mobileUserGreeting.style.display = 'inline';
      mobileUserGreeting.textContent = `Olá, ${user.name.split(' ')[0]}`;
      mobileLogoutLink.style.display = 'inline';
      mobileLoginLink.style.display = 'none';
    }
  
    logoutLink.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('user');
      userGreeting.style.display = 'none';
      logoutLink.style.display = 'none';
      loginLink.style.display = 'inline';
      
      mobileUserGreeting.style.display = 'none';
      mobileLogoutLink.style.display = 'none';
      mobileLoginLink.style.display = 'inline';
      
      showNotification('Logout realizado com sucesso!');
    });
  
    mobileLogoutLink.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('user');
      userGreeting.style.display = 'none';
      logoutLink.style.display = 'none';
      loginLink.style.display = 'inline';
      
      mobileUserGreeting.style.display = 'none';
      mobileLogoutLink.style.display = 'none';
      mobileLoginLink.style.display = 'inline';
      
      showNotification('Logout realizado com sucesso!');
    });
  
    // Verificar autenticação ao carregar
    checkAuth();
  
    // Animações ao rolar
    function setupScrollAnimations() {
      const animateElements = document.querySelectorAll('.animate-on-scroll');
      
      function checkAnimation() {
        animateElements.forEach(element => {
          const elementTop = element.getBoundingClientRect().top;
          const windowHeight = window.innerHeight;
          
          if (elementTop < windowHeight - 100) {
            element.classList.add('visible');
          }
        });
      }
      
      window.addEventListener('scroll', checkAnimation);
      window.addEventListener('load', checkAnimation);
    }
  
    // Notificação
    function showNotification(message) {
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.textContent = message;
      document.body.appendChild(notification);
  
      setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  
    // Inicialização
    updateCartCount();
    setupScrollAnimations();
  });
