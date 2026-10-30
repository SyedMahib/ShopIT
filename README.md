# ShopIT

A full-stack e-commerce store for IT and electronics products, built with the MERN stack and TypeScript.

Customers can browse and search products, add them to a cart, check out with cash on delivery, follow their orders and review what they bought. Admins manage orders, products and users from an admin panel.

## Features

**Shopping**
- Product catalogue with search, category/price/rating filters and pagination
- Product pages with image gallery, stock status and customer reviews
- Cart saved in the browser, checkout with shipping details, cash on delivery
- Prices, tax (15%) and shipping ($25, free over $100) are always calculated on the server

**Accounts**
- Register / log in with email and password, or with Google
- Forgot password and reset by email
- Profile with picture upload, password change, wishlist
- Dashboard with order history; cancel an order until it ships
- Email updates when an order is placed, shipped, delivered or cancelled

**Admin panel** (`/admin`)
- Store overview: revenue, orders, products, users, low stock
- Orders: filter by status, move through Processing → Shipped → Delivered, or cancel
- Products: create, edit, delete, with drag-and-drop image uploads
- Users: change role, delete
- Delete product reviews

**Rules the backend enforces**
- Stock is reserved when an order is placed and returned if it is cancelled
- Only customers whose order was delivered can review a product
- Customers can only see their own orders

## Tech stack

| Part | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite, TanStack Router, Redux Toolkit (RTK Query), Tailwind CSS 4 |
| Backend | Node.js, Express 5, TypeScript, Mongoose 9 (MongoDB) |
| Auth | JWT in an httpOnly cookie, Passport (Google OAuth 2.0), bcrypt |
| Services | Cloudinary (images), Nodemailer + SMTP (email) |

## Project structure

```
ShopIT/
├── Backend/
│   ├── app.ts            # Express app and routes
│   ├── config/           # DB connection, Passport, config.env (not in git)
│   ├── controllers/      # Route handlers
│   ├── middlewares/      # Auth, errors, uploads
│   ├── models/           # Mongoose models: User, Product, Order, Wishlist
│   ├── routes/           # API routes (all under /api/v1)
│   ├── seeder/           # Sample product data
│   └── utils/            # Email, Cloudinary, filters, tokens
└── Frontend/
    └── src/
        ├── Pages/        # Route pages (admin/ and Auth/ subfolders)
        ├── components/   # Reusable UI
        ├── Routes/       # TanStack Router setup
        └── store/        # Redux store and RTK Query APIs
```

## Getting started

### Requirements

- Node.js 20 or newer
- MongoDB running locally (or a MongoDB Atlas connection string)
- Optional: a [Cloudinary](https://cloudinary.com) account for image uploads, an SMTP inbox for emails (e.g. [Mailtrap](https://mailtrap.io) for development), and Google OAuth credentials for Google sign-in

### 1. Install

```bash
git clone https://github.com/SyedMahib/ShopIT.git
cd ShopIT
npm install              # backend
cd Frontend && npm install
```

### 2. Configure

Copy the example config and fill in your values:

```bash
cp Backend/config/config.env.example Backend/config/config.env
```

At minimum set `DB_LOCAL_URI` and `JWT_SECRET`. Email, Google sign-in and image uploads only work once their settings are filled in; the rest of the app runs without them.

### 3. Add sample products (optional)

```bash
npm run seeder
```

> **Warning:** this deletes all existing products in the `DB_LOCAL_URI` database before adding the sample ones.

### 4. Run

In two terminals:

```bash
npm run dev              # backend on http://localhost:3000
```

```bash
cd Frontend
npm run dev              # frontend on http://localhost:5173
```

The frontend forwards `/api` requests to the backend, so open **http://localhost:5173**.

### 5. Make yourself an admin

Register an account, then set its role in MongoDB:

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

Log out and in again. **Admin Panel** now appears in the account menu. After that, other admins can be promoted from **Admin Panel → Users**.

## Scripts

| Where | Command | What it does |
|---|---|---|
| root | `npm run dev` | Start the backend with auto-reload |
| root | `npm run build` | Compile the backend to `dist/` |
| root | `npm start` | Run the compiled backend |
| root | `npm run seeder` | Replace products with sample data |
| `Frontend/` | `npm run dev` | Start the frontend dev server |
| `Frontend/` | `npm run build` | Type-check and build the frontend to `Frontend/dist/` |
| `Frontend/` | `npm run lint` | Lint with Oxlint |

## Author

Syed Mahib · [GitHub](https://github.com/SyedMahib)
