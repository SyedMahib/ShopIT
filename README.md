# ShopIT

A full-stack e-commerce store for IT and electronics products, built with the MERN stack and TypeScript.

Customers can browse and search products, add them to a cart, check out with cash on delivery or a card (Stripe), follow their orders and review what they bought. Admins manage orders, products and users from an admin panel.

## Features

**Shopping**
- Product catalogue with search, category/price/rating filters and pagination
- Product pages with image gallery, stock status and customer reviews
- Cart saved in the browser, checkout with shipping details, cash on delivery or card payment through Stripe Checkout (refunded automatically when a paid order is cancelled)
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
| Services | Stripe (card payments), Cloudinary (images), Nodemailer + SMTP (email) |

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

At minimum set `DB_LOCAL_URI` and `JWT_SECRET`. Email, Google sign-in, card payments and image uploads only work once their settings are filled in; the rest of the app runs without them.

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

**Card payments:** set `STRIPE_SECRET_KEY` to your Stripe test key, then forward webhooks to the backend with the [Stripe CLI](https://docs.stripe.com/stripe-cli) in a third terminal:

```bash
stripe listen --forward-to localhost:3000/api/v1/payment/webhook \
  --events checkout.session.completed,checkout.session.async_payment_succeeded,checkout.session.expired
```

Put the `whsec_...` secret it prints into `STRIPE_WEBHOOK_SECRET` and restart the backend. Pay with the test card `4242 4242 4242 4242`, any future expiry date and any CVC. Unpaid card orders are cancelled, and their stock released, when the Stripe checkout page expires after an hour.

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

## Production

With `NODE_ENV=production` the backend also serves the built frontend from `Frontend/dist/`, so the whole shop runs on one domain (set `FRONTEND_URL` and `BACKEND_URL` to that same URL). Production mode also:

- marks the login cookie `Secure` (HTTPS only) and trusts one reverse proxy in front of the app
- hides internal error details from responses (they are logged instead)
- uses `DB_URI` instead of `DB_LOCAL_URI`

Always on: security headers (Helmet), and rate limits on login, register and password reset (10 failed attempts per 15 minutes) and on forgot password and the contact form (5 per hour).

### Deploy to Render

[`render.yaml`](render.yaml) describes the whole service. In the Render dashboard choose **New → Blueprint**, pick this repository and fill in the values it asks for (`JWT_SECRET` is generated for you). `FRONTEND_URL` and `BACKEND_URL` are both the service URL, e.g. `https://shopit.onrender.com`.

- **Database:** a MongoDB Atlas cluster; allow access from anywhere (`0.0.0.0/0`), since Render's free plan has no fixed IP. Load sample products with `DB_LOCAL_URI="<atlas uri>" npm run seeder`.
- **Email:** Render's free plan blocks SMTP ports 25, 465 and 587, so use a provider that accepts port 2525 (e.g. Brevo).
- **Google sign-in:** add `https://<your-app>.onrender.com/api/v1/auth/google/callback` as an authorized redirect URI.
- **Stripe:** add a webhook endpoint `https://<your-app>.onrender.com/api/v1/payment/webhook` with the three `checkout.session.*` events and use its signing secret.
- The free plan sleeps after 15 minutes without traffic (the first visit then takes about a minute). An uptime monitor pinging `/api/health` every 10 minutes keeps it awake.

## Author

Syed Mahib · [GitHub](https://github.com/SyedMahib)
