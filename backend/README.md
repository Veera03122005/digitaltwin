# MongoDB Backend Setup Guide

## 🎯 Overview
This backend replaces Supabase with MongoDB + Express.js for the Bus Digital Twin application.

## 📋 Prerequisites
1. Node.js (v16 or higher)
2. MongoDB Atlas account (free tier available)

## 🚀 Quick Start

### Step 1: Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account
3. Create a new cluster (free M0 tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string

### Step 2: Configure Environment Variables

Edit `backend/.env` and update:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/bus_booking?retryWrites=true&w=majority
JWT_SECRET=your-random-secret-key-here
PORT=5000
FRONTEND_URL=http://localhost:3000
```

**Important:** Replace `YOUR_USERNAME`, `YOUR_PASSWORD`, and `YOUR_CLUSTER` with your actual MongoDB Atlas credentials.

### Step 3: Install Dependencies

```bash
cd backend
npm install
```

### Step 4: Start the Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0-xxxxx.mongodb.net
🚀 Server running on port 5000
📍 Frontend URL: http://localhost:3000
```

### Step 5: Create Test Accounts

The backend is now running! You can create test accounts by:

1. Using the registration endpoint
2. Or running the seed script (coming next)

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Health Check
- `GET /health` - Check if API is running

## 🔑 Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. Frontend sends token in Authorization header: `Bearer <token>`

## 📦 What's Included

- ✅ User authentication (JWT-based)
- ✅ Password hashing (bcrypt)
- ✅ Role-based access control (passenger, conductor, admin)
- ✅ MongoDB models (User, Ticket, Trip, Route, Bus)
- ✅ CORS configuration
- ✅ Error handling

## 🔄 Next Steps

1. Update frontend to use new API
2. Create ticket booking routes
3. Implement QR code generation
4. Add trip management routes
5. Create admin dashboard routes

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Check your connection string in `.env`
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify username/password are correct

### Port Already in Use
- Change PORT in `.env` to a different number (e.g., 5001)

### CORS Errors
- Ensure FRONTEND_URL in `.env` matches your frontend URL
