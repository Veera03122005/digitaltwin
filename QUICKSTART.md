# Bus Pre-Booking System - Quick Start Guide

## 🚀 Get Running in 10 Minutes

### Step 1: Supabase Setup (5 minutes)

1. **Create Project**:
   - Go to https://supabase.com
   - Click "New Project"
   - Name: `bus-booking`
   - Wait 2-3 minutes

2. **Run Migrations**:
   - Go to SQL Editor
   - Copy/paste `supabase/migrations/001_initial_schema.sql`
   - Click Run
   - Copy/paste `supabase/migrations/002_rls_policies.sql`
   - Click Run

3. **Get Credentials**:
   - Settings → API
   - Copy Project URL and anon key

### Step 2: Frontend Setup (5 minutes)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
copy .env.example .env.local

# Edit .env.local with your Supabase credentials
# VITE_SUPABASE_URL=your_url
# VITE_SUPABASE_ANON_KEY=your_key

# Start development server
npm run dev
```

### Step 3: Create Test User

1. Open http://localhost:3000/register
2. Register with any email/password
3. Login and explore!

## 🎯 What You Get

- ✅ Complete authentication system
- ✅ Role-based access (Passenger, Conductor, Admin)
- ✅ Beautiful UI with gradient backgrounds
- ✅ Secure database with RLS
- ✅ 4 Edge Functions ready to use
- ✅ Mobile-first responsive design

## 📚 Documentation

- **Architecture**: See `ARCHITECTURE.md`
- **Deployment**: See `DEPLOYMENT.md`
- **Summary**: See `IMPLEMENTATION_SUMMARY.md`

## 🔧 Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Supabase
supabase login       # Login to Supabase
supabase link        # Link to project
supabase functions deploy  # Deploy functions
```

## 🎨 Test Different Roles

### Passenger
- Register at `/register`
- Default role is passenger

### Conductor
1. Register a user
2. In Supabase Table Editor → profiles
3. Change role to `conductor`
4. Login at `/conductor/login`

### Admin
1. Register a user
2. Change role to `admin`
3. Login at `/admin/login`

## 🐛 Troubleshooting

**Can't connect to Supabase?**
- Check `.env.local` exists
- Verify credentials are correct
- Restart dev server

**Build errors?**
- Delete `node_modules`
- Run `npm install` again
- Check Node.js version (need 18+)

**Database errors?**
- Verify migrations ran successfully
- Check Table Editor for tables
- Review SQL Editor for errors

## 📞 Need Help?

1. Check `DEPLOYMENT.md` for detailed steps
2. Review `ARCHITECTURE.md` for system design
3. Check Supabase logs for backend errors
4. Check browser console for frontend errors

## 🎯 Next Steps

After getting it running:

1. ✅ Explore the UI
2. ✅ Test authentication
3. ✅ Review the code structure
4. 🔲 Add sample data (see DEPLOYMENT.md)
5. 🔲 Implement remaining UI pages
6. 🔲 Deploy to production

---

**Time to First Run**: ~10 minutes  
**Difficulty**: Beginner-friendly  
**Prerequisites**: Node.js 18+, Supabase account

Happy coding! 🚀
