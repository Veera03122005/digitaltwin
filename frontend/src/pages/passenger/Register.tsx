import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '@/lib/api'

export default function PassengerRegister() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        phone: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await api.post('/auth/register', {
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                phone: formData.phone,
            })

            // On success, redirect to login
            navigate('/login')
        } catch (err: any) {
            console.error('Registration error:', err)
            setError(err.response?.data?.error || err.message || 'Failed to register')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="gradient-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-md)' }}>
            <div className="card glass" style={{ maxWidth: '450px', width: '100%' }}>
                <div className="text-center mb-4">
                    <h1 style={{ color: 'white', marginBottom: 'var(--spacing-sm)' }}>🚌 Create Account</h1>
                    <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.125rem' }}>Join us to book bus tickets</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label className="form-label" style={{ color: 'white' }}>Full Name</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ color: 'white' }}>Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ color: 'white' }}>Phone Number</label>
                        <input
                            type="tel"
                            className="form-input"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ color: 'white' }}>Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: 'var(--spacing-lg)' }}
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="text-center mt-3">
                    <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'white', fontWeight: 600, textDecoration: 'underline' }}>
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
