# 💄 Glamour Salon — Full-Stack MERN Booking Platform

A complete, production-ready **Salon Management & Booking Web Application** built with the MERN stack. Features a luxury design system, multi-step booking wizard, admin dashboard, real-time slot availability, and email confirmations.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js v18+
- MongoDB (local) or MongoDB Atlas account
- npm

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

```bash
# Server
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI and other values

# Client  
cp client/.env.example client/.env
# Edit client/.env (defaults work for local dev)
```

### 3. Seed the Database

```bash
cd server
npm run seed
```

This creates:
- 1 Admin user (`admin@glamoursalon.com` / `Admin@1234`)
- 10 services across 6 categories
- 4 packages with comparative pricing
- 5 stylist profiles
- 8 pre-approved testimonials

### 4. Start the Application

Open **two terminals**:

```bash
# Terminal 1 — Backend API
cd server
npm run dev
# Runs on http://localhost:5000

# Terminal 2 — Frontend
cd client
npm run dev
# Runs on http://localhost:5173
```

### 5. Access the Application

| URL | Description |
|-----|-------------|
| `http://localhost:5173` | Public website |
| `http://localhost:5173/admin` | Admin dashboard |
| `http://localhost:5000/api/health` | API health check |

---

## 🔐 Admin Credentials (after seeding)

| Field | Value |
|-------|-------|
| Email | `admin@glamoursalon.com` |
| Password | `Admin@1234` |

---

## 📁 Project Structure

```
salon/
├── client/                    # React 18 + Vite frontend
│   ├── src/
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # AuthContext
│   │   ├── pages/             # Public pages (7)
│   │   └── utils/             # api.js, helpers.js
│   └── .env.example
│
└── server/                    # Express + Node.js API
    ├── config/                # db.js, cloudinary.js
    ├── controllers/           # Business logic (6 modules)
    ├── middleware/            # auth, errorHandler, upload
    ├── models/                # Mongoose schemas (6)
    ├── routes/                # Express routers (6)
    ├── utils/                 # emailService, slotGenerator
    ├── seed.js                # Database seed script
    ├── server.js              # Entry point
    └── .env.example
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register client |
| POST | `/api/auth/login` | Client login |
| POST | `/api/auth/admin/login` | Admin login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current user |

### Services
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/services` | Public |
| GET | `/api/services/:id` | Public |
| POST | `/api/services` | Admin |
| PUT | `/api/services/:id` | Admin |
| DELETE | `/api/services/:id` | Admin |

### Packages
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/packages` | Public |
| POST | `/api/packages` | Admin |
| PUT | `/api/packages/:id` | Admin |
| DELETE | `/api/packages/:id` | Admin |

### Bookings
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/bookings` | Public (guest or auth) |
| GET | `/api/bookings/availability?date=&stylistId=` | Public |
| GET | `/api/bookings/user/:userId` | Authenticated |
| GET | `/api/bookings/admin` | Admin |
| GET | `/api/bookings/stats` | Admin |
| PUT | `/api/bookings/:id/status` | Admin |

### Stylists
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/stylists` | Public |
| GET | `/api/stylists/:id` | Public |
| POST | `/api/stylists` | Admin |
| PUT | `/api/stylists/:id` | Admin |
| DELETE | `/api/stylists/:id` | Admin |

### Testimonials
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/testimonials` | Public (approved only) |
| GET | `/api/testimonials/admin` | Admin |
| POST | `/api/testimonials` | Public |
| PUT | `/api/testimonials/:id/approve` | Admin |
| DELETE | `/api/testimonials/:id` | Admin |

---

## ☁️ Deployment

### Frontend — Vercel
1. Push `/client` to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Set environment variable: `VITE_API_URL=https://your-backend.render.com/api`
4. Deploy

### Backend — Render
1. Push `/server` to GitHub
2. Create a **Web Service** in [render.com](https://render.com)
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add all environment variables from `.env.example`
6. Deploy

### Database — MongoDB Atlas
1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database user and whitelist IP (`0.0.0.0/0` for Render)
3. Copy the connection string to `MONGO_URI` in your server env

---

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, React Query, React Router v6, React Hook Form + Zod, Swiper.js, React DayPicker, Recharts, Lucide Icons

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Nodemailer, Multer, Cloudinary, Helmet, express-rate-limit, express-validator

---

## 📸 Features

- ✅ Multi-step booking wizard with real-time slot availability
- ✅ JWT authentication (client + admin) with httpOnly cookies
- ✅ Admin dashboard with stats, charts, and CRUD management
- ✅ Booking confirmation emails via Nodemailer
- ✅ Rate limiting, input validation, CORS, and Helmet security
- ✅ Framer Motion animations throughout
- ✅ Mobile-first responsive design
- ✅ Glassmorphism card design
- ✅ Guest booking (no account required)
- ✅ MongoDB seed data for instant demo
