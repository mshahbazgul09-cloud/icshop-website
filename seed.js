const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/icshop', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Schemas
const userSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: String,
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    description: String,
    images: [String],
    stock: { type: Number, default: 100 },
    rating: { type: Number, default: 0 },
    reviews: [],
    tags: [String],
    createdAt: { type: Date, default: Date.now }
});

const couponSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },
    discount: Number,
    maxUses: Number,
    usedCount: { type: Number, default: 0 },
    expiryDate: Date,
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Coupon = mongoose.model('Coupon', couponSchema);

// Sample data
const sampleProducts = [
    {
        name: 'Vanilla Classic',
        category: 'vanilla',
        price: 4.99,
        description: 'Rich and creamy vanilla ice cream made with real vanilla beans',
        images: ['https://via.placeholder.com/300?text=Vanilla+Classic'],
        stock: 100,
        rating: 4.5,
        tags: ['featured']
    },
    {
        name: 'Chocolate Dream',
        category: 'chocolate',
        price: 5.49,
        description: 'Decadent dark chocolate ice cream for chocolate lovers',
        images: ['https://via.placeholder.com/300?text=Chocolate+Dream'],
        stock: 100,
        rating: 4.7,
        tags: ['bestseller']
    },
    {
        name: 'Strawberry Bliss',
        category: 'strawberry',
        price: 5.49,
        description: 'Fresh strawberry ice cream made with real strawberries',
        images: ['https://via.placeholder.com/300?text=Strawberry+Bliss'],
        stock: 100,
        rating: 4.6,
        tags: ['featured']
    },
    {
        name: 'Mint Chocolate Chip',
        category: 'special',
        price: 5.99,
        description: 'Cool mint ice cream with rich chocolate chips',
        images: ['https://via.placeholder.com/300?text=Mint+Chocolate+Chip'],
        stock: 100,
        rating: 4.8,
        tags: ['bestseller']
    },
    {
        name: 'Cookies & Cream',
        category: 'special',
        price: 5.99,
        description: 'Creamy vanilla ice cream mixed with cookie pieces',
        images: ['https://via.placeholder.com/300?text=Cookies+Cream'],
        stock: 100,
        rating: 4.9,
        tags: ['bestseller']
    },
    {
        name: 'Caramel Swirl',
        category: 'special',
        price: 5.99,
        description: 'Smooth caramel swirled through creamy vanilla',
        images: ['https://via.placeholder.com/300?text=Caramel+Swirl'],
        stock: 100,
        rating: 4.7,
        tags: ['new-arrival']
    },
    {
        name: 'Pistachio Paradise',
        category: 'special',
        price: 6.49,
        description: 'Nutty pistachio flavor with a smooth, creamy texture',
        images: ['https://via.placeholder.com/300?text=Pistachio+Paradise'],
        stock: 80,
        rating: 4.5,
        tags: ['new-arrival']
    },
    {
        name: 'Bubblegum Blast',
        category: 'special',
        price: 5.49,
        description: 'Fun and colorful bubblegum ice cream for kids and kids at heart',
        images: ['https://via.placeholder.com/300?text=Bubblegum+Blast'],
        stock: 90,
        rating: 4.3,
        tags: ['featured']
    }
];

const sampleCoupons = [
    {
        code: 'WELCOME10',
        discount: 10,
        maxUses: 100,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        active: true
    },
    {
        code: 'SAVE20',
        discount: 20,
        maxUses: 50,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        active: true
    },
    {
        code: 'SUMMER15',
        discount: 15,
        maxUses: 75,
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
        active: true
    }
];

// Seed data
async function seedDatabase() {
    try {
        console.log('🌱 Starting database seed...');

        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});
        await Coupon.deleteMany({});
        console.log('✨ Cleared existing data');

        // Create admin user
        const adminPassword = await bcrypt.hash('admin@123', 10);
        const admin = new User({
            fullName: 'ICShop Admin',
            email: process.env.ADMIN_EMAIL || 'admin@icshop.com',
            password: adminPassword,
            phone: process.env.SHOP_PHONE || '+92-328-6324052',
            role: 'admin'
        });
        await admin.save();
        console.log('✅ Admin user created');
        console.log(`   Email: ${admin.email}`);
        console.log(`   Password: admin@123`);

        // Add sample products
        await Product.insertMany(sampleProducts);
        console.log(`✅ ${sampleProducts.length} sample products added`);

        // Add sample coupons
        await Coupon.insertMany(sampleCoupons);
        console.log(`✅ ${sampleCoupons.length} sample coupons added`);

        console.log('\n✨ Database seeded successfully!');
        console.log('\n📝 Admin Login Details:');
        console.log('   Email:', process.env.ADMIN_EMAIL || 'admin@icshop.com');
        console.log('   Password: admin@123');
        console.log('\n💡 Remember to change the admin password in production!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
}

seedDatabase();
