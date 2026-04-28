// Cart Functions
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count in navigation
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(el => {
        if (el) el.textContent = totalItems;
    });
}

// Add to cart function
function addToCart(productId, productName, productPrice, productImage) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: parseFloat(productPrice),
            image: productImage,
            quantity: 1
        });
    }
    
    saveCart();
    showNotification(`${productName} added to cart! 🛒`);
}

// Show notification
function showNotification(message) {
    let notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Render products on products page
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    const products = [
        { id: 1, name: 'Orange', price: 2.5, image: '🍊', description: 'Fresh squeezed orange juice rich in Vitamin C' },
        { id: 2, name: 'Lemon', price: 2.0, image: '🍋', description: 'Refreshing lemon juice, perfect for detox' },
        { id: 3, name: 'Mango', price: 3.0, image: '🥭', description: 'Sweet and creamy mango juice' },
        { id: 4, name: 'Watermelon', price: 2.5, image: '🍉', description: 'Hydrating watermelon juice' },
        { id: 5, name: 'Pomegranate', price: 3.5, image: '🍎', description: 'Antioxidant-rich pomegranate juice' },
        { id: 6, name: 'Pineapple', price: 3.0, image: '🍍', description: 'Tropical pineapple juice' }
    ];
    
    productsGrid.innerHTML = products.map(product => `
        <div class="card" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">
            <div class="card-icon">${product.image}</div>
            <h3>${product.name}</h3>
            <p>250ml / 1L</p>
            <p class="price">$${product.price}</p>
            <button class="add-to-cart">Add to Cart 🛒</button>
            <button class="view-product" onclick="location.href='product-detail.html?id=${product.id}'">View Details →</button>
        </div>
    `).join('');
    
    // Add event listeners to add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            const id = parseInt(card.dataset.id);
            const name = card.dataset.name;
            const price = parseFloat(card.dataset.price);
            const image = card.dataset.image;
            addToCart(id, name, price, image);
        });
    });
}

// Load product detail
function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    const products = {
        1: { name: 'Orange', price: 2.5, image: '🍊', description: 'Fresh squeezed orange juice rich in Vitamin C. Made from premium oranges, no added sugar, 100% natural.' },
        2: { name: 'Lemon', price: 2.0, image: '🍋', description: 'Refreshing lemon juice, perfect for detox and hydration. Packed with Vitamin C and antioxidants.' },
        3: { name: 'Mango', price: 3.0, image: '🥭', description: 'Sweet and creamy mango juice made from the finest Alphonso mangoes. A taste of paradise!' },
        4: { name: 'Watermelon', price: 2.5, image: '🍉', description: 'Hydrating watermelon juice, perfect for hot Omani days. Refreshing and naturally sweet.' },
        5: { name: 'Pomegranate', price: 3.5, image: '🍎', description: 'Antioxidant-rich pomegranate juice. Supports heart health and immunity.' },
        6: { name: 'Pineapple', price: 3.0, image: '🍍', description: 'Tropical pineapple juice with digestive enzymes. Sweet, tangy, and delicious.' }
    };
    
    const product = products[productId];
    const container = document.getElementById('productDetail');
    
    if (container && product) {
        container.innerHTML = `
            <div class="product-icon">${product.image}</div>
            <h1>${product.name} Juice</h1>
            <p class="price">$${product.price}</p>
            <p>${product.description}</p>
            <p><strong>Available Sizes:</strong> 250ml | 1L</p>
            <p><strong>✅ 100% Natural</strong> | <strong>✅ No Preservatives</strong> | <strong>✅ HACCP Certified</strong></p>
            <button class="btn" id="detailAddToCart">Add to Cart 🛒</button>
            <button class="btn btn-secondary" onclick="location.href='products.html'">Back to Products</button>
        `;
        
        document.getElementById('detailAddToCart')?.addEventListener('click', () => {
            addToCart(productId, product.name, product.price, product.image);
        });
    } else if (container) {
        container.innerHTML = '<h2>Product not found</h2><a href="products.html" class="btn">Back to Products</a>';
    }
}

// Render cart items
function renderCart() {
    const cartItemsList = document.getElementById('cartItemsList');
    const totalItemsSpan = document.getElementById('totalItems');
    const totalPriceSpan = document.getElementById('totalPrice');
    
    if (!cartItemsList) return;
    
    if (cart.length === 0) {
        cartItemsList.innerHTML = '<div class="empty-cart">🛒 Your cart is empty. <a href="products.html">Shop now</a></div>';
        if (totalItemsSpan) totalItemsSpan.textContent = '0';
        if (totalPriceSpan) totalPriceSpan.textContent = '0.00';
        return;
    }
    
    cartItemsList.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <span class="cart-item-icon">${item.image}</span>
                <div>
                    <strong>${item.name} Juice</strong><br>
                    $${item.price} each
                </div>
            </div>
            <div class="cart-item-actions">
                <button class="decrease-qty" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="increase-qty" data-id="${item.id}">+</button>
                <button class="remove-item" data-id="${item.id}">🗑️</button>
            </div>
            <div>
                <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
            </div>
        </div>
    `).join('');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (totalItemsSpan) totalItemsSpan.textContent = totalItems;
    if (totalPriceSpan) totalPriceSpan.textContent = totalPrice.toFixed(2);
    
    // Add event listeners to cart buttons
    document.querySelectorAll('.increase-qty').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            const item = cart.find(i => i.id === id);
            if (item) {
                item.quantity++;
                saveCart();
                renderCart();
            }
        });
    });
    
    document.querySelectorAll('.decrease-qty').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            const item = cart.find(i => i.id === id);
            if (item) {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    cart = cart.filter(i => i.id !== id);
                }
                saveCart();
                renderCart();
            }
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            cart = cart.filter(i => i.id !== id);
            saveCart();
            renderCart();
        });
    });
}

// Contact form handler
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName')?.value;
        const email = document.getElementById('contactEmail')?.value;
        const subject = document.getElementById('contactSubject')?.value;
        const message = document.getElementById('contactMessage')?.value;
        const formMessage = document.getElementById('formMessage');
        
        if (name && email && message) {
            formMessage.textContent = `Thank you ${name}! Your message has been sent. We'll contact you soon.`;
            formMessage.className = 'form-message success';
            form.reset();
            
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }, 5000);
        } else {
            formMessage.textContent = 'Please fill in all required fields.';
            formMessage.className = 'form-message error';
        }
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const menuIcon = document.getElementById('menuIcon');
    const nav = document.querySelector('nav');
    
    if (menuIcon && nav) {
        menuIcon.addEventListener('click', () => {
            nav.classList.toggle('show');
        });
    }
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderProducts();
    loadProductDetail();
    renderCart();
    initContactForm();
    initMobileMenu();
    
    // Add to cart buttons on homepage
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            if (card) {
                const id = parseInt(card.dataset.id);
                const name = card.dataset.name;
                const price = parseFloat(card.dataset.price);
                const image = card.dataset.image;
                addToCart(id, name, price, image);
            }
        });
    });
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                alert(`Thank you for your order! Total: $${cart.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(2)}\nWe will contact you soon.`);
                cart = [];
                saveCart();
                renderCart();
            } else {
                alert('Your cart is empty!');
            }
        });
    }
    
    // Clear cart button
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your cart?')) {
                cart = [];
                saveCart();
                renderCart();
            }
        });
    }
});