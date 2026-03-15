# Full-Stack Account Management System

A premium, production-ready Account Management System built with **React**, **Node.js/Express**, and **Supabase (PostgreSQL)**. This system allows users to securely manage their funds, perform peer-to-peer transfers, and track their transaction history with a high-end, responsive UI.

## ✨ Features

- **User Authentication**: Secure Signup and Login using JWT and password hashing (bcrypt).
- **Initial Balance**: Every new user starts with a ₹10,000 balance.
- **Real-time Balance**: Instant balance updates after every transaction.
- **P2P Transfers**: Securely send money to any registered user via their email address.
- **Transaction History**: Comprehensive account statement showing Credits (Green) and Debits (Red) with "Balance After Transaction" snapshots.
- **Premium UI**: Modern **Glassmorphism** design system with dark mode, smooth transitions, and a mobile-responsive layout.
- **Global Navigation**: Sticky navbar for easy access to Dashboard, Transfer, and Statements.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), React Router, Context API, Axios.
- **Backend**: Node.js, Express.js, Supabase JS Client, JWT, BcryptJS.
- **Database**: Supabase PostgreSQL.
- **Styling**: Vanilla CSS (Custom Glassmorphism Design System).

## 🚀 Getting Started

### 1. Database Setup (Supabase)

1. Create a new project on [Supabase](https://supabase.com/).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Execute the SQL commands found in `backend/config/schema.sql` to create the necessary tables and disable RLS for development.

### 2. Backend Configuration

1. Navigate to the `backend` directory.
2. Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   JWT_SECRET=your_jwt_secret_key
   ```
3. Install dependencies and start the server:
   ```bash
   npm install
   npm start
   ```

### 3. Frontend Configuration

1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the app at `http://localhost:5173`.

## 📁 Project Structure

```text
Full-Stack-Account-Management-System/
├── backend/
│   ├── config/          # Supabase client & DB schema
│   ├── controllers/     # API logic (Auth & Account)
│   ├── middlewares/     # Auth protection
│   ├── routes/          # API endpoints
│   ├── utils/           # Helpers (JWT generation)
│   └── server.js        # Main entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI (Navbar, ProtectedRoute)
│   │   ├── context/     # Auth State (Context API)
│   │   ├── pages/       # View components
│   │   ├── App.jsx      # Routing configuration
│   │   └── index.css    # Premium design system
│   └── vite.config.js   # Proxy configuration
└── README.md
```

## 📊 Database Design

### Users Table
- `id` (UUID PK)
- `name` (Text)
- `email` (Text Unique)
- `password` (Hashed Text)
- `balance` (Numeric, Default: 10000)

### Transactions Table
- `id` (UUID PK)
- `user_id` (UUID FK) - Current user of the entry
- `sender_id` (UUID FK)
- `receiver_id` (UUID FK)
- `amount` (Numeric)
- `transaction_type` (credit/debit)
- `balance_after` (Numeric) - Snapshot for audits

## 📱 Responsiveness
The application is fully optimized for:
- Desktop (Wide-screen tables and grids)
- Tablets (Fluid layouts)
- Mobile (Horizontal scroll for tables, stacked grid actions)
