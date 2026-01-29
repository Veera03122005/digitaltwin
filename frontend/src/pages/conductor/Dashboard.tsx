import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import LoadingSpinner from '@/components/LoadingSpinner'

interface Trip {
    _id: string
    routeId: {
        name: string
        origin: string
        destination: string
    }
    busId: {
        registrationNumber: string
        model: string
    }
    scheduledDeparture: string
    status: string
}

export default function ConductorDashboard() {
    const navigate = useNavigate()
    const [trips, setTrips] = useState<Trip[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const res = await api.get('/trips/conductor')
                setTrips(res.data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchTrips()
    }, [])

    if (loading) return <LoadingSpinner />

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-xl)' }}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">👨‍✈️ My Trips</h1>
                <Link to="/conductor/scan" className="btn btn-primary">
                    📷 Scan Ticket
                </Link>
            </div>

            {trips.length === 0 ? (
                <div className="text-center py-10 card">
                    <h3 className="text-gray-500">No active trips assigned.</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.map((trip) => (
                        <div key={trip._id} className="card p-5 hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate(`/conductor/trip/${trip._id}`)}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">{trip.routeId.name}</h3>
                                    <p className="text-sm text-gray-500">{trip.busId.registrationNumber}</p>
                                </div>
                                <span className={`badge ${trip.status === 'scheduled' ? 'badge-info' : 'badge-success'}`}>
                                    {trip.status}
                                </span>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-600">Departure</p>
                                <p className="font-bold">{new Date(trip.scheduledDeparture).toLocaleString()}</p>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <span>Manage Trip</span>
                                <span className="text-primary text-xl">→</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
