# Bus Pre-Booking System

A production-ready public bus pre-booking system that digitizes ticket booking and verification for depot-to-depot buses while maintaining conductor-based operations.

## 🎯 System Overview

This system allows:
- **Passengers** to pre-book tickets online before boarding
- **Conductors** to verify tickets using QR codes
- **Admins** to manage depots, buses, trips, and conductors
- **Digital Twin** tracking of actual vs estimated arrival times

## 🛠️ Technology Stack

### Backend (Supabase)
- **Authentication**: Email-based login with role-based access
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Realtime**: Live updates for bookings and bus locations
- **Edge Functions**: Ticket generation, QR validation, email sending, ETA calculation
- **Storage**: Optional QR code image storage

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **Zustand** for state management
- **TanStack Query** for data fetching
- **Mapbox/Google Maps** for mapping (to be integrated)
- **html5-qrcode** for QR scanning

## 📁 Project Structure

```
Bus_Digital_Twin-main/
├── ARCHITECTURE.md              # Detailed system architecture
├── README.md                    # This file
│
├── supabase/                    # Supabase backend
│   ├── migrations/
│   │   ├── 001_initial_schema.sql      # Database schema
│   │   └── 002_rls_policies.sql        # Security policies
│   └── functions/
│       ├── create-ticket/              # Ticket creation
│       ├── verify-ticket/              # QR verification
│       ├── send-ticket-email/          # Email notifications
│       └── calculate-eta/              # ETA calculations
│
└── frontend/                    # React frontend
    ├── src/
    │   ├── components/          # Reusable components
    │   ├── pages/
    │   │   ├── passenger/       # Passenger pages
    │   │   ├── conductor/       # Conductor pages
    │   │   └── admin/           # Admin pages
    │   ├── lib/                 # Utilities
    │   ├── store/               # State management
    │   ├── types/               # TypeScript types
    │   ├── App.tsx              # Main app component
    │   └── index.css            # Global styles
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- Git

### 1. Set Up Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to initialize (2-3 minutes)
3. Go to **SQL Editor** in the Supabase dashboard
4. Run the migrations in order:
   - Copy and paste `supabase/migrations/001_initial_schema.sql`
   - Click "Run"
   - Copy and paste `supabase/migrations/002_rls_policies.sql`
   - Click "Run"

### 2. Deploy Edge Functions

Install Supabase CLI:
```bash
npm install -g supabase
```

Login to Supabase:
```bash
supabase login
```

Link your project:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

Deploy functions:
```bash
supabase functions deploy create-ticket
supabase functions deploy verify-ticket
supabase functions deploy send-ticket-email
supabase functions deploy calculate-eta
```

### 3. Configure Environment Variables

Create `frontend/.env.local`:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Get these values from:
- Supabase Dashboard → Settings → API

### 4. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 👥 User Roles & Access

### Passenger
- **Login**: `/login`
- **Features**:
  - Search and book trips
  - View tickets with QR codes
  - Track bus location
  - Receive email confirmations

### Conductor
- **Login**: `/conductor/login`
- **Features**:
  - Select active trip
  - Scan passenger QR codes
  - Mark passengers as boarded
  - View trip details

### Admin
- **Login**: `/admin/login`
- **Features**:
  - Manage depots, buses, routes
  - Schedule trips
  - Assign conductors
  - Monitor live trips
  - View analytics

## 🎫 Ticket Flow

### Passenger Booking
1. Passenger logs in
2. Searches for trips (origin → destination, date)
3. Selects boarding and drop stops
4. Completes payment
5. Receives email with QR code
6. Shows QR to conductor when boarding

### Conductor Verification
1. Conductor logs in
2. Selects active trip
3. Scans passenger QR code
4. System validates:
   - Ticket exists
   - Correct trip
   - Not already boarded
   - Within valid time window
5. Marks passenger as boarded
6. Boarding status updates in real-time

## 📊 Digital Twin (ETA System)

The system tracks:
- **Actual arrival times** at each stop
- **Estimated arrival times** based on:
  - Current bus location
  - Current speed
  - Distance to stops
  - Historical data

Displays:
- Graph comparing estimated vs actual times
- Delay/early arrival indicators
- Boarding window status

## 🔒 Security Features

- **Row Level Security (RLS)** on all tables
- **Role-based access control**
- **QR code validation** with hash verification
- **One-time ticket use** enforcement
- **Time-bound ticket validity**
- **Secure payment integration** (Stripe/Razorpay ready)

## 📧 Email Configuration

To enable email notifications:

1. Sign up for [Resend](https://resend.com) (free tier: 100 emails/day)
2. Get your API key
3. Add to Supabase Edge Function secrets:
```bash
supabase secrets set RESEND_API_KEY=your_api_key
```

## 🗺️ Map Integration

To add live bus tracking:

### Option 1: Mapbox
1. Sign up at [mapbox.com](https://www.mapbox.com)
2. Get access token
3. Add to `.env.local`:
```env
VITE_MAPBOX_TOKEN=your_token
```

### Option 2: Google Maps
1. Enable Maps JavaScript API in Google Cloud Console
2. Get API key
3. Add to `.env.local`:
```env
VITE_GOOGLE_MAPS_KEY=your_key
```

## 📱 Mobile App (Future)

The system is designed to be easily converted to a mobile app using:
- **React Native** (code reuse from React web)
- **Expo** for rapid development
- Native QR scanner
- Push notifications

## 🧪 Testing

### Create Test Data

Run this SQL in Supabase SQL Editor:

```sql
-- Create test admin user (after signing up via UI)
UPDATE profiles SET role = 'admin' WHERE email = 'admin@test.com';

-- Create test conductor
UPDATE profiles SET role = 'conductor' WHERE email = 'conductor@test.com';

-- Insert test depot
INSERT INTO depots (name, code, address, latitude, longitude, city, state)
VALUES ('Central Bus Station', 'CBS', '123 Main St', 17.3850, 78.4867, 'Hyderabad', 'Telangana');

-- Insert test bus
INSERT INTO buses (bus_number, registration_number, capacity, depot_id)
VALUES ('AP-28-1234', 'TS09UA1234', 50, (SELECT id FROM depots LIMIT 1));

-- Create more test data as needed
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Push code to GitHub
2. Connect to Vercel/Netlify
3. Set environment variables
4. Deploy

### Backend (Supabase)

Already hosted! Just ensure:
- Migrations are applied
- Edge Functions are deployed
- Environment variables are set

## 📈 Monitoring

- **Supabase Dashboard**: Database metrics, API logs
- **Edge Function Logs**: Real-time function execution logs
- **Frontend**: Add Sentry for error tracking

## 🔧 Troubleshooting

### Common Issues

**1. "Missing Supabase environment variables"**
- Ensure `.env.local` exists in `frontend/` directory
- Check variable names match exactly

**2. "Access denied" when logging in**
- Verify user role in `profiles` table
- Check RLS policies are applied

**3. Email not sending**
- Verify RESEND_API_KEY is set
- Check Edge Function logs

**4. QR code not scanning**
- Ensure camera permissions granted
- Try different lighting conditions
- Verify QR code is not corrupted

## 📝 License

This project is proprietary and confidential.

## 🤝 Support

For issues or questions:
1. Check ARCHITECTURE.md for detailed system design
2. Review Supabase logs for backend errors
3. Check browser console for frontend errors

## 🎯 Next Steps

1. ✅ Set up Supabase project
2. ✅ Apply database migrations
3. ✅ Deploy Edge Functions
4. ✅ Configure environment variables
5. ✅ Run frontend locally
6. 🔲 Add test data
7. 🔲 Test passenger flow
8. 🔲 Test conductor flow
9. 🔲 Test admin flow
10. 🔲 Deploy to production

---

**Built with ❤️ for modern public transportation**
