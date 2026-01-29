import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

export default function PassengerLogin() {
    const navigate = useNavigate()
    const login = useAuthStore((state) => state.login)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await api.post('/auth/login', {
                email,
                password,
            })

            const { user, token } = response.data

            // Check if user is a passenger
            if (user.role !== 'passenger') {
                throw new Error('Access denied. This login is for passengers only.')
            }

            // Update auth store
            login(user, token)

            navigate('/')
        } catch (err: any) {
            console.error('Login error:', err)
            setError(err.response?.data?.error || err.message || 'Failed to sign in')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="gradient-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-md)' }}>
            <div className="card glass" style={{ maxWidth: '450px', width: '100%' }}>
                <div className="text-center mb-4">
                    <h1 style={{ color: 'white', marginBottom: 'var(--spacing-sm)' }}>🚌 Bus Booking</h1>
                    <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.125rem' }}>Sign in to book your tickets</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label" style={{ color: 'white' }}>Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ color: 'white' }}>Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: 'var(--spacing-lg)' }}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="text-center mt-3">
                    <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: 'white', fontWeight: 600, textDecoration: 'underline' }}>
                            Register here
                        </Link>
                    </p>
                </div>

                <div className="text-center mt-3" style={{ paddingTop: 'var(--spacing-lg)', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)' }}>
                        Login as:
                    </p>
                    <div className="flex gap-2" style={{ justifyContent: 'center' }}>
                        <Link to="/conductor/login" className="btn btn-sm btn-outline" style={{ borderColor: 'white', color: 'white' }}>
                            Conductor
                        </Link>
                        <Link to="/admin/login" className="btn btn-sm btn-outline" style={{ borderColor: 'white', color: 'white' }}>
                            Admin
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
