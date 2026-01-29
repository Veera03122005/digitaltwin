import { useState, useEffect } from 'react'
import api from '@/lib/api'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function ManageTrips() {
    const [trips, setTrips] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                // Fetch upcoming trips (no filter returns generally upcoming)
                const res = await api.get('/trips')
                setTrips(res.data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchTrips()
    }, [])

    if (loading) return <LoadingSpinner />

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-xl)' }}>
            <h1 className="text-2xl font-bold mb-6">Manage Trips</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.length === 0 ? (
                    <div className="col-span-full card p-8 text-center text-gray-500">
                        No scheduled trips found.
                    </div>
                ) : (
                    trips.map(trip => (
                        <div key={trip._id} className="card p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg">{trip.routeId.name}</h3>
                                <span className={`badge ${trip.status === 'scheduled' ? 'badge-info' : 'badge-success'}`}>
                                    {trip.status}
                                </span>
                            </div>

                            <div className="text-sm text-gray-600 mb-4">
                                <p>{trip.routeId.origin} → {trip.routeId.destination}</p>
                                <p className="mt-1 font-medium">{new Date(trip.scheduledDeparture).toLocaleString()}</p>
                            </div>

                            <div className="flex justify-between items-center text-sm border-t pt-3">
                                <span>🚌 {trip.busId.registrationNumber}</span>
                                <span className="font-bold text-primary">{trip.availableSeats} seats left</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
