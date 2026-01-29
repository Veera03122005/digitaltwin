# Bus Pre-Booking System - Complete Deployment Guide

## 📋 Prerequisites Checklist

Before you begin, ensure you have:

- [ ] Node.js 18+ installed
- [ ] npm or yarn package manager
- [ ] Git installed
- [ ] Supabase account (free tier works)
- [ ] Code editor (VS Code recommended)
- [ ] Modern web browser

## 🚀 Step-by-Step Deployment

### Phase 1: Supabase Backend Setup (30 minutes)

#### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub (recommended)
4. Click "New Project"
5. Fill in:
   - **Name**: `bus-booking-system`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free (sufficient for development)
6. Click "Create new project"
7. Wait 2-3 minutes for initialization

#### 1.2 Apply Database Migrations

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into SQL Editor
5. Click "Run" (bottom right)
6. Wait for success message
7. Repeat for `supabase/migrations/002_rls_policies.sql`

**Verification**: Go to **Table Editor** - you should see all tables (profiles, depots, buses, etc.)

#### 1.3 Get API Credentials

1. Go to **Settings** → **API**
2. Copy these values (you'll need them later):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)
   - **service_role key**: `eyJhbGc...` (keep this SECRET!)

#### 1.4 Install Supabase CLI

```bash
# Windows (PowerShell as Administrator)
scoop install supabase

# Or using npm (all platforms)
npm install -g supabase
```

Verify installation:
```bash
supabase --version
```

#### 1.5 Login to Supabase CLI

```bash
supabase login
```

This will open a browser window. Authorize the CLI.

#### 1.6 Link Your Project

```bash
cd c:\Users\Veera\Downloads\Bus_Digital_Twin-main\Bus_Digital_Twin-main
supabase link --project-ref YOUR_PROJECT_REF
```

**Where to find PROJECT_REF**: 
- In your Supabase URL: `https://YOUR_PROJECT_REF.supabase.co`
- Or in Settings → General → Reference ID

#### 1.7 Deploy Edge Functions

```bash
# Deploy all functions
supabase functions deploy create-ticket
supabase functions deploy verify-ticket
supabase functions deploy send-ticket-email
supabase functions deploy calculate-eta
```

**Verification**: Go to **Edge Functions** in Supabase Dashboard - you should see 4 deployed functions.

#### 1.8 Set Environment Secrets (Optional - for Email)

If you want email notifications:

1. Sign up at [resend.com](https://resend.com)
2. Get API key
3. Set secret:
```bash
supabase secrets set RESEND_API_KEY=re_xxxxx
```

### Phase 2: Frontend Setup (15 minutes)

#### 2.1 Install Dependencies

```bash
cd frontend
npm install
```

This will install all required packages (~2-3 minutes).

#### 2.2 Configure Environment Variables

1. Copy the example file:
```bash
copy .env.example .env.local
```

2. Edit `.env.local` with your values:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace with the values you copied in step 1.3.

#### 2.3 Start Development Server

```bash
npm run dev
```

You should see:
```
  VITE v5.0.11  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

#### 2.4 Open in Browser

Navigate to `http://localhost:3000`

You should see the login page with a beautiful gradient background!

### Phase 3: Create Test Data (10 minutes)

#### 3.1 Create Admin User

1. Go to `http://localhost:3000/register`
2. Register with:
   - **Email**: `admin@test.com`
   - **Password**: `admin123`
   - **Name**: `Admin User`
3. After registration, go to Supabase Dashboard → **Table Editor** → **profiles**
4. Find the row with email `admin@test.com`
5. Click to edit
6. Change **role** from `passenger` to `admin`
7. Save

#### 3.2 Create Conductor User

1. Register another user:
   - **Email**: `conductor@test.com`
   - **Password**: `conductor123`
   - **Name**: `Conductor User`
2. In Supabase, change role to `conductor`

#### 3.3 Create Test Passenger

1. Register:
   - **Email**: `passenger@test.com`
   - **Password**: `passenger123`
   - **Name**: `Test Passenger`
2. Keep role as `passenger`

#### 3.4 Add Sample Data

Go to Supabase **SQL Editor** and run:

```sql
-- Insert test depots
INSERT INTO depots (name, code, address, latitude, longitude, city, state) VALUES
('Hyderabad Central', 'HYD-C', 'Mahatma Gandhi Bus Station, Hyderabad', 17.3850, 78.4867, 'Hyderabad', 'Telangana'),
('Vijayawada Depot', 'VJA-D', 'Pandit Nehru Bus Station, Vijayawada', 16.5062, 80.6480, 'Vijayawada', 'Andhra Pradesh'),
('Bangalore Depot', 'BLR-D', 'Kempegowda Bus Station, Bangalore', 12.9716, 77.5946, 'Bangalore', 'Karnataka');

-- Insert test buses
INSERT INTO buses (bus_number, registration_number, capacity, bus_type, depot_id) VALUES
('AP-28-1234', 'TS09UA1234', 50, 'express', (SELECT id FROM depots WHERE code = 'HYD-C')),
('AP-28-5678', 'TS09UB5678', 45, 'deluxe', (SELECT id FROM depots WHERE code = 'HYD-C')),
('KA-01-9999', 'KA01MC9999', 40, 'ordinary', (SELECT id FROM depots WHERE code = 'BLR-D'));

-- Insert test route
INSERT INTO routes (route_number, name, origin_depot_id, destination_depot_id, distance_km, estimated_duration_minutes) VALUES
('R001', 'Hyderabad - Vijayawada Express', 
 (SELECT id FROM depots WHERE code = 'HYD-C'),
 (SELECT id FROM depots WHERE code = 'VJA-D'),
 275, 300);

-- Insert route stops
INSERT INTO route_stops (route_id, stop_name, stop_order, latitude, longitude, estimated_arrival_offset_minutes) VALUES
((SELECT id FROM routes WHERE route_number = 'R001'), 'Hyderabad Central', 1, 17.3850, 78.4867, 0),
((SELECT id FROM routes WHERE route_number = 'R001'), 'Suryapet', 2, 17.1433, 79.6237, 90),
((SELECT id FROM routes WHERE route_number = 'R001'), 'Kodad', 3, 16.9969, 79.9644, 150),
((SELECT id FROM routes WHERE route_number = 'R001'), 'Vijayawada', 4, 16.5062, 80.6480, 300);

-- Insert test trip (tomorrow at 10 AM)
INSERT INTO trips (
  trip_number, 
  route_id, 
  bus_id, 
  conductor_id,
  scheduled_departure, 
  scheduled_arrival,
  status,
  available_seats
) VALUES (
  'TRP-001',
  (SELECT id FROM routes WHERE route_number = 'R001'),
  (SELECT id FROM buses WHERE bus_number = 'AP-28-1234'),
  (SELECT id FROM profiles WHERE email = 'conductor@test.com'),
  (CURRENT_DATE + INTERVAL '1 day' + TIME '10:00:00'),
  (CURRENT_DATE + INTERVAL '1 day' + TIME '15:00:00'),
  'scheduled',
  50
);
```

### Phase 4: Testing the System (20 minutes)

#### 4.1 Test Passenger Flow

1. **Login**: Go to `http://localhost:3000/login`
   - Email: `passenger@test.com`
   - Password: `passenger123`
2. You should be redirected to the home page
3. Navigate through the app (pages are placeholders for now)

#### 4.2 Test Conductor Flow

1. **Logout** (you'll need to add a logout button or clear cookies)
2. Go to `http://localhost:3000/conductor/login`
   - Email: `conductor@test.com`
   - Password: `conductor123`
3. You should see the conductor dashboard

#### 4.3 Test Admin Flow

1. Go to `http://localhost:3000/admin/login`
   - Email: `admin@test.com`
   - Password: `admin123`
2. You should see the admin dashboard

### Phase 5: Production Deployment (30 minutes)

#### 5.1 Deploy Frontend to Vercel

1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bus-booking.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Click "Deploy"

#### 5.2 Configure Custom Domain (Optional)

1. In Vercel, go to **Settings** → **Domains**
2. Add your domain
3. Update DNS records as instructed

#### 5.3 Enable HTTPS

Vercel automatically provides SSL certificates. No action needed!

### Phase 6: Monitoring & Maintenance

#### 6.1 Monitor Supabase

- **Database**: Settings → Database → Connection pooling
- **API Logs**: Logs & Reports → API Logs
- **Edge Functions**: Edge Functions → Logs

#### 6.2 Monitor Frontend

- **Vercel Analytics**: Built-in analytics
- **Error Tracking**: Add Sentry (optional)

#### 6.3 Backup Strategy

1. **Database Backups**: Supabase Pro plan includes daily backups
2. **Code Backups**: GitHub repository
3. **Manual Backup**: Use Supabase CLI
```bash
supabase db dump -f backup.sql
```

## 🔧 Troubleshooting

### Issue: "Cannot find module '@/lib/supabase'"

**Solution**: Ensure `vite.config.ts` has the path alias configured:
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

### Issue: "Missing environment variables"

**Solution**: 
1. Ensure `.env.local` exists in `frontend/` directory
2. Restart dev server: `npm run dev`

### Issue: Edge Function deployment fails

**Solution**:
1. Ensure you're logged in: `supabase login`
2. Ensure project is linked: `supabase link`
3. Check function syntax for errors

### Issue: RLS policies blocking queries

**Solution**:
1. Check user is authenticated
2. Verify user role in profiles table
3. Review RLS policies in `002_rls_policies.sql`

### Issue: Email not sending

**Solution**:
1. Verify RESEND_API_KEY is set
2. Check Edge Function logs
3. Verify email domain is verified in Resend

## 📊 Performance Optimization

### Frontend

1. **Code Splitting**: Already configured with Vite
2. **Image Optimization**: Use WebP format
3. **Lazy Loading**: Implement for routes
4. **Caching**: Configure service worker (PWA)

### Backend

1. **Database Indexes**: Already created in migrations
2. **Connection Pooling**: Enable in Supabase settings
3. **Query Optimization**: Use `select` to limit columns
4. **Realtime Channels**: Limit subscriptions

## 🎯 Next Steps

1. ✅ Complete all deployment phases
2. 🔲 Implement remaining UI pages
3. 🔲 Add payment gateway integration
4. 🔲 Implement QR code scanner
5. 🔲 Add map integration
6. 🔲 Build mobile app (React Native)
7. 🔲 Add analytics dashboard
8. 🔲 Implement push notifications
9. 🔲 Add multi-language support
10. 🔲 Load testing and optimization

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **TypeScript Docs**: https://www.typescriptlang.org/docs

---

**Deployment Time Estimate**: 2-3 hours total
**Difficulty Level**: Intermediate
**Cost**: Free tier (up to 500MB database, 2GB bandwidth)

Good luck with your deployment! 🚀
