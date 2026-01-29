import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from './store/authStore'

// Passenger pages
import PassengerLogin from './pages/passenger/Login'
import PassengerRegister from './pages/passenger/Register'
import PassengerHome from './pages/passenger/Home'
import TripList from './pages/passenger/TripList'
import BookTrip from './pages/passenger/BookTrip'
import MyTickets from './pages/passenger/MyTickets'
import TicketDetail from './pages/passenger/TicketDetail'

// Conductor pages
import ConductorLogin from './pages/conductor/Login'
import ConductorDashboard from './pages/conductor/Dashboard'
import ScanQR from './pages/conductor/ScanQR'
import TripDetails from './pages/conductor/TripDetails'

// Admin pages
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import ManageDepots from './pages/admin/Depots'
import ManageBuses from './pages/admin/Buses'
import ManageRoutes from './pages/admin/Routes'
import ManageTrips from './pages/admin/Trips'
import LiveMonitor from './pages/admin/LiveMonitor'

// Components
import LoadingSpinner from './components/LoadingSpinner'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
})

// Protected route wrapper
function ProtectedRoute({
    children,
    allowedRoles
}: {
    children: React.ReactNode
    allowedRoles: string[]
}) {
    const { user, profile, loading } = useAuthStore()

    if (loading) {
        return <LoadingSpinner />
    }

    if (!user || !profile) {
        return <Navigate to="/login" replace />
    }

    if (!allowedRoles.includes(profile.role)) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}

function App() {
    const { initialize, initialized, loading } = useAuthStore()

    useEffect(() => {
        initialize()
    }, [initialize])

    if (!initialized || loading) {
        return <LoadingSpinner />
    }

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<PassengerLogin />} />
                    <Route path="/register" element={<PassengerRegister />} />

                    {/* Passenger routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute allowedRoles={['passenger']}>
                                <PassengerHome />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/trips"
                        element={
                            <ProtectedRoute allowedRoles={['passenger']}>
                                <TripList />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/book/:tripId"
                        element={
                            <ProtectedRoute allowedRoles={['passenger']}>
                                <BookTrip />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/tickets"
                        element={
                            <ProtectedRoute allowedRoles={['passenger']}>
                                <MyTickets />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/ticket/:ticketId"
                        element={
                            <ProtectedRoute allowedRoles={['passenger']}>
                                <TicketDetail />
                            </ProtectedRoute>
                        }
                    />

                    {/* Conductor routes */}
                    <Route path="/conductor/login" element={<ConductorLogin />} />
                    <Route
                        path="/conductor/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['conductor']}>
                                <ConductorDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/conductor/scan"
                        element={
                            <ProtectedRoute allowedRoles={['conductor']}>
                                <ScanQR />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/conductor/trip/:tripId"
                        element={
                            <ProtectedRoute allowedRoles={['conductor']}>
                                <TripDetails />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/depots"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <ManageDepots />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/buses"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <ManageBuses />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/routes"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <ManageRoutes />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/trips"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <ManageTrips />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/live"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <LiveMonitor />
                            </ProtectedRoute>
                        }
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default App
