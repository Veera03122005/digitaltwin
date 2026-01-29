import { useEffect, useState } from 'react'
import api from '@/lib/api'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Link } from 'react-router-dom'

interface DashboardStats {
    totalUsers: number
    totalBuses: number
    totalRoutes: number
    activeTrips: number
    revenue: number
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/stats')
                setStats(response.data.stats)
            } catch (error) {
                console.error('Error fetching admin stats:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    if (loading) return <LoadingSpinner />

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-xl)' }}>
            <h1 className="mb-4" style={{ marginBottom: '2rem' }}>🔐 Admin Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                    <h3 style={{ color: '#666', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Passengers</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-color)', margin: '0.5rem 0' }}>{stats?.totalUsers || 0}</p>
                </div>

                <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                    <h3 style={{ color: '#666', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Trips</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#10b981', margin: '0.5rem 0' }}>{stats?.activeTrips || 0}</p>
                </div>

                <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                    <h3 style={{ color: '#666', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Buses</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#3b82f6', margin: '0.5rem 0' }}>{stats?.totalBuses || 0}</p>
                </div>

                <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                    <h3 style={{ color: '#666', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenue</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#8b5cf6', margin: '0.5rem 0' }}>₹{stats?.revenue || 0}</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* Quick Actions */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>⚡ Quick Actions</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <Link to="/admin/trips" className="btn btn-outline" style={{ textAlign: 'center' }}>Manage Trips</Link>
                        <Link to="/admin/buses" className="btn btn-outline" style={{ textAlign: 'center' }}>Manage Buses</Link>
                        <Link to="/admin/routes" className="btn btn-outline" style={{ textAlign: 'center' }}>Manage Routes</Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>🕒 System Status</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></div>
                        <span>Backend API: <strong>Online</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></div>
                        <span>Database: <strong>Connected</strong></span>
                    </div>
                </div>
            </div>
        </div>
    )
}
