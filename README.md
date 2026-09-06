# ICShop - Premium Ice Cream Store Website

## Overview
ICShop is a fully functional, professional ice cream shop website built with HTML, CSS, and JavaScript. It features a complete e-commerce platform with customer shopping capabilities and an admin panel for managing products, prices, and orders.

## Features

### Customer Features
- **Home Page**: Attractive hero section with call-to-action buttons
- **Product Menu**: Display of all ice cream products with categories
- **Product Filtering**: Filter products by category (Vanilla, Chocolate, Strawberry, Special)
- **Shopping Cart**: Add/remove items, adjust quantities, view total price
- **Cart Management**: 
  - Increase/decrease quantities
  - Remove items
  - Real-time total calculation
  - Cart persistence using localStorage
- **Checkout**: Place orders with order confirmation
- **About Section**: Company information and features
- **Contact Section**: Contact details and information
- **Responsive Design**: Mobile-friendly interface

### Admin Features (Password Protected)
- **Admin Login**: Password: `admin123`
- **Product Management**:
  - View all products
  - Add new products
  - Edit product prices
  - Delete products
  - Manage product images and descriptions
- **Order Management**:
  - View all customer orders
  - Update order status (Pending, Preparing, Ready, Completed)
  - Track order details and totals
- **Product Dashboard**: Easy-to-use interface for managing inventory

## Color Scheme
- **Primary Red**: #ff1744 (Accent and CTAs)
- **Primary Blue**: #0066ff (Secondary accents)
- **Dark Gray**: #1a1a1a (Backgrounds and text)
- **White**: #ffffff (Content backgrounds)

## Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Storage**: Local Storage (Browser-based data persistence)
- **Responsive**: Mobile-first design approach

## Getting Started

### Installation
1. Clone the repository
2. Open `index.html` in a web browser
3. No server setup required - runs entirely in the browser

### Using the Website

#### As a Customer
1. Browse products in the Menu section
2. Filter by category using the filter buttons
3. Click "Add to Cart" to add items
4. Click the cart icon to view your shopping cart
5. Adjust quantities or remove items as needed
6. Click "Checkout" to complete your order

#### As an Admin
1. Click the "Admin" button in the navigation bar
2. Enter the password: `admin123`
3. Manage products:
   - View existing products
   - Add new products with name, price, category, and image URL
   - Edit product prices
   - Delete products
4. Manage orders:
   - View all customer orders
   - Update order status
   - Track order details

## Product Management

### Adding Products
1. Go to Admin Panel → Add Product tab
2. Fill in:
   - Product Name
   - Category (Vanilla, Chocolate, Strawberry, Special)
   - Price (in dollars)
   - Description
   - Image URL
3. Click "Add Product"

### Editing Products
1. Go to Admin Panel → Products tab
2. Click "Edit" on any product
3. Enter new price when prompted
4. Save changes

### Deleting Products
1. Go to Admin Panel → Products tab
2. Click "Delete" on any product
3. Confirm deletion

## Default Products

The store comes with 6 pre-loaded products:

1. **Vanilla Classic** - $4.99
2. **Chocolate Dream** - $5.49
3. **Strawberry Bliss** - $5.49
4. **Mint Chocolate Chip** - $5.99
5. **Cookies & Cream** - $5.99
6. **Caramel Swirl** - $5.99

## Data Persistence

- **Products**: Saved to localStorage as JSON
- **Shopping Cart**: Automatically saved and restored on page reload
- **Orders**: Stored in browser localStorage

## Responsive Design Breakpoints

- **Desktop**: Full layout with multiple columns
- **Tablet (≤768px)**: Adjusted grid and spacing
- **Mobile (≤480px)**: Single column layout, simplified navigation

## Features Highlights

### User Experience
- Smooth animations and transitions
- Toast notifications for actions
- Modal dialogs for cart and admin panel
- Real-time cart updates
- Filter products dynamically

### Security
- Admin panel protected with password
- Input validation for forms
- Safe localStorage data handling

### Performance
- No external dependencies required
- Fast loading times
- Efficient DOM manipulation
- Optimized CSS animations

## Browser Compatibility
- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- Payment gateway integration
- User account system
- Order history for customers
- Email notifications
- Image upload functionality
- Advanced analytics dashboard
- Inventory management
- Discount codes and promotions

## Support

For issues or questions, please contact:
- **Email**: info@icshop.com
- **Phone**: +1 (555) 123-4567

## License

This project is open source and available under the MIT License.

---

**ICShop - Premium Ice Cream Since 2024**