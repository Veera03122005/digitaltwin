import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import LoadingSpinner from '@/components/LoadingSpinner'

interface Trip {
    _id: string
    routeId: {
        name: string
        origin: string
        destination: string
        baseFare: number
        estimatedDuration: number
        code: string
    }
    busId: {
        registrationNumber: string
        model: string
        features: {
            hasAC: boolean
            hasWifi: boolean
        }
    }
    scheduledDeparture: string
    scheduledArrival: string
    availableSeats: number
}

export default function TripList() {
    const navigate = useNavigate()
    const [trips, setTrips] = useState<Trip[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        from: '',
        to: '',
        date: new Date().toISOString().split('T')[0]
    })

    const fetchTrips = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (filters.from) params.append('from', filters.from)
            if (filters.to) params.append('to', filters.to)
            // if (filters.date) params.append('date', filters.date) // Optional date filter

            const response = await api.get(`/trips?${params.toString()}`)
            setTrips(response.data)
        } catch (error) {
            console.error('Error fetching trips:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTrips()
    }, [])

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const formatDuration = (mins: number) => {
        const hours = Math.floor(mins / 60)
        const minutes = mins % 60
        return `${hours}h ${minutes}m`
    }

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-xl)' }}>
            <h1 className="mb-4">🚌 Find Your Trip</h1>

            {/* Search Bar */}
            <div className="card p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="form-group">
                        <label className="form-label">From</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Origin City"
                            value={filters.from}
                            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">To</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Destination City"
                            value={filters.to}
                            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Date</label>
                        <input
                            type="date"
                            className="form-input"
                            value={filters.date}
                            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                        />
                    </div>
                    <div className="flex items-end">
                        <button className="btn btn-primary w-full" onClick={fetchTrips}>
                            Search Buses
                        </button>
                    </div>
                </div>
            </div>

            {/* Results */}
            {loading ? (
                <LoadingSpinner />
            ) : trips.length === 0 ? (
                <div className="text-center py-10">
                    <h3 className="text-gray-500">No trips found matching your criteria.</h3>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {trips.map((trip) => (
                        <div key={trip._id} className="card p-4 hover:shadow-lg transition-shadow">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="badge badge-primary">{trip.routeId.code}</span>
                                        <h3 className="font-bold text-lg">{trip.routeId.name}</h3>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-600">
                                        <div>
                                            <p className="text-sm text-gray-500">Departure</p>
                                            <p className="font-bold text-lg">{formatTime(trip.scheduledDeparture)}</p>
                                            <p className="text-xs">{trip.routeId.origin}</p>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="text-xs text-gray-400">{formatDuration(trip.routeId.estimatedDuration)}</p>
                                            <div className="w-20 h-0.5 bg-gray-300 relative">
                                                <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-gray-300 transform rotate-45"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Arrival</p>
                                            <p className="font-bold text-lg">{formatTime(trip.scheduledArrival)}</p>
                                            <p className="text-xs">{trip.routeId.destination}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center md:text-right min-w-[150px]">
                                    <div className="mb-2">
                                        <p className="text-2xl font-bold text-primary">₹{trip.routeId.baseFare}</p>
                                        <p className="text-xs text-green-600">{trip.availableSeats} seats left</p>
                                    </div>
                                    <button
                                        className="btn btn-primary btn-sm w-full"
                                        onClick={() => navigate(`/book/${trip._id}`)}
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-gray-100 flex gap-3 text-sm text-gray-500">
                                <span>🚌 {trip.busId.model}</span>
                                {trip.busId.features?.hasAC && <span>❄️ AC</span>}
                                {trip.busId.features?.hasWifi && <span>📶 WiFi</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
