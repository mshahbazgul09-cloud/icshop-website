const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.CLIENT_URL || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static('uploads'));

// File upload configuration
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/icshop', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// ============ DATABASE SCHEMAS ============

// User Schema
const userSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: String,
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    isAdmin: Boolean,
    addresses: [{
        label: String,
        street: String,
        city: String,
        country: String,
        postalCode: String,
        isDefault: Boolean
    }],
    createdAt: { type: Date, default: Date.now }
});

// Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    images: [String],
    stock: { type: Number, default: 100 },
    rating: { type: Number, default: 0 },
    reviews: [{
        userId: mongoose.Schema.Types.ObjectId,
        userName: String,
        rating: Number,
        comment: String,
        createdAt: { type: Date, default: Date.now }
    }],
    tags: [String], // featured, bestseller, new-arrival
    relatedProducts: [mongoose.Schema.Types.ObjectId],
    createdAt: { type: Date, default: Date.now }
});

// Order Schema
const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, unique: true },
    userId: mongoose.Schema.Types.ObjectId,
    customerInfo: {
        fullName: String,
        phone: String,
        email: String,
        address: String,
        city: String,
        deliveryNotes: String
    },
    items: [{
        productId: mongoose.Schema.Types.ObjectId,
        name: String,
        price: Number,
        quantity: Number,
        image: String
    }],
    totalPrice: Number,
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Chat Schema
const chatSchema = new mongoose.Schema({
    orderId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    messages: [{
        senderId: mongoose.Schema.Types.ObjectId,
        senderName: String,
        senderRole: String,
        message: String,
        timestamp: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

// Coupon Schema
const couponSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },
    discount: Number,
    maxUses: Number,
    usedCount: { type: Number, default: 0 },
    expiryDate: Date,
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const Chat = mongoose.model('Chat', chatSchema);
const Coupon = mongoose.model('Coupon', couponSchema);

// ============ AUTHENTICATION MIDDLEWARE ============

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    });
};

const verifyAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// ============ AUTH ROUTES ============

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            phone,
            role: 'customer'
        });

        await newUser.save();
        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '30d' }
        );

        res.json({ message: 'User registered', token, userId: newUser._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ error: 'User not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '30d' }
        );

        res.json({ message: 'Login successful', token, userId: user._id, role: user.role });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Admin Login
app.post('/api/auth/admin-login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, role: 'admin' });

        if (!user) return res.status(400).json({ error: 'Admin not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign(
            { userId: user._id, role: 'admin' },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.json({ message: 'Admin login successful', token, userId: user._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ============ PRODUCT ROUTES ============

// Get all products with filters
app.get('/api/products', async (req, res) => {
    try {
        const { category, search, sort, minPrice, maxPrice } = req.query;
        let query = {};

        if (category) query.category = category;
        if (search) query.name = { $regex: search, $options: 'i' };
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        let products = Product.find(query);

        if (sort === 'price-low') products = products.sort({ price: 1 });
        if (sort === 'price-high') products = products.sort({ price: -1 });
        if (sort === 'newest') products = products.sort({ createdAt: -1 });
        if (sort === 'rating') products = products.sort({ rating: -1 });

        const result = await products;
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('relatedProducts');
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add product (Admin only)
app.post('/api/products', verifyToken, verifyAdmin, upload.array('images', 5), async (req, res) => {
    try {
        const { name, category, price, description, tags } = req.body;
        const images = req.files.map(f => `/uploads/${f.filename}`);

        const newProduct = new Product({
            name,
            category,
            price: parseFloat(price),
            description,
            images,
            tags: tags ? tags.split(',') : []
        });

        await newProduct.save();
        res.json({ message: 'Product added', product: newProduct });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update product (Admin only)
app.put('/api/products/:id', verifyToken, verifyAdmin, upload.array('images', 5), async (req, res) => {
    try {
        const { name, category, price, description, stock, tags } = req.body;
        const updateData = { name, category, price: parseFloat(price), description, stock: parseInt(stock) };

        if (req.files.length > 0) {
            updateData.images = req.files.map(f => `/uploads/${f.filename}`);
        }

        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json({ message: 'Product updated', product });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete product (Admin only)
app.delete('/api/products/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ============ ORDER ROUTES ============

// Create order
app.post('/api/orders', async (req, res) => {
    try {
        const { userId, customerInfo, items, totalPrice } = req.body;
        const orderNumber = `ORD-${Date.now()}`;

        const newOrder = new Order({
            orderNumber,
            userId,
            customerInfo,
            items,
            totalPrice
        });

        await newOrder.save();

        // Emit real-time notification to admins
        io.emit('new-order', {
            orderNumber,
            customerInfo,
            items,
            totalPrice,
            orderId: newOrder._id
        });

        res.json({ message: 'Order created', order: newOrder });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get orders (Customer sees own, Admin sees all)
app.get('/api/orders', verifyToken, async (req, res) => {
    try {
        let query = {};
        if (req.userRole !== 'admin') {
            query.userId = req.userId;
        }

        const orders = await Order.find(query).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get order by ID
app.get('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update order status (Admin only)
app.put('/api/orders/:id/status', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: Date.now() },
            { new: true }
        );

        // Emit status update to customer
        io.emit('order-status-update', {
            orderId: order._id,
            orderNumber: order.orderNumber,
            status,
            customerInfo: order.customerInfo
        });

        res.json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ============ CHAT ROUTES ============

// Send message
app.post('/api/chat', async (req, res) => {
    try {
        const { orderId, userId, senderName, senderRole, message } = req.body;

        let chat = await Chat.findOne({ orderId });
        if (!chat) {
            chat = new Chat({ orderId, userId, messages: [] });
        }

        chat.messages.push({ senderId: userId, senderName, senderRole, message });
        await chat.save();

        // Emit message to all users
        io.emit('new-message', {
            orderId,
            senderName,
            senderRole,
            message,
            timestamp: new Date()
        });

        res.json({ message: 'Message sent', chat });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get chat by order ID
app.get('/api/chat/:orderId', async (req, res) => {
    try {
        const chat = await Chat.findOne({ orderId: req.params.orderId });
        res.json(chat || { messages: [] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============ REVIEW ROUTES ============

// Add review
app.post('/api/products/:id/reviews', verifyToken, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const user = await User.findById(req.userId);

        await Product.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    reviews: {
                        userId: req.userId,
                        userName: user.fullName,
                        rating,
                        comment
                    }
                }
            },
            { new: true }
        );

        res.json({ message: 'Review added' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ============ COUPON ROUTES ============

// Verify coupon
app.post('/api/coupons/verify', async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code, active: true });

        if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
        if (coupon.expiryDate < Date.now()) return res.status(400).json({ error: 'Coupon expired' });
        if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ error: 'Coupon limit reached' });

        res.json({ discount: coupon.discount });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ============ ADMIN DASHBOARD ROUTES ============

// Dashboard stats
app.get('/api/admin/stats', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const totalCustomers = await User.countDocuments({ role: 'customer' });
        const bestSellers = await Order.aggregate([
            { $unwind: '$items' },
            { $group: { _id: '$items.name', count: { $sum: '$items.quantity' } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            totalCustomers,
            bestSellers
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============ USER ROUTES ============

// Get user profile
app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user profile
app.put('/api/users/:id', verifyToken, async (req, res) => {
    try {
        const { fullName, phone, addresses } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { fullName, phone, addresses },
            { new: true }
        ).select('-password');

        res.json({ message: 'Profile updated', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ============ SOCKET.IO EVENTS ============

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join-admin', () => {
        socket.join('admin');
    });

    socket.on('join-order', (orderId) => {
        socket.join(`order-${orderId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// ============ SERVER START ============

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📊 Database: MongoDB`);
    console.log(`💬 Real-time: Socket.io enabled`);
});

module.exports = app;
