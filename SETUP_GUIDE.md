# 🍦 ICShop - Complete Setup & Deployment Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Local Development Setup](#local-development-setup)
4. [Database Configuration](#database-configuration)
5. [Backend Setup](#backend-setup)
6. [Frontend Setup](#frontend-setup)
7. [Environment Configuration](#environment-configuration)
8. [Running Locally](#running-locally)
9. [Deployment to Production](#deployment-to-production)
10. [Features Overview](#features-overview)
11. [Troubleshooting](#troubleshooting)

---

## 📋 Project Overview

**ICShop** is a full-stack e-commerce platform for a premium ice cream shop with the following architecture:

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla + Socket.io)
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Real-time**: Socket.io for live notifications and chat
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer for product images

### Tech Stack
```
Frontend → Backend API → Database
   ↓          ↓            ↓
HTML/CSS    Node/Express   MongoDB
Socket.io   JWT Auth       Mongoose
```

---

## 🔧 Prerequisites

Install the following on your system:

### Required Software
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** (v4 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - OR use **MongoDB Atlas** (Cloud - Recommended)
- **Git** - [Download](https://git-scm.com/)

### Verify Installation
```bash
node --version      # Should be v14+
npm --version       # Should be v6+
mongod --version    # Should be v4+
```

---

## 💻 Local Development Setup

### 1. Clone or Download Project
```bash
# If using git
git clone <your-repository-url>
cd icshop

# If downloaded as ZIP
unzip icshop.zip
cd icshop
```

### 2. Project Structure
```
icshop/
├── server.js                 # Backend server
├── package.json              # Backend dependencies
├── .env.example              # Environment template
├── seed.js                   # Database seed script
├── index-updated.html        # Frontend (customer/admin)
├── app-updated.js            # Frontend JavaScript
├── styles-updated.css        # Frontend styles
├── uploads/                  # Product images folder
└── README.md                 # Documentation
```

---

## 🗄️ Database Configuration

### Option A: MongoDB Atlas (Cloud - Recommended for Production)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Click "Sign Up"
   - Complete registration

2. **Create Free Cluster**
   - Click "Create a Deployment"
   - Select "M0 Sandbox" (Free tier)
   - Choose your region (closest to your users)
   - Click "Create Deployment"

3. **Set Up Connection**
   - Click "Connect"
   - Choose "Drivers"
   - Copy the connection string
   - Save your username and password securely

4. **Connection String Format**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/icshop?retryWrites=true&w=majority
   ```

### Option B: Local MongoDB (Development)

1. **Install MongoDB**
   ```bash
   # macOS
   brew install mongodb-community
   
   # Windows: Use MongoDB installer
   # Linux: sudo apt-get install mongodb
   ```

2. **Start MongoDB**
   ```bash
   # macOS/Linux
   mongod
   
   # Windows
   # MongoDB should start automatically
   ```

3. **Connection String**
   ```
   mongodb://localhost:27017/icshop
   ```

---

## 🚀 Backend Setup

### Step 1: Install Backend Dependencies

```bash
# Navigate to project directory
cd icshop

# Install all dependencies
npm install
```

This installs:
- `express` - Web server framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `socket.io` - Real-time communication
- `multer` - File uploads
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

### Step 2: Configure Environment Variables

1. **Copy the example file**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file** with your details:
   ```env
   # Server
   PORT=5000
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/icshop

   # Security
   JWT_SECRET=your-super-secret-key-change-this-in-production

   # Frontend URL
   CLIENT_URL=http://localhost:3000

   # Admin Credentials (for initial setup)
   ADMIN_EMAIL=admin@icshop.com
   ADMIN_PASSWORD=admin@123

   # Shop Info
   SHOP_PHONE=+92-328-6324052
   SHOP_EMAIL=gullsafs@gmail.com
   SHOP_ADDRESS=Ghazi or DHA road PCHS 1-F2
   ```

⚠️ **IMPORTANT**: Keep `.env` file secure and never commit it to Git!

### Step 3: Seed Database (Initial Data)

```bash
# Run seed script to populate initial data
npm run seed
```

This creates:
- ✅ Admin user (Email: admin@icshop.com, Password: admin@123)
- ✅ 8 sample products
- ✅ 3 sample coupons

**Output:**
```
✅ Admin user created
   Email: admin@icshop.com
   Password: admin@123
✅ 8 sample products added
✅ 3 sample coupons added
✨ Database seeded successfully!
```

---

## 🎨 Frontend Setup

### Step 1: Replace Frontend Files

Replace your existing files with updated versions:

```
Old → New (Updated)
index.html → index-updated.html
app.js → app-updated.js
styles.css → styles-updated.css
```

Or simply rename:
```bash
mv index.html index-old.html
mv index-updated.html index.html
mv app.js app-old.js
mv app-updated.js app.js
mv styles.css styles-old.css
mv styles-updated.css styles.css
```

### Step 2: Configure API URL

In `app-updated.js`, update the API URL (line 4):

```javascript
// For Local Development
const API_URL = 'http://localhost:5000/api';

// For Production (change when deployed)
const API_URL = 'https://your-backend-domain.com/api';
```

### Step 3: Frontend File Organization

```
/frontend/
├── index.html           (main HTML)
├── app-updated.js       (JavaScript logic)
├── styles-updated.css   (styling)
└── /images/             (product images - optional)
```

---

## ▶️ Running Locally

### Terminal 1: Start Backend Server

```bash
# Navigate to project directory
cd icshop

# Start development server with auto-reload
npm run dev

# OR start production server
npm start
```

**Expected Output:**
```
✅ Server running on port 5000
📊 Database: MongoDB
💬 Real-time: Socket.io enabled
```

### Terminal 2: Start Frontend

```bash
# Simple option: Use Live Server (VS Code Extension)
# Right-click index.html → "Open with Live Server"

# OR using Python (if installed)
python -m http.server 8000

# OR using Node.js
npx http-server
```

**Frontend Access:**
```
http://localhost:8000  (or your live server port)
```

### Test the Application

1. **Visit**: `http://localhost:8000`
2. **Register as Customer**:
   - Click "Login" → "Register"
   - Fill in details
   - Create account

3. **Login as Admin**:
   - Click "Admin" button
   - Email: `admin@icshop.com`
   - Password: `admin@123`

---

## 📤 Deployment to Production

### Option 1: Deploy Backend to Railway.app (Recommended)

#### Steps:

1. **Create Railway Account**
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Connect Repository**
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Authorize and select your repository

3. **Configure Environment Variables**
   - Click "Variables"
   - Add all `.env` variables:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `CLIENT_URL`
     - etc.

4. **Deploy**
   - Railway auto-deploys on git push
   - Get your backend URL (e.g., `https://icshop-backend.up.railway.app`)

### Option 2: Deploy Backend to Render.com

1. Create account at [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Set environment variables
5. Deploy

### Option 3: Deploy Backend to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create icshop-backend

# Add MongoDB Atlas URI
heroku config:set MONGODB_URI=your-mongodb-uri

# Deploy
git push heroku main
```

### Deploy Frontend to Vercel

1. **Prepare Frontend**
   - Update `API_URL` in app.js with your backend URL
   - Commit changes

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Or Use Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Import Git repository
   - Configure environment variables
   - Deploy

---

## ✨ Features Overview

### 1. **Customer Features**
- ✅ User registration and login
- ✅ Browse products with filters
- ✅ Add to cart and wishlist
- ✅ Search products
- ✅ Apply discount coupons
- ✅ Place orders with delivery details
- ✅ Track order status
- ✅ View order history
- ✅ Submit product reviews
- ✅ Live chat with support

### 2. **Admin Features**
- ✅ Secure admin login
- ✅ Add/edit/delete products
- ✅ Upload product images
- ✅ Manage product stock
- ✅ Manage tags (featured, bestseller, new)
- ✅ View all orders
- ✅ Update order status
- ✅ Real-time order notifications
- ✅ Create discount coupons
- ✅ Dashboard with statistics
- ✅ View best-selling products
- ✅ Customer support chat
- ✅ Reports and analytics

### 3. **E-Commerce Features**
- ✅ Product filtering (category, price, rating)
- ✅ Product search
- ✅ Related products
- ✅ Customer reviews and ratings
- ✅ Discount coupons
- ✅ Promotional banners
- ✅ Shopping cart management
- ✅ Multiple payment options (ready for integration)

### 4. **Real-Time Features**
- ✅ Live chat between customer and admin
- ✅ Real-time order notifications
- ✅ Order status updates
- ✅ Instant message delivery

### 5. **Technical Features**
- ✅ Secure JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Protected admin routes
- ✅ Database optimization
- ✅ Responsive design
- ✅ Production-ready code

---

## 🔐 Security Best Practices

### Essential Security Steps

1. **Change Admin Password**
   ```bash
   # After first login, change password immediately
   ```

2. **Update JWT Secret**
   - In `.env`, change `JWT_SECRET` to a strong random string
   - Generate: `openssl rand -base64 32`

3. **Enable HTTPS**
   - Use SSL certificates
   - Heroku/Railway provide free HTTPS

4. **MongoDB Security**
   - Enable IP Whitelist in MongoDB Atlas
   - Use strong passwords

5. **Environment Variables**
   - Never commit `.env` to Git
   - Use `.gitignore`:
     ```
     .env
     node_modules/
     uploads/
     ```

6. **CORS Configuration**
   - Only allow your frontend URL
   - Update `CLIENT_URL` in backend

---

## 🐛 Troubleshooting

### Problem: "Cannot connect to MongoDB"

**Solution:**
```bash
# 1. Check MongoDB is running
mongod

# 2. Verify connection string in .env
# 3. If using Atlas, check IP whitelist
# 4. Ensure credentials are correct
```

### Problem: "Socket.io connection failed"

**Solution:**
```bash
# 1. Check backend server is running (npm run dev)
# 2. Verify API_URL in app.js matches backend
# 3. Check CORS configuration in server.js
# 4. Look at browser console for errors
```

### Problem: "Admin login not working"

**Solution:**
```bash
# 1. Verify admin was created (npm run seed)
# 2. Check email and password are correct
# 3. Ensure admin role is set in database
# 4. Check JWT_SECRET in .env
```

### Problem: "Product images not uploading"

**Solution:**
```bash
# 1. Check /uploads folder exists
# 2. Verify permissions: chmod 755 uploads/
# 3. Check file size (max 5MB in server.js)
# 4. Ensure Content-Type headers are correct
```

### Problem: "Cart not persisting on refresh"

**Solution:**
```javascript
// This is normal - cart is stored in localStorage
// To make it persist to server, add after login:
// POST /api/carts with cart items
```

---

## 📞 Support & Contact

**Shop Details:**
- 📱 Phone: +923286324052
- 📧 Email: gullsafs@gmail.com
- 📍 Address: Ghazi or DHA road PCHS 1-F2

**Admin Credentials (Change After First Login):**
- Email: admin@icshop.com
- Password: admin@123

---

## 🔄 Regular Maintenance

### Weekly Tasks
- ✅ Check order status updates
- ✅ Review customer reviews
- ✅ Monitor server logs

### Monthly Tasks
- ✅ Backup database
- ✅ Update products
- ✅ Review analytics
- ✅ Update coupons

### Security Tasks
- ✅ Monitor login attempts
- ✅ Check admin access logs
- ✅ Update dependencies: `npm audit fix`

---

## 📚 Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Socket.io Tutorial](https://socket.io/docs/)
- [JWT Explained](https://jwt.io/)

---

**🎉 Congratulations! Your ICShop is ready to serve premium ice cream! 🍦**
