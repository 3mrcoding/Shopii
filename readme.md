# Express.js E-commerce Application README.md

## Table of Contents

1. [About](#about)

2. [Features](#features)

3. [Requirements](#requirements)

4. [Installation](#installation)

5. [Usage](#usage)

6. [API Documentation](#api-documentation)

7. [Error Handling](#error-handling)

8. [Environment Variables](#environment-variables)

9. [Database Setup](#database-setup)

10. [Server Setup](#server-setup)

11. [Contributing](#contributing)

12. [License](#license)

## About

This is an Express.js-based e-commerce application for an online store. It includes features for user authentication, product management, order processing, and cart functionality.

## Features

```
- User authentication and authorization

- Product listing and management

- Order processing and history

- Cart functionality for users

- Email notifications for password resets

- Error handling and logging
```

## Requirements

```
- Node.js (14.x or higher)

- Express.js (4.x or higher)

- Mongoose (6.x or higher)

- Nodemailer (latest)

- dotenv (latest)
```

## Installation

1. Clone the repository:

```
   git clone https://github.com/yourusername/express-ecommerce.git
```

2. Install dependencies:

```
   npm install
```

3. Create a .env file in the root directory:

```
   touch .env
```

4. Add your environment variables to .env file:

```
   PORT=3000
   DATABASE_URL=mongodb://localhost:27017/ecommerce
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USERNAME=your-email@gmail.com
   EMAIL_PASSWORD=your-email-password
```

## Usage

1. Start the server:

```
   npm start
```

2. Access the API endpoints:

```
   http://localhost:3000/api/users
   http://localhost:3000/api/auth/login
   http://localhost:3000/api/products
   http://localhost:3000/api/reviews
   http://localhost:3000/api/cart
   http://localhost:3000/api/order
```

# API Documentation

The API documentation is available at /api-docs when the server is running. It is generated using Swagger.

## Table of Contents

1. [User API](#user-api)
2. [Product API](#product-api)
3. [Review API](#review-api)
4. [Cart API](#cart-api)
5. [Order API](#order-api)
6. [Authentication API](#authentication-api)

## User API

### GET /api/users

```
- **Description**: Retrieves all users (admin only)
- **Method**: GET
- **Auth Required**: Yes (admin)
- **Response**: json {
        "status": "success",
        "data": [ { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "admin" }]
    }
```

### GET /api/users/id/:id

```
- **Description**: Retrieves user with it's ID (admin only)
- **Method**: GET
- **Path Parameters**:
  - `id`: The ID of the user to retrieve
- **Auth Required**: Yes (admin)
- **Response**: json {
        "status": "success",
        "data": { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "admin" }
    }
```

### DELETE /api/users/id/:id

```
- **Description**: Delete user with it's ID (admin only)
- **Method**: DELETE
- **Path Parameters**:
  - `id`: The ID of the user to retrieve
- **Auth Required**: Yes (admin)
- **Response**: HTTP Response(204)
```

### PATCH /api/users/forgetpassword

```
- **Description**: Generate rest password link
- **Method**: PATCH
- **Auth Required**: No
- **Request Body**: json { email: "email@example.com" }
- **Response**: json { status: 'success', message: 'Token sent to email!'}
```

### PATCH /api/users/resetpassword/:token

```
- **Description**: Reset Password link
- **Method**: PATCH
- **Path Parameters**:
  - `token`: The Auto-Generated reset token
- **Auth Required**: No
- **Request Body**: json { "password": "securepassword", "passwordConfirm": "securepassword" }
- **Response**: json { status: 'success', token'}
```

### GET /api/users/me

```
- **Description**: Get user profile information (logged-in user)
- **Method**: GET
- **Auth Required**: Yes (logged-in user)
- **Response**: json { "status": "success", "data": { "id": 1, "name": "Jane Doe", "email": "jane@example.com", role:"user" } }
```

### PATCH /api/users/me

```
- **Description**: Updates user profile information (logged-in user)
- **Method**: PATCH
- **Auth Required**: Yes (logged-in user)
- **Request Body**: json { "name": "Jane Doe", "email": "jane@example.com" }
- **Response**: json { "status": "success", "data": { "id": 1, "name": "Jane Doe", "email": "jane@example.com" } }
```

### PATCH /api/users/me/updatePass

```
- **Description**: Updates user Password (logged-in user)
- **Method**: PATCH
- **Auth Required**: Yes (logged-in user)
- **Request Body**: json { "name": "Jane Doe", "email": "jane@example.com" }
- **Response**: json {
    Status: 'Success',
    message: 'Your password changed successfully, please login!'
  }
```

### DELETE /api/users/me

```
- **Description**: DELETE user Profile (logged-in user)
- **Method**: DELETE
- **Auth Required**: Yes (logged-in user)
- **Response**: json {
    Status: 'Success',
    data: "NULL"
  }
```

## Authorization API

### POST /api/auth/login

```
- **Description**: Logs in an existing user
- **Method**: POST
- **Request Body**: json { "email": "john@example.com", "password": "securePassword" }
- **Response**:json { "status": "success", "data": { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." } }
```

### POST /api/auth/register

```
- **Description**: Registers a new user
- **Method**: POST
- **Request Body**:json {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securePassword",
    "PasswordConfirm": "securePassword"
    }
    - **Response**: json {
    "status": "success",
    "data": { "id": 1, "name": "Jane Doe", "email": "jane@example.com", "role": "user" }
    }
```

## Product API

### GET /api/products

```
- **Description**: Retrieves all products
- **Method**: GET
- **Response**: json {
    "status": "success",
    "data": [ { "id": 1, "name": "Product A", "price": 19.99, "description": "This is product A" }, { "id": 2, "name": "Product B", "price": 29.99, "description": "This is product B" } ]
}
```

### POST /api/products

```
- **Description**: Creates a new product (admin only)
- **Method**: POST
- **Auth Required**: Yes (admin)
- **Request Body**: json { "name": "New Product", "price": 29.99, "description": "This is a new product" }
- **Response**:json { "status": "success", "data": { "id": 3, "name": "New Product", "price": 29.99, "description": "This is a new product" } }
```

### GET /api/products/:id

```
- **Description**: Retrieves specific product by ID
- **Method**: GET
- **Path Parameters**:
  - `id`: The ID of the product to retrieve
- **Response**: json {
    "status": "success",
    "data": { "id": 1, "name": "Product A", "price": 19.99, "description": "This is product A" }
}
```

### POST /api/products/:id

```
- **Description**: Add Product to User's Cart
- **Method**: POST
- **Path Parameters**:
  - `id`: The ID of the product to add
- **Response**: json { status: 'Success', message: 'Product Added!' }
```

### PATCH /api/products/:id

```
- **Description**: Updates existing product (admin only)
- **Method**: PATCH
- **Auth Required**: Yes (admin)
- **Path Parameters**:
  - `id`: The ID of the product to update
- **Request Body**: json { "name": "Updated Product", "price": 29.99, "description": "This is an updated product" }
- **Response**: json { "status": "success", "data": { "id": 1, "name": "Updated Product", "price": 29.99, "description": "This is an updated product" } }
```

### DELETE /api/products/:id

```
- **Description**: Deletes product (admin only)
- **Method**: DELETE
- **Auth Required**: Yes (admin)
- **Path Parameters**:
  - `id`: The ID of the product to delete
- **Response**: json { "status": "success", "message": "Product deleted successfully" }
```

## Review API

### GET /api/products/:id/reviews

```
- **Description**: Retrieves all reviews
- **Method**: GET
- **Path Parameters**:
  - `id`: The ID of the product to retrive reviews for
- **Response**: json {
    "status": "success",
    "data": [ {"review": "Great product!" }, {"review": "Good product, but not perfect" } ]
}
```

### POST /api/products/:id/reviews

```
- **Description**: Creates new review (logged-in user)
- **Method**: POST
- **Path Parameters**:
  - `id`: The ID of the product to add review to
- **Auth Required**: Yes (logged-in user)
- **Request Body**: json { "productId": 1, "rating": 5, "review": "Excellent product!" }
- **Response**: json { "status": "success", "data": {"review": "Great product!" } }
```

## Cart API

### GET /api/cart

```
- **Description**: Retrieves cart items (logged-in user)
- **Method**: GET
- **Auth Required**: Yes (logged-in user)
- **Response**: json { "status": "success", "data": [ { "id": 1, "productId": 1, "quantity": 2 }, { "id": 2, "productId": 2, "quantity": 1 } ] }
```

### PATCH /api/cart/:id

```
- **Description**: Modify cart item quantity (logged-in user)
- **Method**: PATCH
- **Path Parameters**:
  - `id`: The ID of the product
- **Auth Required**: Yes (logged-in user)
- **Response**: json {status: 'Success', message: `Product Quantity Updated to ${newQuantity}`}
```

### DELETE /api/cart/:id

```
- **Description**: Delete cart item (logged-in user)
- **Method**: DELETE
- **Path Parameters**:
  - `id`: The ID of the product
- **Auth Required**: Yes (logged-in user)
- **Response**: json {status: 'Success', message: 'Product Deleted!'}
```

## Order API

### GET /api/order

```
- **Description**: Retrieves order history (logged-in user)
- **Method**: GET
- **Auth Required**: Yes (logged-in user)
- **Response**: json { "status": "success", "data": [ { "id": 1, "userId": 1, "date": "2023-02-20T14:30:00.000Z", "total": 99.98, "status": "pending" }, { "id": 2, "userId": 1, "date": "2023-02-21T10:45:00.000Z", "total": 49.99, "status": "shipped" } ] }
```

### POST /api/order

```
- **Description**: Creates new order (logged-in user)
- **Method**: POST
- **Auth Required**: Yes (logged-in user)
- **Request Body**: json { "cartId": 1, "shippingAddress": "123 Main St", "paymentMethod": "creditCard" }
- **Response**: json { "status": "success", "data": { "id": 3, "userId": 1, "date": "2023-02-22T12:00:00.000Z", "total": 99.98, "status": "pending" } }
```

### GET /api/order/all

```
- **Description**: Retrieves all orders history for all users (Admin)
- **Method**: GET
- **Auth Required**: Yes (Admin)
- **Response**: json { "status": "success", "data": [ { "id": 1, "userId": 1, "date": "2023-02-20T14:30:00.000Z", "total": 99.98, "status": "pending" }, { "id": 2, "userId": 1, "date": "2023-02-21T10:45:00.000Z", "total": 49.99, "status": "shipped" }, ...] }
```

### PATCH /api/order/:id

```
- **Description**: Modify Order Status (Admin)
- **Method**: PATCH
- **Path Parameters**:
  - `id`: The ID of the Order
- **Auth Required**: Yes (Admin)
- **Request Body**: json { "shippingTracking": "Shipped", "orderStatus": "Cancelled" }
- **Response**: json { { status: 'Success', orderStatus: "Cancelled", shippingTracking: "Shipped"} }
```

## Error Handling

The application uses custom AppError class for error handling

- **404 Not Found**: Returned for unknown routes
- **401 Unauthorized**: Returned for unauthorized requests
- **500 Internal Server Error**: Returned for server-side```

## Environment Variables

The application uses environment variables for sensitive information:

```
- PORT - Server port number

- DATABASE_URL - MongoDB connection string

- EMAIL_HOST - Email server host

- EMAIL_PORT - Email server port

- EMAIL_USERNAME - Email address for sending emails

- EMAIL_PASSWORD - Password for email server
```

## Database Setup

1. Install MongoDB Community Server if not already installed.

2) Create a new database named "ecommerce" in MongoDB.

3. Ensure that the .env file contains correct database connection details.

## Server Setup

1. Install Node.js (14.x or higher) if not already installed.

2) Install dependencies:

```
   npm install express mongoose nodemailer dotenv
```

3. Start the server:

```
   npm start
```
