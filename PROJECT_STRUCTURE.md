# Bus Pre-Booking System - Project Structure

```
Bus_Digital_Twin-main/
│
├── 📄 README.md                          # Main documentation
├── 📄 ARCHITECTURE.md                    # System architecture & design
├── 📄 DEPLOYMENT.md                      # Step-by-step deployment guide
├── 📄 IMPLEMENTATION_SUMMARY.md          # What's built & next steps
├── 📄 QUICKSTART.md                      # 10-minute quick start
│
├── 📁 supabase/                          # Backend (Supabase)
│   │
│   ├── 📁 migrations/                    # Database migrations
│   │   ├── 001_initial_schema.sql       # Core tables, triggers, indexes
│   │   └── 002_rls_policies.sql         # Row Level Security policies
│   │
│   └── 📁 functions/                     # Edge Functions (Serverless)
│       │
│       ├── 📁 create-ticket/            # Ticket generation
│       │   └── index.ts                 # - Validates availability
│       │                                # - Generates QR codes
│       │                                # - Sends emails
│       │
│       ├── 📁 verify-ticket/            # QR verification
│       │   └── index.ts                 # - Decodes QR codes
│       │                                # - Validates tickets
│       │                                # - Prevents duplicates
│       │
│       ├── 📁 send-ticket-email/        # Email notifications
│       │   └── index.ts                 # - HTML email templates
│       │                                # - QR code embedding
│       │                                # - Resend integration
│       │
│       └── 📁 calculate-eta/            # Digital Twin ETA
│           └── index.ts                 # - Distance calculation
│                                        # - Speed averaging
│                                        # - Arrival predictions
│
└── 📁 frontend/                          # React Frontend
    │
    ├── 📄 package.json                   # Dependencies
    ├── 📄 tsconfig.json                  # TypeScript config
    ├── 📄 vite.config.ts                 # Vite config
    ├── 📄 index.html                     # HTML entry point
    ├── 📄 .env.example                   # Environment template
    ├── 📄 .gitignore                     # Git ignore rules
    │
    └── 📁 src/                           # Source code
        │
        ├── 📄 main.tsx                   # React entry point
        ├── 📄 App.tsx                    # Main app component
        ├── 📄 index.css                  # Global styles & design system
        │
        ├── 📁 lib/                       # Utilities
        │   └── supabase.ts              # Supabase client config
        │
        ├── 📁 types/                     # TypeScript types
        │   └── database.ts              # Database type definitions
        │
        ├── 📁 store/                     # State management
        │   └── authStore.ts             # Authentication state (Zustand)
        │
        ├── 📁 components/                # Reusable components
        │   └── LoadingSpinner.tsx       # Loading indicator
        │
        └── 📁 pages/                     # Page components
            │
            ├── 📁 passenger/             # Passenger pages
            │   ├── Login.tsx            # ✅ Login page
            │   ├── Register.tsx         # ✅ Registration page
            │   ├── Home.tsx             # 🔲 Search & home
            │   ├── TripList.tsx         # 🔲 Available trips
            │   ├── BookTrip.tsx         # 🔲 Booking form
            │   ├── MyTickets.tsx        # 🔲 Ticket list
            │   └── TicketDetail.tsx     # 🔲 Ticket with QR
            │
            ├── 📁 conductor/             # Conductor pages
            │   ├── Login.tsx            # ✅ Conductor login
            │   ├── Dashboard.tsx        # 🔲 Trip selection
            │   ├── ScanQR.tsx           # 🔲 QR scanner
            │   └── TripDetails.tsx      # 🔲 Passenger list
            │
            └── 📁 admin/                 # Admin pages
                ├── Login.tsx            # ✅ Admin login
                ├── Dashboard.tsx        # 🔲 Analytics
                ├── Depots.tsx           # 🔲 Depot management
                ├── Buses.tsx            # 🔲 Bus management
                ├── Routes.tsx           # 🔲 Route management
                ├── Trips.tsx            # 🔲 Trip scheduling
                └── LiveMonitor.tsx      # 🔲 Live tracking

Legend:
  ✅ = Fully implemented
  🔲 = Placeholder (to be implemented)
```

## 📊 File Statistics

### Backend (Supabase)
- **Migrations**: 2 files (~600 lines SQL)
- **Edge Functions**: 4 files (~800 lines TypeScript)
- **Total Backend**: ~1,400 lines

### Frontend (React)
- **Configuration**: 6 files
- **Core Files**: 5 files (~500 lines)
- **Pages**: 15 files (~300 lines)
- **Components**: 1 file (~10 lines)
- **Total Frontend**: ~810 lines

### Documentation
- **Guides**: 5 files (~1,500 lines)

### Grand Total
- **Files**: 38
- **Lines of Code**: ~3,710
- **Languages**: TypeScript, SQL, CSS, Markdown

## 🗄️ Database Schema

```
┌─────────────┐
│  auth.users │ (Supabase managed)
└──────┬──────┘
       │
       ├──────────────────────────────────┐
       │                                  │
┌──────▼──────┐                    ┌─────▼─────┐
│  profiles   │                    │  depots   │
│  - id (FK)  │                    │  - id     │
│  - role     │                    │  - name   │
│  - email    │                    │  - code   │
└──────┬──────┘                    └─────┬─────┘
       │                                  │
       │                           ┌──────▼──────┐
       │                           │   buses     │
       │                           │  - id       │
       │                           │  - number   │
       │                           └──────┬──────┘
       │                                  │
       │                           ┌──────▼──────┐
       │                           │   routes    │
       │                           │  - id       │
       │                           │  - number   │
       │                           └──────┬──────┘
       │                                  │
       │                           ┌──────▼──────────┐
       │                           │  route_stops    │
       │                           │  - id           │
       │                           │  - stop_order   │
       │                           └──────┬──────────┘
       │                                  │
       │                           ┌──────▼──────┐
       │                           │   trips     │
       │                           │  - id       │
       │                           │  - status   │
       │                           └──────┬──────┘
       │                                  │
       ├──────────────────────────────────┤
       │                                  │
┌──────▼──────┐                    ┌─────▼──────────┐
│  tickets    │                    │ bus_locations  │
│  - id       │                    │  - trip_id     │
│  - qr_code  │                    │  - latitude    │
│  - status   │                    │  - longitude   │
└──────┬──────┘                    └────────────────┘
       │
       │                           ┌─────────────────┐
       │                           │ stop_arrivals   │
       │                           │  - estimated    │
       │                           │  - actual       │
       │                           └─────────────────┘
       │
┌──────▼──────────┐
│ boarding_logs   │
│  - ticket_id    │
│  - conductor_id │
└─────────────────┘
```

## 🔐 Security Layers

```
┌─────────────────────────────────────────┐
│         User Authentication             │
│     (Supabase Auth - Email/Password)    │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         Role-Based Access Control       │
│   (Passenger / Conductor / Admin)       │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│      Row Level Security (RLS)           │
│   (30+ policies on 10 tables)           │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         QR Code Verification            │
│   (Hash validation, one-time use)       │
└─────────────────────────────────────────┘
```

## 🔄 Data Flow

### Passenger Booking Flow
```
Passenger → Search Trips → Select Trip → Choose Stops
    ↓
Book Ticket → Payment Gateway → create-ticket Function
    ↓
Generate QR → Save to DB → send-ticket-email Function
    ↓
Email Sent → Passenger Receives QR Code
```

### Conductor Verification Flow
```
Conductor → Select Trip → Scan QR Code
    ↓
verify-ticket Function → Validate Ticket
    ↓
Check: Exists? Correct Trip? Not Boarded? Valid Time?
    ↓
Mark as Boarded → Create Boarding Log → Update Seats
```

### Digital Twin Flow
```
Bus GPS → calculate-eta Function
    ↓
Calculate Distance to Stops → Estimate Arrival Times
    ↓
Update stop_arrivals Table → Broadcast via Realtime
    ↓
Passenger/Admin Apps → Display ETA vs Actual
```

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│                   Internet                       │
└────────────────┬────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
┌───────▼──────┐   ┌──────▼──────┐
│   Vercel     │   │  Supabase   │
│  (Frontend)  │   │  (Backend)  │
│              │   │             │
│ - React App  │   │ - Database  │
│ - Static     │   │ - Auth      │
│ - CDN        │   │ - Realtime  │
│              │   │ - Functions │
└──────────────┘   └─────────────┘
```

## 📦 Dependencies

### Frontend
- **react**: ^18.2.0
- **react-router-dom**: ^6.21.1
- **@supabase/supabase-js**: ^2.39.0
- **zustand**: ^4.4.7
- **@tanstack/react-query**: ^5.17.0
- **html5-qrcode**: ^2.3.8
- **qrcode**: ^1.5.3
- **mapbox-gl**: ^3.1.0

### Backend
- **Supabase** (managed service)
- **PostgreSQL** (managed by Supabase)
- **Deno** (Edge Functions runtime)

---

**Last Updated**: 2026-01-28  
**Version**: 1.0  
**Status**: Foundation Complete
