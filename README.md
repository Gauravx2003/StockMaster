# 📦 StockMaster

A comprehensive **Inventory Management System** built with modern web technologies to help businesses efficiently manage their stock, warehouses, products, and transactions.

## 🎥 Demo Video

**Watch the full demo:** [StockMaster Demo Video](https://drive.google.com/drive/folders/1ApqhrZiyJXQ-EGWrHDgBUJDCa-gUXHg1)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [License](#license)

---

## 🌟 Overview

**StockMaster** is a full-stack inventory management solution designed to streamline warehouse operations, track product movements, and provide real-time insights into stock levels. The system supports multi-warehouse management, transaction tracking, and comprehensive reporting.

### Key Highlights

- 🏢 **Multi-Warehouse Management** - Manage multiple warehouses and locations
- 📊 **Real-time Dashboard** - KPIs and analytics at your fingertips
- 🔄 **Transaction Tracking** - Complete audit trail for all stock movements
- 📦 **Product Management** - Comprehensive product catalog with SKU tracking
- 🔐 **Secure Authentication** - JWT-based auth with role-based access control
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🎯 **Pagination Support** - Efficient data handling for large inventories

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login
- Password reset with OTP verification
- JWT-based authentication
- Role-based access control (Admin/Staff)
- Secure session management

### 📦 Product Management
- Create, read, update, and delete products
- SKU-based product tracking
- Product categorization
- Unit of measurement (UOM) support
- Minimum stock level alerts
- Product pricing management
- Active/inactive product status

### 🏢 Warehouse Management
- Multiple warehouse support
- Location-based warehouse organization
- Sub-location management within warehouses
- Warehouse capacity tracking
- Warehouse type classification (Main/Branch)
- Unique shortcode system

### 🔄 Transaction Management
- **Stock In** - Record incoming inventory
- **Stock Out** - Track outgoing inventory
- **Stock Transfer** - Move inventory between warehouses
- **Stock Adjustment** - Adjust inventory for discrepancies
- Transaction status workflow (Draft/Pending/Completed/Cancelled)
- Transaction history and audit trail
- Reference number tracking

### 📊 Dashboard & Analytics
- Real-time KPI metrics
- Stock level monitoring
- Low stock alerts
- Transaction summaries
- Visual charts and graphs (using Recharts)
- Inventory valuation

### 📍 Location Management
- Create and manage locations
- Associate warehouses with locations
- Location-based reporting

### 👤 User Management
- User profile management
- Role assignment
- User activity tracking

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.4
- **Routing:** React Router DOM 7.9.6
- **Styling:** TailwindCSS 4.1.17
- **HTTP Client:** Axios 1.13.2
- **Icons:** Lucide React 0.554.0
- **Charts:** Recharts 3.4.1
- **Date Handling:** date-fns 4.1.0
- **Utilities:** clsx 2.1.1

### Backend
- **Runtime:** Node.js
- **Framework:** Express 5.1.0
- **Database ORM:** Prisma 6.19.0
- **Database:** PostgreSQL
- **Authentication:** JWT (jsonwebtoken 9.0.2)
- **Password Hashing:** bcryptjs 3.0.3
- **Email:** Nodemailer 7.0.10
- **Validation:** Zod 4.1.12
- **Security:** Helmet 8.1.0
- **CORS:** cors 2.8.5
- **Logging:** Morgan 1.10.1
- **Environment:** dotenv 17.2.3

### Development Tools
- **Dev Server:** Nodemon 3.1.11
- **Linting:** ESLint 9.39.1
- **Data Generation:** Faker.js 10.1.0

---

## 📁 Project Structure

```
StockMaster/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── assets/        # Images, fonts, etc.
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React Context (AuthContext)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── layouts/       # Layout components
│   │   ├── pages/         # Page components
│   │   │   ├── auth/      # Login, Signup, Reset Password
│   │   │   ├── dashboard/ # Dashboard pages
│   │   │   ├── products/  # Product management
│   │   │   ├── profile/   # User profile
│   │   │   ├── resources/ # Warehouses, Locations
│   │   │   └── transactions/ # Transaction pages
│   │   ├── router/        # Route configuration
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx        # Main App component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Backend Node.js application
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth & validation middleware
│   ├── prisma/           # Database schema & migrations
│   │   ├── schema.prisma # Database schema
│   │   └── seed.js       # Database seeding
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── index.js          # Server entry point
│   ├── package.json
│   └── APIS              # API documentation
│
└── README.md             # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd StockMaster
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/stockmaster"
   JWT_SECRET="your-secret-key"
   JWT_REFRESH_SECRET="your-refresh-secret"
   EMAIL_HOST="smtp.gmail.com"
   EMAIL_PORT=587
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-app-password"
   PORT=5000
   ```

4. **Setup Database**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # Seed database (optional)
   npx prisma db seed
   ```

5. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```

6. **Configure Frontend Environment**
   
   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on `http://localhost:5000`

2. **Start Frontend Development Server**
   ```bash
   cd client
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Access the Application**
   
   Open your browser and navigate to `http://localhost:5173`

---

## 📚 API Documentation

### Authentication APIs
- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login
- `POST /auth/reset-otp` - Request password reset OTP
- `POST /auth/reset` - Reset password
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

### Product APIs
- `GET /products` - Get all products (with pagination)
- `POST /products` - Create new product
- `GET /products/:id` - Get product by ID
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `GET /products/:id/stock` - Get product stock levels

### Warehouse APIs
- `GET /warehouses` - Get all warehouses
- `POST /warehouses` - Create new warehouse
- `GET /warehouses/:id` - Get warehouse by ID
- `PUT /warehouses/:id` - Update warehouse
- `DELETE /warehouses/:id` - Delete warehouse

### Location APIs
- `GET /locations` - Get all locations
- `POST /locations` - Create new location
- `GET /locations/:id` - Get location by ID
- `PUT /locations/:id` - Update location
- `DELETE /locations/:id` - Delete location

### Transaction APIs
- `POST /transactions/in` - Create stock-in transaction
- `POST /transactions/out` - Create stock-out transaction
- `POST /transactions/transfer` - Create transfer transaction
- `POST /transactions/adjust` - Create adjustment transaction
- `GET /transactions` - Get all transactions (with pagination)
- `GET /transactions/:id` - Get transaction by ID
- `POST /transactions/:id/status` - Update transaction status
- `GET /transactions/history` - Get transaction history (with pagination)

### Dashboard APIs
- `GET /dashboard/kpi` - Get KPI metrics

### User APIs
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user

For detailed API documentation, see [server/APIS](server/APIS)

---

## 🗄️ Database Schema

### Core Models

#### User
- User authentication and profile information
- Role-based access control
- Transaction tracking

#### Product
- SKU-based product identification
- Category and description
- Unit of measurement (UOM)
- Minimum stock levels
- Pricing information
- Active/inactive status

#### Warehouse
- Multi-warehouse support
- Location association
- Type classification (Main/Branch)
- Capacity tracking
- Unique shortcode system

#### Location
- Geographic location management
- Warehouse grouping

#### SubLocation
- Warehouse sub-divisions
- Fine-grained stock placement

#### Stock
- Real-time inventory levels
- Warehouse and product association
- Sub-location tracking

#### Transaction
- Stock movement tracking
- Transaction types (IN/OUT/TRANSFER/ADJUST)
- Status workflow
- Source and target warehouse tracking
- Audit trail

#### TransactionItem
- Line items for transactions
- Product and quantity tracking

#### Ledger
- Complete audit trail
- Balance tracking
- Historical stock movements

For the complete schema, see [server/prisma/schema.prisma](server/prisma/schema.prisma)

---


## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

Created with ❤️ for coding

---




