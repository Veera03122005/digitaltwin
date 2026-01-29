@echo off
echo Starting Bus Digital Twin Application...

echo Starting Backend (Port 5000)...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo Starting Frontend (Port 3000)...
start "Frontend App" cmd /k "cd frontend && npm run dev"

echo Application launched!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
pause
