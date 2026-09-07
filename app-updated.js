// ============ CONFIGURATION ============

const API_URL = 'http://localhost:5000/api'; // Change to your backend URL in production
let socket = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    loadProducts();
    loadCart();
    loadWishlist();
    checkUserSession();
    connectSocket();
    document.addEventListener('click', handleNotifications);
}

// ============ SOCKET.IO SETUP ============

function connectSocket() {
    socket = io(API_URL.replace('/api', ''), {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
    });

    socket.on('connect', () => {
        console.log('✅ Connected to server');
        const userId = localStorage.getItem('userId');
        if (userId) {
            socket.emit('join-admin');
        }
    });

    socket.on('new-order', (order) => {
        if (isAdminLoggedIn()) {
            showNotification(`🎉 New Order: ${order.customerInfo.fullName}`, 'success');
        }
    });

    socket.on('order-status-update', (data) => {
        if (localStorage.getItem('userId')) {
            showNotification(`📦 Order ${data.orderNumber}: ${data.status}`, 'info');
        }
    });

    socket.on('new-message', (data) => {
        if (isAdminLoggedIn()) {
            showNotification(`💬 New message from ${data.senderName}`, 'info');
        }
    });
}

// ============ AUTHENTICATION ============

function showAuthModal() {
    if (localStorage.getItem('token')) {
        showUserMenu();
        return;
    }
    document.getElementById('auth-modal').style.display = 'block';
}

function closeAuthModal() {
    document.getElementById('auth-modal').style.display = 'none';
}

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.auth-tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(tab + '-tab').classList.add('active');
    event.target.classList.add('active');
}

async function customerRegister(e) {
    e.preventDefault();
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: document.getElementById('register-name').value,
                email: document.getElementById('register-email').value,
                password: document.getElementById('register-password').value,
                phone: document.getElementById('register-phone').value
            })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('userRole', 'customer');
            showNotification('✅ Registration successful!', 'success');
            closeAuthModal();
            showUserMenu();
        } else {
            showNotification(data.error, 'error');
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function customerLogin(e) {
    e.preventDefault();
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: document.getElementById('login-email').value,
                password: document.getElementById('login-password').value
            })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('userRole', 'customer');
            showNotification('✅ Login successful!', 'success');
            closeAuthModal();
            showUserMenu();
        } else {
            showNotification(data.error, 'error');
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

function checkUserSession() {
    const token = localStorage.getItem('token');
    if (token) {
        const userRole = localStorage.getItem('userRole');
        showUserMenu();
        if (userRole === 'admin') {
            document.getElementById('admin-btn').style.display = 'inline-block';
        }
    }
}

function showUserMenu() {
    const userMenu = document.getElementById('user-menu');
    const token = localStorage.getItem('token');
    if (token) {
        userMenu.innerHTML = `
            <a href="#" onclick="showProfile()" class="nav-icon-btn">👤 My Profile</a>
            <a href="#" onclick="showOrderHistory()" class="nav-icon-btn">📦 Orders</a>
            <a href="#" onclick="logout()" class="nav-icon-btn">🚪 Logout</a>
        `;
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    document.getElementById('admin-btn').style.display = 'none';
    document.getElementById('user-menu').innerHTML = '<a href="#" onclick="showAuthModal()" class="nav-icon-btn">👤 Login</a>';
    showNotification('✅ Logged out', 'success');
}

// ============ PRODUCTS ============

async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to demo products
        loadDemoProducts();
    }
}

function loadDemoProducts() {
    const products = [
        {
            _id: '1',
            name: 'Vanilla Classic',
            category: 'vanilla',
            price: 4.99,
            description: 'Rich and creamy vanilla ice cream',
            images: ['https://via.placeholder.com/300?text=Vanilla+Classic'],
            rating: 4.5,
            reviews: [],
            tags: ['featured']
        },
        {
            _id: '2',
            name: 'Chocolate Dream',
            category: 'chocolate',
            price: 5.49,
            description: 'Decadent dark chocolate ice cream',
            images: ['https://via.placeholder.com/300?text=Chocolate+Dream'],
            rating: 4.7,
            reviews: [],
            tags: ['bestseller']
        },
        {
            _id: '3',
            name: 'Strawberry Bliss',
            category: 'strawberry',
            price: 5.49,
            description: 'Fresh strawberry ice cream',
            images: ['https://via.placeholder.com/300?text=Strawberry+Bliss'],
            rating: 4.6,
            reviews: [],
            tags: ['featured']
        },
        {
            _id: '4',
            name: 'Mint Chocolate Chip',
            category: 'special',
            price: 5.99,
            description: 'Cool mint with rich chocolate chips',
            images: ['https://via.placeholder.com/300?text=Mint+Chocolate+Chip'],
            rating: 4.8,
            reviews: [],
            tags: ['bestseller']
        }
    ];
    displayProducts(products);
}

function displayProducts(products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image" style="background-image: url('${product.images[0]}'); cursor: pointer;" onclick="openProductModal('${product._id}')"></div>
            <div class="product-info">
                <div class="product-tags">
                    ${product.tags ? product.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                </div>
                <h3 class="product-name" onclick="openProductModal('${product._id}')" style="cursor: pointer;">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">⭐ ${product.rating || 0} (${product.reviews ? product.reviews.length : 0})</div>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="addProductToCart('${product._id}', '${product.name}', ${product.price}, '${product.images[0]}')">Add to Cart</button>
                    <button class="btn btn-secondary" onclick="addToWishlist('${product._id}')">❤️</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterProducts() {
    const search = document.getElementById('search-input').value.toLowerCase();
    const category = document.getElementById('category-filter').value;
    const priceRange = document.getElementById('price-filter').value;
    const sort = document.getElementById('sort-filter').value;

    let query = new URLSearchParams();
    if (search) query.append('search', search);
    if (category) query.append('category', category);
    if (sort) query.append('sort', sort);

    fetch(`${API_URL}/products?${query}`)
        .then(res => res.json())
        .then(products => {
            if (priceRange) {
                const [min, max] = priceRange.split('-').map(Number);
                products = products.filter(p => p.price >= min && p.price <= max);
            }
            displayProducts(products);
        })
        .catch(() => loadDemoProducts());
}

async function openProductModal(productId) {
    try {
        const response = await fetch(`${API_URL}/products/${productId}`);
        const product = await response.json();
        
        document.getElementById('detail-product-name').textContent = product.name;
        document.getElementById('detail-price').textContent = `$${product.price.toFixed(2)}`;
        document.getElementById('detail-description').textContent = product.description;
        document.getElementById('detail-stock').textContent = `Stock: ${product.stock || 100}`;
        document.getElementById('detail-rating').textContent = `⭐ ${product.rating || 0}`;
        document.getElementById('detail-reviews-count').textContent = `(${product.reviews ? product.reviews.length : 0} reviews)`;
        
        // Images
        document.getElementById('detail-main-image').src = product.images[0];
        document.getElementById('product-thumbnails').innerHTML = product.images.map((img, i) => `
            <img src="${img}" alt="Thumbnail" onclick="document.getElementById('detail-main-image').src='${img}'">
        `).join('');

        // Reviews
        const reviewsHtml = (product.reviews || []).map(r => `
            <div class="review-item">
                <p><strong>${r.userName}</strong> - ${'⭐'.repeat(r.rating)}</p>
                <p>${r.comment}</p>
            </div>
        `).join('');
        document.getElementById('product-reviews').innerHTML = reviewsHtml || '<p>No reviews yet</p>';

        // Store for cart/wishlist
        window.currentProduct = product;
        document.getElementById('product-modal').style.display = 'block';
    } catch (error) {
        showNotification('Error loading product', 'error');
    }
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
}

// ============ CART ============

function addProductToCart(productId, name, price, image) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ productId, name, price, image, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`✅ ${name} added to cart!`, 'success');
}

function addDetailToCart() {
    const quantity = parseInt(document.getElementById('detail-quantity').value);
    const product = window.currentProduct;
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.productId === product._id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`✅ ${quantity} x ${product.name} added to cart!`, 'success');
}

function loadCart() {
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function openCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsDiv = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty</p>';
    } else {
        cartItemsDiv.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; border-radius: 5px;">
                <div class="cart-item-info">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button onclick="updateCartQuantity(${index}, -1)">-</button>
                        <input type="number" value="${item.quantity}" readonly style="width: 30px; text-align: center;">
                        <button onclick="updateCartQuantity(${index}, 1)">+</button>
                    </div>
                </div>
                <button class="btn btn-danger" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `).join('');
    }
    
    updateCartTotals();
    document.getElementById('cart-modal').style.display = 'block';
}

function updateCartQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    openCart();
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    openCart();
}

function updateCartTotals() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = parseFloat(localStorage.getItem('cartDiscount') || 0);
    const total = Math.max(0, subtotal - discount);
    
    document.getElementById('cart-subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('cart-discount').textContent = discount.toFixed(2);
    document.getElementById('cart-total').textContent = total.toFixed(2);
}

function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
}

async function applyCoupon() {
    const code = document.getElementById('coupon-code').value;
    if (!code) {
        showNotification('Please enter a coupon code', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/coupons/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });
        
        const data = await response.json();
        if (response.ok) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const discount = (subtotal * data.discount) / 100;
            
            localStorage.setItem('cartDiscount', discount.toFixed(2));
            updateCartTotals();
            showNotification(`✅ Coupon applied! You saved $${discount.toFixed(2)}`, 'success');
        } else {
            showNotification(data.error, 'error');
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    const token = localStorage.getItem('token');
    if (token) {
        openCheckout();
    } else {
        showNotification('Please login to checkout', 'info');
        closeCart();
        showAuthModal();
    }
}

function openCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    document.getElementById('checkout-items').innerHTML = cart.map(item => `
        <p>${item.name} x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</p>
    `).join('');
    document.getElementById('checkout-total').textContent = total.toFixed(2);
    
    document.getElementById('checkout-modal').style.display = 'block';
}

function closeCheckout() {
    document.getElementById('checkout-modal').style.display = 'none';
}

async function placeOrder(e) {
    e.preventDefault();
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const userId = localStorage.getItem('userId');
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                customerInfo: {
                    fullName: document.getElementById('checkout-name').value,
                    email: document.getElementById('checkout-email').value,
                    phone: document.getElementById('checkout-phone').value,
                    address: document.getElementById('checkout-address').value,
                    city: document.getElementById('checkout-city').value,
                    deliveryNotes: document.getElementById('checkout-notes').value
                },
                items: cart,
                totalPrice
            })
        });
        
        const data = await response.json();
        if (response.ok) {
            localStorage.removeItem('cart');
            localStorage.removeItem('cartDiscount');
            updateCartCount();
            closeCheckout();
            closeCart();
            showNotification(`✅ Order placed successfully! Order #${data.order.orderNumber}`, 'success');
        } else {
            showNotification(data.error, 'error');
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// ============ WISHLIST ============

function loadWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    console.log('Wishlist loaded:', wishlist);
}

function addToWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const product = window.currentProduct;
    
    if (!wishlist.find(item => item.productId === productId)) {
        wishlist.push({
            productId,
            name: product.name,
            price: product.price,
            image: product.images[0]
        });
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        showNotification(`❤️ ${product.name} added to wishlist!`, 'success');
    } else {
        showNotification('Already in wishlist', 'info');
    }
}

function openWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistDiv = document.getElementById('wishlist-items');
    
    if (wishlist.length === 0) {
        wishlistDiv.innerHTML = '<p>Your wishlist is empty</p>';
    } else {
        wishlistDiv.innerHTML = wishlist.map((item, index) => `
            <div class="wishlist-item">
                <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; border-radius: 5px;">
                <div>
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                    <button class="btn btn-primary" onclick="addProductToCart('${item.productId}', '${item.name}', ${item.price}, '${item.image}')">Add to Cart</button>
                    <button class="btn btn-danger" onclick="removeFromWishlist(${index})">Remove</button>
                </div>
            </div>
        `).join('');
    }
    
    document.getElementById('wishlist-modal').style.display = 'block';
}

function closeWishlist() {
    document.getElementById('wishlist-modal').style.display = 'none';
}

function removeFromWishlist(index) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist.splice(index, 1);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    openWishlist();
}

// ============ ADMIN ============

function isAdminLoggedIn() {
    return localStorage.getItem('adminToken') !== null;
}

function openAdmin() {
    document.getElementById('admin-modal').style.display = 'block';
}

function closeAdmin() {
    document.getElementById('admin-modal').style.display = 'none';
}

async function adminLogin(e) {
    e.preventDefault();
    try {
        const response = await fetch(`${API_URL}/auth/admin-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: document.getElementById('admin-email').value,
                password: document.getElementById('admin-password').value
            })
        });
        
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminId', data.userId);
            document.getElementById('admin-login').style.display = 'none';
            document.getElementById('admin-dashboard').style.display = 'block';
            loadAdminDashboard();
            showNotification('✅ Admin login successful', 'success');
        } else {
            showNotification(data.error, 'error');
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

function adminLogout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminId');
    document.getElementById('admin-login').style.display = 'block';
    document.getElementById('admin-dashboard').style.display = 'none';
    showNotification('✅ Admin logged out', 'success');
}

async function loadAdminDashboard() {
    const token = localStorage.getItem('adminToken');
    try {
        const response = await fetch(`${API_URL}/admin/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const stats = await response.json();
        
        document.getElementById('stat-orders').textContent = stats.totalOrders;
        document.getElementById('stat-revenue').textContent = stats.totalRevenue.toFixed(2);
        document.getElementById('stat-customers').textContent = stats.totalCustomers;
        document.getElementById('stat-bestsellers').innerHTML = stats.bestSellers
            .map(seller => `<p>${seller._id}: ${seller.count} sold</p>`)
            .join('');
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function switchAdminTab(tab) {
    document.querySelectorAll('.admin-tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(tab + '-tab').classList.add('active');
    event.target.classList.add('active');
}

async function addProduct(e) {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    
    formData.append('name', document.getElementById('product-name').value);
    formData.append('category', document.getElementById('product-category').value);
    formData.append('price', document.getElementById('product-price').value);
    formData.append('stock', document.getElementById('product-stock').value);
    formData.append('description', document.getElementById('product-description').value);
    formData.append('tags', document.getElementById('product-tags').value);
    
    const imageFiles = document.getElementById('product-images').files;
    for (let i = 0; i < imageFiles.length; i++) {
        formData.append('images', imageFiles[i]);
    }
    
    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        
        if (response.ok) {
            document.getElementById('add-product-form').reset();
            showNotification('✅ Product added successfully', 'success');
            loadAdminProducts();
        } else {
            const data = await response.json();
            showNotification(data.error, 'error');
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function loadAdminProducts() {
    const token = localStorage.getItem('adminToken');
    try {
        const response = await fetch(`${API_URL}/products`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const products = await response.json();
        
        document.getElementById('admin-products-list').innerHTML = products.map(product => `
            <div class="admin-product-item">
                <h4>${product.name}</h4>
                <p>Category: ${product.category} | Price: $${product.price} | Stock: ${product.stock}</p>
                <div class="admin-product-actions">
                    <button class="btn btn-warning" onclick="editProduct('${product._id}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteProduct('${product._id}')">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure?')) return;
    const token = localStorage.getItem('adminToken');
    try {
        const response = await fetch(`${API_URL}/products/${productId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            showNotification('✅ Product deleted', 'success');
            loadAdminProducts();
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function loadAdminOrders() {
    const token = localStorage.getItem('adminToken');
    try {
        const response = await fetch(`${API_URL}/orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const orders = await response.json();
        
        document.getElementById('admin-orders-list').innerHTML = orders.map(order => `
            <div class="admin-order-item">
                <h4>Order #${order.orderNumber}</h4>
                <p>Customer: ${order.customerInfo.fullName} | Phone: ${order.customerInfo.phone}</p>
                <p>Address: ${order.customerInfo.address}, ${order.customerInfo.city}</p>
                <p>Items: ${order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</p>
                <p>Total: $${order.totalPrice.toFixed(2)} | Status: ${order.status}</p>
                <div class="form-group">
                    <select onchange="updateOrderStatus('${order._id}', this.value)">
                        <option value="${order.status}">${order.status}</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

async function updateOrderStatus(orderId, status) {
    const token = localStorage.getItem('adminToken');
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            showNotification('✅ Order status updated', 'success');
            loadAdminOrders();
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// ============ UTILITY FUNCTIONS ============

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function navigateTo(section) {
    document.querySelectorAll('section').forEach(el => el.style.display = 'none');
    const sectionEl = document.getElementById(section);
    if (sectionEl) {
        sectionEl.style.display = 'block';
        sectionEl.scrollIntoView({ behavior: 'smooth' });
    }
}

function toggleChat() {
    const chatBody = document.getElementById('chat-body');
    chatBody.style.display = chatBody.style.display === 'none' ? 'block' : 'none';
}

function sendChatMessage() {
    const message = document.getElementById('chat-message-input').value;
    if (!message) return;
    
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
    document.getElementById('chat-message-input').value = '';
    
    if (socket) {
        socket.emit('new-message', {
            message,
            senderName: 'Customer',
            senderRole: 'customer'
        });
    }
}

function handleNotifications() {
    // Placeholder for notification handling
}

// Close modals on background click
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
};
