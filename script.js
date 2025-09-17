// Sample product data
const products = [
    { id: 1, name: 'Wireless Headphones', price: 400, image: 'photos/headphone.jpg', description: 'High-quality wireless headphones with noise cancellation for an immersive audio experience.' },
    { id: 2, name: 'Smart Watch', price: 350, image: 'photos/smartwatch.jpg', description: 'Stay connected and track your fitness goals with this feature-rich smart watch.' },
    { id: 3, name: 'Portable Speaker', price: 2000, image: 'photos/speaker.jpg', description: 'Compact and powerful portable speaker for on-the-go music and entertainment.' },
    { id: 4, name: 'HD Webcam', price: 3000, image: 'photos/webcam.jpg', description: 'Crystal clear video calls with this high-definition webcam. Perfect for remote work.' },
    { id: 5, name: 'Gaming Mouse', price: 459, image: 'photos/mouse.jpg', description: 'Precision gaming mouse with customizable RGB lighting and ergonomic design.' },
    { id: 6, name: 'Ergonomic Keyboard', price: 509, image: 'photos/keyboard.jpg', description: 'A comfortable and responsive keyboard designed for long hours of typing and use.' },
    { id: 7, name: 'External SSD', price: 829, image: 'photos/ssd.jpg', description: 'Fast and reliable external storage for all your files and data backups.' },
    { id: 8, name: 'Desk Monitor', price: 457, image: 'photos/monitor.jpg', description: 'A large, high-resolution monitor perfect for productivity and immersive entertainment.' }
];

// Load cart from local storage or initialize as an empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartDisplay();
    setupEventListeners();
});

// Function to handle page navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');

    // Dynamically render content based on the page
    if (pageId === 'cart-page') {
        renderCart();
    } else if (pageId === 'products-page' || pageId === 'home-page') {
        renderProducts();
    }
}

// Renders product cards on the Home and Products pages
function renderProducts() {
    const featuredProductsEl = document.getElementById('featured-products');
    const allProductsEl = document.getElementById('all-products');
    
    // Clear previous content
    if (featuredProductsEl) featuredProductsEl.innerHTML = '';
    if (allProductsEl) allProductsEl.innerHTML = '';

    products.forEach((product, index) => {
        const productCardHTML = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>₹${product.price.toFixed(2)}</p>
                <button onclick="showProductDetails(${product.id})">View Details</button>
            </div>
        `;
        
        if (featuredProductsEl && index < 6) {
            featuredProductsEl.innerHTML += productCardHTML;
        }

        if (allProductsEl) {
            allProductsEl.innerHTML += productCardHTML;
        }
    });
}

// Renders the product details page
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    const detailsContainer = document.getElementById('product-details');

    if (product) {
        detailsContainer.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="details-info">
                <h2>${product.name}</h2>
                <p class="price">₹${product.price.toFixed(2)}</p>
                <p>${product.description}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
            <div class="you-might-like">
                <h3>You might also like...</h3>
                <div class="product-grid">
                    ${renderRecommendations(productId)}
                </div>
            </div>
        `;
        showPage('product-details-page');
    }
}

// Renders a basic "You might also like" section
function renderRecommendations(currentProductId) {
    const otherProducts = products.filter(p => p.id !== currentProductId);
    const shuffled = otherProducts.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    
    return selected.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>₹${p.price.toFixed(2)}</p>
            <button onclick="showProductDetails(${p.id})">View Details</button>
        </div>
    `).join('');
}

// Adds an item to the cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (product) {
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        alert(`${product.name} added to cart!`);
    }
}

// Renders the cart page content
function renderCart() {
    const cartItemsEl = document.getElementById('cart-items');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    cartItemsEl.innerHTML = '';
    
    let total = 0;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p class="empty-cart-message">Your cart is empty. Start shopping now! ✨</p>';
        cartTotalPriceEl.textContent = '0.00';
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const cartItemEl = document.createElement('div');
        cartItemEl.classList.add('cart-item');
        cartItemEl.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <p>Price: ₹${item.price.toFixed(2)}</p>
                </div>
            </div>
            <div class="cart-item-actions">
                <button onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItemsEl.appendChild(cartItemEl);
    });

    cartTotalPriceEl.textContent = total.toFixed(2);
}

// Updates the quantity of an item in the cart
function updateQuantity(productId, change) {
    const item = cart.find(p => p.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            updateCartDisplay();
        }
    }
}

// Removes an item from the cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartDisplay();
}

// Updates the cart icon count in the header
function updateCartDisplay() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
}

// Event listeners for the contact form
function setupEventListeners() {
    document.getElementById('contact-form').addEventListener('submit', validateForm);
}

// Validates the contact form
function validateForm(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    if (!name || !email || !subject || !message) {
        alert('Please fill out all fields.');
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    alert('Message sent successfully! Thank you for your feedback. 😊');
    document.getElementById('contact-form').reset();
    return true;
}