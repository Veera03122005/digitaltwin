import { useState, useEffect } from 'react'
import api from '@/lib/api'
import LoadingSpinner from '@/components/LoadingSpinner'

interface Route {
    _id: string
    name: string
    code: string
    origin: string
    destination: string
    distance: number
    estimatedDuration: number
    baseFare: number
    stops: any[]
}

export default function ManageRoutes() {
    const [routes, setRoutes] = useState<Route[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const res = await api.get('/admin/routes')
                setRoutes(res.data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchRoutes()
    }, [])

    if (loading) return <LoadingSpinner />

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-xl)' }}>
            <h1 className="text-2xl font-bold mb-6">Manage Routes</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {routes.map(route => (
                    <div key={route._id} className="card p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg">{route.name}</h3>
                            <span className="badge badge-info">{route.code}</span>
                        </div>

                        <div className="flex items-center gap-4 text-gray-600 mb-4">
                            <span>{route.origin}</span>
                            <span className="text-gray-400">→</span>
                            <span>{route.destination}</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-sm bg-gray-50 p-3 rounded">
                            <div>
                                <p className="text-gray-500">Distance</p>
                                <p className="font-medium">{route.distance} km</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Duration</p>
                                <p className="font-medium">{route.estimatedDuration} mins</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Fare</p>
                                <p className="font-medium text-primary">₹{route.baseFare}</p>
                            </div>
                        </div>

                        <div className="mt-3 text-sm text-gray-500">
                            <strong>{route.stops.length} Stops: </strong>
                            {route.stops.map(s => s.name).join(' → ')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
