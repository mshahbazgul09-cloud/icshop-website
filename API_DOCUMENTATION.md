# 🔌 ICShop API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-backend-domain.com/api
```

## Authentication
All admin-protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### Register Customer
**POST** `/auth/register`

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "phone": "+92-300-1234567"
}
```

**Response:**
```json
{
  "message": "User registered",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": "507f1f77bcf86cd799439011"
}
```

---

### Login Customer
**POST** `/auth/login`

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": "507f1f77bcf86cd799439011",
  "role": "customer"
}
```

---

### Admin Login
**POST** `/auth/admin-login`

```json
{
  "email": "admin@icshop.com",
  "password": "admin@123"
}
```

**Response:**
```json
{
  "message": "Admin login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": "507f1f77bcf86cd799439011"
}
```

---

## 🍦 Product Endpoints

### Get All Products
**GET** `/products?category=vanilla&search=classic&sort=price-low`

**Query Parameters:**
- `category` - Filter by category (vanilla, chocolate, strawberry, special)
- `search` - Search by product name
- `sort` - Sort by (price-low, price-high, newest, rating)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Vanilla Classic",
    "category": "vanilla",
    "price": 4.99,
    "description": "Rich and creamy vanilla ice cream",
    "images": ["https://..."],
    "stock": 100,
    "rating": 4.5,
    "reviews": [],
    "tags": ["featured"],
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

---

### Get Single Product
**GET** `/products/:id`

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Vanilla Classic",
  "category": "vanilla",
  "price": 4.99,
  "description": "Rich and creamy vanilla ice cream",
  "images": ["https://..."],
  "stock": 100,
  "rating": 4.5,
  "reviews": [
    {
      "userId": "507f1f77bcf86cd799439012",
      "userName": "John Doe",
      "rating": 5,
      "comment": "Excellent ice cream!",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "tags": ["featured"],
  "relatedProducts": [],
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### Add Product (Admin Only)
**POST** `/products`

**Headers:**
```
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data
```

**Body:**
```
name: "Pistachio Paradise"
category: "special"
price: "6.49"
stock: "80"
description: "Nutty pistachio flavor"
tags: "featured, new-arrival"
images: [file1, file2, file3]
```

**Response:**
```json
{
  "message": "Product added",
  "product": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Pistachio Paradise",
    ...
  }
}
```

---

### Update Product (Admin Only)
**PUT** `/products/:id`

**Headers:**
```
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data
```

**Response:**
```json
{
  "message": "Product updated",
  "product": { ... }
}
```

---

### Delete Product (Admin Only)
**DELETE** `/products/:id`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "message": "Product deleted"
}
```

---

## 📦 Order Endpoints

### Create Order
**POST** `/orders`

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "customerInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+92-300-1234567",
    "address": "123 Main Street",
    "city": "Karachi",
    "deliveryNotes": "Ring doorbell twice"
  },
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "name": "Vanilla Classic",
      "price": 4.99,
      "quantity": 2,
      "image": "https://..."
    }
  ],
  "totalPrice": 9.98
}
```

**Response:**
```json
{
  "message": "Order created",
  "order": {
    "_id": "507f1f77bcf86cd799439020",
    "orderNumber": "ORD-1705329000000",
    "customerInfo": { ... },
    "items": [ ... ],
    "totalPrice": 9.98,
    "status": "Pending",
    "paymentStatus": "Pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Get Orders
**GET** `/orders`

**Headers:**
```
Authorization: Bearer <token>
```

**Note:** Customers see only their orders, admins see all orders

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "orderNumber": "ORD-1705329000000",
    "customerInfo": { ... },
    "items": [ ... ],
    "totalPrice": 9.98,
    "status": "Pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

---

### Get Single Order
**GET** `/orders/:id`

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439020",
  "orderNumber": "ORD-1705329000000",
  "customerInfo": { ... },
  "items": [ ... ],
  "totalPrice": 9.98,
  "status": "Pending",
  "paymentStatus": "Pending",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:35:00Z"
}
```

---

### Update Order Status (Admin Only)
**PUT** `/orders/:id/status`

**Headers:**
```
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Body:**
```json
{
  "status": "Confirmed"
}
```

**Status Options:**
- Pending
- Confirmed
- Preparing
- Out for Delivery
- Delivered
- Cancelled

**Response:**
```json
{
  "message": "Order status updated",
  "order": { ... }
}
```

---

## 💬 Chat Endpoints

### Send Message
**POST** `/chat`

```json
{
  "orderId": "507f1f77bcf86cd799439020",
  "userId": "507f1f77bcf86cd799439011",
  "senderName": "John Doe",
  "senderRole": "customer",
  "message": "When will my order arrive?"
}
```

**Response:**
```json
{
  "message": "Message sent",
  "chat": {
    "_id": "507f1f77bcf86cd799439021",
    "orderId": "507f1f77bcf86cd799439020",
    "messages": [
      {
        "senderId": "507f1f77bcf86cd799439011",
        "senderName": "John Doe",
        "senderRole": "customer",
        "message": "When will my order arrive?",
        "timestamp": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

---

### Get Chat History
**GET** `/chat/:orderId`

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439021",
  "orderId": "507f1f77bcf86cd799439020",
  "messages": [ ... ]
}
```

---

## ⭐ Review Endpoints

### Add Review
**POST** `/products/:id/reviews`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "rating": 5,
  "comment": "Amazing ice cream! Highly recommended!"
}
```

**Response:**
```json
{
  "message": "Review added"
}
```

---

## 🎟️ Coupon Endpoints

### Verify Coupon
**POST** `/coupons/verify`

```json
{
  "code": "WELCOME10"
}
```

**Response:**
```json
{
  "discount": 10
}
```

**Errors:**
```json
{
  "error": "Coupon not found"
}
```

---

## 📊 Admin Dashboard Endpoints

### Get Statistics (Admin Only)
**GET** `/admin/stats`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "totalOrders": 45,
  "totalRevenue": 450.25,
  "totalCustomers": 32,
  "bestSellers": [
    {
      "_id": "Vanilla Classic",
      "count": 85
    },
    {
      "_id": "Chocolate Dream",
      "count": 72
    }
  ]
}
```

---

## 👤 User Endpoints

### Get User Profile
**GET** `/users/:id`

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+92-300-1234567",
  "role": "customer",
  "addresses": [
    {
      "label": "Home",
      "street": "123 Main Street",
      "city": "Karachi",
      "country": "Pakistan",
      "postalCode": "75500",
      "isDefault": true
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### Update User Profile
**PUT** `/users/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "fullName": "John Doe",
  "phone": "+92-300-9876543",
  "addresses": [
    {
      "label": "Home",
      "street": "123 Main Street",
      "city": "Karachi",
      "country": "Pakistan",
      "postalCode": "75500",
      "isDefault": true
    }
  ]
}
```

**Response:**
```json
{
  "message": "Profile updated",
  "user": { ... }
}
```

---

## 🔄 WebSocket Events (Socket.io)

### Server to Client Events

**new-order** - New order received
```javascript
socket.on('new-order', (order) => {
  console.log('New order from:', order.customerInfo.fullName);
});
```

**order-status-update** - Order status changed
```javascript
socket.on('order-status-update', (data) => {
  console.log(`Order ${data.orderNumber}: ${data.status}`);
});
```

**new-message** - New chat message
```javascript
socket.on('new-message', (data) => {
  console.log(`Message from ${data.senderName}: ${data.message}`);
});
```

### Client to Server Events

**join-admin** - Admin joins notification room
```javascript
socket.emit('join-admin');
```

**join-order** - Customer joins order chat room
```javascript
socket.emit('join-order', orderId);
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden (Admin only)
- `404` - Not Found
- `500` - Server Error

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding:

```bash
npm install express-rate-limit
```

---

## Testing API with Postman

1. Import collection from API endpoints above
2. Set environment variable: `{{API_URL}}`
3. Set auth header: `Authorization: Bearer {{token}}`
4. Test endpoints in sequence

---

## Pagination (Future Enhancement)

```javascript
// Add to future implementations
GET /products?page=1&limit=10
GET /orders?page=1&limit=20
```

---

## API Response Times (Target)

- Products: < 100ms
- Orders: < 200ms
- Chat: < 50ms (real-time)
- Admin stats: < 300ms

---

**Last Updated:** January 15, 2024
**API Version:** 1.0
