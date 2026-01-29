# Bus Pre-Booking System - Architecture Documentation

## System Overview

A production-ready public bus pre-booking system that digitizes ticket booking and verification for depot-to-depot buses while maintaining conductor-based operations.

## Technology Stack

### Backend: Supabase
- **Authentication**: Email-based login for all user roles
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Realtime**: Live updates for bookings, boarding status, and bus locations
- **Edge Functions**: Ticket generation, QR validation, email notifications
- **Storage**: QR code images (optional)

### Frontend: React + TypeScript
- Mobile-first responsive design
- Map integration (Mapbox/Google Maps)
- Real-time subscriptions
- QR code scanning (HTML5 QR Code Scanner)

## Database Schema

### Core Tables

#### 1. `profiles`
```sql
- id (uuid, FK to auth.users)
- email (text)
- full_name (text)
- phone (text)
- role (enum: passenger, conductor, admin)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 2. `depots`
```sql
- id (uuid, PK)
- name (text)
- code (text, unique)
- address (text)
- latitude (decimal)
- longitude (decimal)
- city (text)
- state (text)
- active (boolean)
- created_at (timestamp)
```

#### 3. `buses`
```sql
- id (uuid, PK)
- bus_number (text, unique)
- registration_number (text, unique)
- capacity (integer)
- bus_type (enum: ordinary, express, deluxe)
- depot_id (uuid, FK to depots)
- active (boolean)
- created_at (timestamp)
```

#### 4. `routes`
```sql
- id (uuid, PK)
- route_number (text, unique)
- name (text)
- origin_depot_id (uuid, FK to depots)
- destination_depot_id (uuid, FK to depots)
- distance_km (decimal)
- estimated_duration_minutes (integer)
- active (boolean)
- created_at (timestamp)
```

#### 5. `route_stops`
```sql
- id (uuid, PK)
- route_id (uuid, FK to routes)
- stop_name (text)
- stop_order (integer)
- latitude (decimal)
- longitude (decimal)
- estimated_arrival_offset_minutes (integer) -- from origin
- created_at (timestamp)
```

#### 6. `trips`
```sql
- id (uuid, PK)
- trip_number (text, unique)
- route_id (uuid, FK to routes)
- bus_id (uuid, FK to buses)
- conductor_id (uuid, FK to profiles)
- scheduled_departure (timestamp)
- scheduled_arrival (timestamp)
- actual_departure (timestamp, nullable)
- actual_arrival (timestamp, nullable)
- status (enum: scheduled, in_progress, completed, cancelled)
- available_seats (integer)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 7. `tickets`
```sql
- id (uuid, PK)
- ticket_number (text, unique)
- trip_id (uuid, FK to trips)
- passenger_id (uuid, FK to profiles)
- boarding_stop_id (uuid, FK to route_stops)
- drop_stop_id (uuid, FK to route_stops)
- seat_number (integer, nullable)
- fare_amount (decimal)
- booking_time (timestamp)
- payment_status (enum: pending, completed, refunded)
- payment_id (text, nullable)
- qr_code (text) -- Base64 or URL
- status (enum: booked, boarded, completed, cancelled, expired)
- boarded_at (timestamp, nullable)
- boarded_by (uuid, FK to profiles, nullable) -- conductor who verified
- valid_from (timestamp)
- valid_until (timestamp)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 8. `bus_locations`
```sql
- id (uuid, PK)
- trip_id (uuid, FK to trips)
- latitude (decimal)
- longitude (decimal)
- speed (decimal, nullable)
- heading (decimal, nullable)
- recorded_at (timestamp)
- created_at (timestamp)
```

#### 9. `stop_arrivals`
```sql
- id (uuid, PK)
- trip_id (uuid, FK to trips)
- route_stop_id (uuid, FK to route_stops)
- estimated_arrival (timestamp)
- actual_arrival (timestamp, nullable)
- delay_minutes (integer, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 10. `boarding_logs`
```sql
- id (uuid, PK)
- ticket_id (uuid, FK to tickets)
- trip_id (uuid, FK to trips)
- conductor_id (uuid, FK to profiles)
- boarding_time (timestamp)
- boarding_stop_id (uuid, FK to route_stops)
- verification_method (enum: qr_scan, manual_entry)
- created_at (timestamp)
```

## User Roles & Permissions

### Passenger
- Book tickets for available trips
- View own bookings
- Cancel bookings (before trip starts)
- Receive email confirmations with QR codes

### Conductor
- View assigned trips
- Scan and verify passenger QR codes
- Mark passengers as boarded
- Issue manual tickets (offline fallback)
- Update bus location (optional)

### Depot Admin
- Manage depots, buses, routes
- Schedule trips
- Assign conductors to trips
- View analytics and reports
- Monitor live trips and bookings

## Row Level Security (RLS) Policies

### profiles
- Users can read own profile
- Admins can read all profiles
- Users can update own profile

### tickets
- Passengers can read own tickets
- Conductors can read tickets for assigned trips
- Admins can read all tickets
- Only system (via Edge Functions) can create tickets

### trips
- All authenticated users can read active trips
- Conductors can update assigned trips
- Admins can create/update/delete trips

### boarding_logs
- Conductors can create logs for assigned trips
- Admins can read all logs

## Edge Functions

### 1. `create-ticket`
**Trigger**: After successful payment
**Logic**:
- Validate trip availability
- Check seat availability
- Generate unique ticket number
- Generate QR code (encode ticket ID)
- Create ticket record
- Send confirmation email
- Return ticket details

### 2. `verify-ticket`
**Trigger**: Conductor scans QR
**Input**: QR code data, trip ID, conductor ID
**Logic**:
- Decode QR to get ticket ID
- Validate ticket exists
- Check ticket belongs to this trip
- Check ticket not already boarded
- Check ticket not expired
- Check valid time window
- Mark as boarded
- Create boarding log
- Return verification result

### 3. `send-ticket-email`
**Trigger**: After ticket creation
**Logic**:
- Generate HTML email with ticket details
- Embed QR code image
- Include trip information
- Send via email service (Resend, SendGrid, or Supabase partner)

### 4. `calculate-eta`
**Trigger**: Periodic (every 2-5 minutes) or on location update
**Logic**:
- Get current bus location
- Calculate distance to next stops
- Estimate arrival times based on:
  - Current speed
  - Historical data
  - Traffic patterns (if available)
- Update stop_arrivals table
- Broadcast via Realtime

### 5. `auto-expire-tickets`
**Trigger**: Scheduled (cron job)
**Logic**:
- Find tickets with valid_until < now
- Mark as expired
- Update trip available seats

## Realtime Subscriptions

### Passenger App
- Subscribe to own tickets (status changes)
- Subscribe to trip updates (delays, cancellations)
- Subscribe to bus location for booked trip

### Conductor App
- Subscribe to assigned trip tickets
- Subscribe to boarding logs
- Subscribe to trip status updates

### Admin Dashboard
- Subscribe to all active trips
- Subscribe to booking counts
- Subscribe to bus locations

## Frontend Architecture

### Pages

#### Passenger Flow
1. **Login/Register** (`/login`, `/register`)
2. **Home/Search** (`/`)
   - Search trips by origin, destination, date
3. **Trip List** (`/trips`)
   - Display available trips
   - Show available seats, fare, timings
4. **Booking** (`/book/:tripId`)
   - Select boarding/drop stops
   - Confirm booking
   - Payment integration
5. **My Tickets** (`/tickets`)
   - List all bookings
   - Show QR codes
   - Ticket details
6. **Ticket Detail** (`/ticket/:ticketId`)
   - Full ticket info
   - QR code display
   - Live bus tracking

#### Conductor Flow
1. **Login** (`/conductor/login`)
2. **Dashboard** (`/conductor/dashboard`)
   - Select active trip
   - View trip details
3. **Scan QR** (`/conductor/scan`)
   - QR scanner interface
   - Verification result
   - Boarding confirmation
4. **Trip Details** (`/conductor/trip/:tripId`)
   - Passenger list
   - Boarding status
   - Manual entry option

#### Admin Flow
1. **Login** (`/admin/login`)
2. **Dashboard** (`/admin/dashboard`)
   - Overview stats
   - Active trips
   - Recent bookings
3. **Depots** (`/admin/depots`)
   - List, create, edit depots
4. **Buses** (`/admin/buses`)
   - List, create, edit buses
5. **Routes** (`/admin/routes`)
   - List, create, edit routes
   - Manage stops
6. **Trips** (`/admin/trips`)
   - Schedule trips
   - Assign conductors
7. **Live Monitor** (`/admin/live`)
   - Map view of all active buses
   - Digital twin (ETA vs Actual)
   - Booking analytics

## Digital Twin System

### ETA Calculation
1. **Data Collection**:
   - Bus GPS location (every 30-60 seconds)
   - Actual arrival times at stops
   - Historical trip data

2. **Estimation Algorithm**:
   ```
   ETA = Current Time + (Distance to Stop / Average Speed)
   
   Where:
   - Distance calculated using Haversine formula
   - Average Speed = Recent speed or historical average
   - Adjust for traffic patterns (time of day)
   ```

3. **Accuracy Tracking**:
   - Store both estimated and actual arrival times
   - Calculate delay = actual - estimated
   - Display on admin dashboard

4. **Visualization**:
   - Line graph: Time (X) vs Stops (Y)
   - Two lines: Estimated (blue) vs Actual (red)
   - Highlight delays in red, early arrivals in green

### Boarding Window Logic
```
Boarding Open: Bus arrives at stop OR ETA < 10 minutes
Boarding Closed: Bus departs stop OR ETA > 30 minutes
```

## Ticket Rules & Validation

### Ticket Generation
- Unique ticket number: `TKT-{YYYYMMDD}-{RANDOM6}`
- QR Code contains: `{ticket_id}|{trip_id}|{hash}`
- Valid from: Booking time
- Valid until: Scheduled arrival + 2 hours

### Validation Checks
1. ✅ Ticket exists in database
2. ✅ Ticket status = 'booked'
3. ✅ Ticket trip_id matches scanned trip
4. ✅ Current time within valid window
5. ✅ Ticket not already boarded
6. ✅ Boarding stop matches current location (optional)

### Duplicate Prevention
- Check ticket.status before boarding
- Use database transaction for atomic update
- Create boarding_log entry immediately

## Security Considerations

### Authentication
- Email + password (Supabase Auth)
- Role-based access control (RBAC)
- JWT tokens for API access

### RLS Policies
- Strict row-level security on all tables
- Service role key only for Edge Functions
- Anon key for public read operations

### QR Code Security
- Include HMAC hash in QR data
- Verify hash on scan
- One-time use enforcement
- Time-bound validity

### Payment Security
- Use payment gateway (Stripe, Razorpay)
- Never store card details
- Verify payment webhook signatures
- Atomic ticket creation after payment

## Non-Functional Requirements

### Performance
- Page load < 2 seconds on 3G
- QR scan verification < 500ms
- Support 1000+ concurrent users
- Database indexes on frequently queried fields

### Scalability
- Horizontal scaling via Supabase
- CDN for static assets
- Optimize queries with proper indexes
- Use database connection pooling

### Reliability
- 99.9% uptime target
- Graceful degradation (offline mode for conductors)
- Automatic retry for failed operations
- Transaction logging for audit

### Usability
- Mobile-first design
- Works on low-end Android devices
- Minimal data usage
- Clear error messages
- Accessibility (WCAG 2.1 AA)

## Deployment Strategy

### Development
1. Local Supabase instance (Docker)
2. React dev server
3. Environment variables in `.env.local`

### Staging
1. Supabase staging project
2. Vercel/Netlify preview deployment
3. Test data seeding

### Production
1. Supabase production project
2. Vercel/Netlify production deployment
3. Custom domain with SSL
4. CDN configuration
5. Monitoring (Sentry, LogRocket)

## Future Enhancements

- Multi-language support
- Push notifications
- Offline ticket storage (PWA)
- Dynamic pricing based on demand
- Loyalty program
- Bus amenities (AC, WiFi, etc.)
- Seat selection
- Group bookings
- Refund management
- Analytics dashboard
- Mobile apps (React Native)

---

**Version**: 1.0  
**Last Updated**: 2026-01-28  
**Status**: Production Ready
