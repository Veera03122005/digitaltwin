import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function BookTrip() {
    const { tripId } = useParams()
    const navigate = useNavigate()
    const { user } = useAuthStore()

    const [trip, setTrip] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [booking, setBooking] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        passengerName: '',
        passengerPhone: '',
        passengerEmail: '',
        fromStop: '',
        toStop: ''
    })

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const res = await api.get(`/trips/${tripId}`)
                setTrip(res.data)

                setFormData(prev => ({
                    ...prev,
                    fromStop: res.data.routeId.origin, // Default from origin
                    toStop: res.data.routeId.destination // Default to destination
                }))
            } catch (err) {
                console.error(err)
                setError('Failed to load trip details')
            } finally {
                setLoading(false)
            }
        }

        if (tripId) fetchTrip()
    }, [tripId])

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                passengerName: user.fullName || '',
                passengerPhone: user.phone || '',
                passengerEmail: user.email || ''
            }))
        }
    }, [user])

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault()
        setBooking(true)
        setError('')

        try {
            const res = await api.post('/tickets', {
                tripId,
                passengerName: formData.passengerName,
                passengerPhone: formData.passengerPhone,
                passengerEmail: formData.passengerEmail,
                fromStop: formData.fromStop,
                toStop: formData.toStop,
                fare: trip?.routeId.baseFare || 0
            })

            navigate(`/ticket/${res.data._id}`)
        } catch (err: any) {
            setError(err.response?.data?.error || 'Booking failed')
        } finally {
            setBooking(false)
        }
    }

    if (loading) return <LoadingSpinner />
    if (!trip) return <div className="container" style={{ paddingTop: 'var(--spacing-xl)' }}>Trip not found</div>

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-xl)' }}>
            <h1 className="mb-4">Confirm Booking</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Trip Details */}
                <div>
                    <div className="card p-6 mb-4">
                        <h2 className="text-xl font-bold mb-4">Trip Details</h2>
                        <div className="space-y-3">
                            <div>
                                <h3 className="text-sm text-gray-500">Route</h3>
                                <p className="font-bold">{trip.routeId.name}</p>
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <h3 className="text-sm text-gray-500">Date</h3>
                                    <p>{new Date(trip.scheduledDeparture).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm text-gray-500">Time</h3>
                                    <p>{new Date(trip.scheduledDeparture).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm text-gray-500">Bus</h3>
                                <p>{trip.busId.model} ({trip.busId.registrationNumber})</p>
                            </div>
                            <div className="pt-3 border-t border-gray-100">
                                <h3 className="text-sm text-gray-500">Total Fare</h3>
                                <p className="text-2xl font-bold text-primary">₹{trip.routeId.baseFare}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Form */}
                <div>
                    <div className="card p-6">
                        <h2 className="text-xl font-bold mb-4">Passenger Details</h2>

                        {error && <div className="alert alert-error mb-4">{error}</div>}

                        <form onSubmit={handleBook}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.passengerName}
                                    onChange={(e) => setFormData({ ...formData, passengerName: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={formData.passengerEmail}
                                    onChange={(e) => setFormData({ ...formData, passengerEmail: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    value={formData.passengerPhone}
                                    onChange={(e) => setFormData({ ...formData, passengerPhone: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Boarding Point</label>
                                <select
                                    className="form-input"
                                    value={formData.fromStop}
                                    onChange={(e) => setFormData({ ...formData, fromStop: e.target.value })}
                                >
                                    <option value={trip.routeId.origin}>{trip.routeId.origin} (Origin)</option>
                                    {trip.routeId.stops?.map((stop: any) => (
                                        <option key={stop._id} value={stop.name}>{stop.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Dropping Point</label>
                                <select
                                    className="form-input"
                                    value={formData.toStop}
                                    onChange={(e) => setFormData({ ...formData, toStop: e.target.value })}
                                >
                                    <option value={trip.routeId.destination}>{trip.routeId.destination} (Destination)</option>
                                    {trip.routeId.stops?.map((stop: any) => (
                                        <option key={stop._id} value={stop.name}>{stop.name}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-full mt-4"
                                disabled={booking}
                            >
                                {booking ? 'Processing...' : 'Confirm & Book'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
