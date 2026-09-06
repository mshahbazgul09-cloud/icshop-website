// Initial product database
let products = [
    {
        id: 1,
        name: 'Vanilla Classic',
        category: 'vanilla',
        price: 500,
        description: 'Smooth and creamy vanilla ice cream',
        image: 'https://via.placeholder.com/300x250/FFD700/000000?text=Vanilla+Classic'
    },
    {
        id: 2,
        name: 'Chocolate Dream',
        category: 'chocolate',
        price: 550,
        description: 'Rich and delicious chocolate ice cream',
        image: 'https://via.placeholder.com/300x250/8B4513/FFFFFF?text=Chocolate+Dream'
    },
    {
        id: 3,
        name: 'Strawberry Bliss',
        category: 'strawberry',
        price: 550,
        description: 'Fresh strawberry flavored ice cream',
        image: 'https://via.placeholder.com/300x250/FF69B4/FFFFFF?text=Strawberry+Bliss'
    },
    {
        id: 4,
        name: 'Mint Chocolate Chip',
        category: 'special',
        price: 600,
        description: 'Refreshing mint with chocolate chips',
        image: 'https://via.placeholder.com/300x250/98FF98/000000?text=Mint+Chip'
    },
    {
        id: 5,
        name: 'Cookies & Cream',
        category: 'special',
        price: 600,
        description: 'Vanilla ice cream with cookie pieces',
        image: 'https://via.placeholder.com/300x250/D3D3D3/000000?text=Cookies+Cream'
    },
    {
        id: 6,
        name: 'Caramel Swirl',
        category: 'special',
        price: 600,
        description: 'Vanilla ice cream with caramel ribbons',
        image: 'https://via.placeholder.com/300x250/CD853F/FFFFFF?text=Caramel+Swirl'
    }
];

let cart = [];
let orders = [];
let currentFilter = 'all';
const CURRENCY = '₨'; // PKR Currency Symbol

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadCartFromStorage();
    updateCartCount();
});

// Load products and display
function loadProducts() {
    displayProducts(products);
}

// Display products based on current filter
function displayProducts(productsToShow) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        grid.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">${CURRENCY}${product.price}</div>
            <div class="product-actions">
                <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `;
    return card;
}

// Filter products
function filterProducts(category) {
    currentFilter = category;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter and display
    if (category === 'all') {
        displayProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        displayProducts(filtered);
    }
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Display cart items
function displayCartItems() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align: center; color: #999;">Your cart is empty</p>';
        document.getElementById('cart-total').textContent = '0';
        return;
    }
    
    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${CURRENCY}${item.price} each</div>
                <div class="cart-item-quantity">
                    <button class="btn" onclick="decreaseQuantity(${index})" style="padding: 0.2rem 0.5rem;">-</button>
                    <input type="number" value="${item.quantity}" onchange="updateQuantity(${index}, this.value)" min="1">
                    <button class="btn" onclick="increaseQuantity(${index})" style="padding: 0.2rem 0.5rem;">+</button>
                </div>
                <div style="margin-top: 0.5rem; font-weight: bold;">Subtotal: ${CURRENCY}${itemTotal}</div>
            </div>
            <button class="btn btn-danger" onclick="removeFromCart(${index})">Remove</button>
        `;
        cartContainer.appendChild(cartItem);
    });
    
    document.getElementById('cart-total').textContent = total;
}

// Increase quantity
function increaseQuantity(index) {
    cart[index].quantity++;
    saveCartToStorage();
    updateCartCount();
    displayCartItems();
}

// Decrease quantity
function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        removeFromCart(index);
        return;
    }
    saveCartToStorage();
    updateCartCount();
    displayCartItems();
}

// Update quantity
function updateQuantity(index, value) {
    const qty = parseInt(value);
    if (qty > 0) {
        cart[index].quantity = qty;
    } else {
        removeFromCart(index);
        return;
    }
    saveCartToStorage();
    updateCartCount();
    displayCartItems();
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCartToStorage();
    updateCartCount();
    displayCartItems();
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromStorage() {
    const saved = localStorage.getItem('cart');
    if (saved) {
        cart = JSON.parse(saved);
    }
}

// Open cart modal
function openCart() {
    document.getElementById('cart-modal').style.display = 'block';
    displayCartItems();
}

// Close cart modal
function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const order = {
        id: 'ORD-' + Date.now(),
        date: new Date().toLocaleString(),
        items: [...cart],
        total: total,
        status: 'Pending'
    };
    
    orders.push(order);
    saveOrdersToStorage();
    
    alert(`Order placed successfully!\nOrder ID: ${order.id}\nTotal: ${CURRENCY}${total}`);
    cart = [];
    saveCartToStorage();
    updateCartCount();
    closeCart();
}

// Admin Panel Functions
function openAdmin() {
    const password = prompt('Enter admin password:');
    if (password === 'shahhbaz0786') {
        document.getElementById('admin-modal').style.display = 'block';
        displayAdminProducts();
        loadOrdersFromStorage();
        displayAdminOrders();
    } else if (password !== null) {
        alert('Incorrect password!');
    }
}

function closeAdmin() {
    document.getElementById('admin-modal').style.display = 'none';
}

function switchAdminTab(tab) {
    // Hide all tabs
    document.querySelectorAll('.admin-tab-content').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tab + '-tab').classList.add('active');
    event.target.classList.add('active');
}

// Display products in admin
function displayAdminProducts() {
    const container = document.getElementById('admin-products-list');
    container.innerHTML = '';
    
    if (products.length === 0) {
        container.innerHTML = '<p>No products available</p>';
        return;
    }
    
    products.forEach((product, index) => {
        const item = document.createElement('div');
        item.className = 'admin-product-item';
        item.innerHTML = `
            <h4>${product.name}</h4>
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Price:</strong> ${CURRENCY}${product.price}</p>
            <p><strong>Description:</strong> ${product.description}</p>
            <div class="admin-product-actions">
                <button class="btn btn-warning" onclick="editProduct(${index})">Edit</button>
                <button class="btn btn-danger" onclick="deleteProduct(${index})">Delete</button>
            </div>
        `;
        container.appendChild(item);
    });
}

// Add product
function addProduct(event) {
    event.preventDefault();
    
    const name = document.getElementById('product-name').value;
    const category = document.getElementById('product-category').value;
    const price = parseInt(document.getElementById('product-price').value);
    const description = document.getElementById('product-description').value;
    const image = document.getElementById('product-image').value;
    
    const newProduct = {
        id: Date.now(),
        name: name,
        category: category,
        price: price,
        description: description,
        image: image
    };
    
    products.push(newProduct);
    saveProductsToStorage();
    
    // Reset form
    document.getElementById('add-product-form').reset();
    
    // Switch to products tab and refresh
    switchAdminTab('products');
    setTimeout(() => {
        displayAdminProducts();
    }, 100);
    
    showNotification('Product added successfully!');
}

// Edit product
function editProduct(index) {
    const product = products[index];
    const newPrice = prompt(`Edit price for ${product.name}:\n(Current: ${CURRENCY}${product.price})`, product.price);
    
    if (newPrice !== null && newPrice !== '') {
        const price = parseInt(newPrice);
        if (!isNaN(price) && price > 0) {
            products[index].price = price;
            saveProductsToStorage();
            displayAdminProducts();
            showNotification('Product updated successfully!');
        } else {
            alert('Invalid price!');
        }
    }
}

// Delete product
function deleteProduct(index) {
    if (confirm(`Are you sure you want to delete ${products[index].name}?`)) {
        products.splice(index, 1);
        saveProductsToStorage();
        displayAdminProducts();
        displayProducts(products.filter(p => currentFilter === 'all' || p.category === currentFilter));
        showNotification('Product deleted successfully!');
    }
}

// Display orders in admin
function displayAdminOrders() {
    const container = document.getElementById('admin-orders-list');
    container.innerHTML = '';
    
    if (orders.length === 0) {
        container.innerHTML = '<p>No orders yet</p>';
        return;
    }
    
    orders.forEach((order, index) => {
        const item = document.createElement('div');
        item.className = 'admin-order-item';
        let itemsList = order.items.map(i => `${i.name} x${i.quantity}`).join(', ');
        item.innerHTML = `
            <h4>Order ID: ${order.id}</h4>
            <p><strong>Date:</strong> ${order.date}</p>
            <p><strong>Items:</strong> ${itemsList}</p>
            <p><strong>Total:</strong> ${CURRENCY}${order.total}</p>
            <p><strong>Status:</strong> 
                <select onchange="updateOrderStatus(${index}, this.value)">
                    <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Preparing" ${order.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
                    <option value="Ready" ${order.status === 'Ready' ? 'selected' : ''}>Ready</option>
                    <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
                </select>
            </p>
        `;
        container.appendChild(item);
    });
}

// Update order status
function updateOrderStatus(index, status) {
    orders[index].status = status;
    saveOrdersToStorage();
    showNotification(`Order status updated to ${status}`);
}

// Save and load products from localStorage
function saveProductsToStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

function loadProductsFromStorage() {
    const saved = localStorage.getItem('products');
    if (saved) {
        products = JSON.parse(saved);
    }
}

// Save and load orders from localStorage
function saveOrdersToStorage() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

function loadOrdersFromStorage() {
    const saved = localStorage.getItem('orders');
    if (saved) {
        orders = JSON.parse(saved);
    }
}

// Navigation
function navigateTo(section) {
    const sections = document.querySelectorAll('section');
    sections.forEach(s => {
        s.style.display = s.id === section ? 'block' : 'none';
    });
    document.getElementById(section).style.display = 'block';
}

// Notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 2000;
        animation: slideIn 0.3s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Close modals when clicking outside
window.onclick = function(event) {
    const cartModal = document.getElementById('cart-modal');
    const adminModal = document.getElementById('admin-modal');
    
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
    if (event.target === adminModal) {
        adminModal.style.display = 'none';
    }
};

// Load products from storage on startup
window.addEventListener('load', function() {
    loadProductsFromStorage();
    loadOrdersFromStorage();
    if (products.length === 0) {
        // Use default products if none in storage
        saveProductsToStorage();
    }
    displayProducts(products);
});