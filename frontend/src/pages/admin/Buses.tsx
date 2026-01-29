import { useState, useEffect } from 'react'
import api from '@/lib/api'
import LoadingSpinner from '@/components/LoadingSpinner'

interface Bus {
    _id: string
    registrationNumber: string
    model: string
    capacity: number
    status: string
    features: {
        hasAC: boolean
        hasWifi: boolean
    }
}

export default function ManageBuses() {
    const [buses, setBuses] = useState<Bus[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        registrationNumber: '',
        model: '',
        capacity: 40,
        type: 'Non-AC',
        status: 'active'
    })

    const fetchBuses = async () => {
        try {
            const res = await api.get('/admin/buses')
            setBuses(res.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBuses()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await api.post('/admin/buses', formData)
            setShowForm(false)
            fetchBuses()
            // Reset form
            setFormData({
                registrationNumber: '',
                model: '',
                capacity: 40,
                type: 'Non-AC',
                status: 'active'
            })
        } catch (error) {
            console.error('Error creating bus:', error)
            alert('Failed to create bus')
        }
    }

    if (loading) return <LoadingSpinner />

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-xl)' }}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Buses</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : '+ Add Bus'}
                </button>
            </div>

            {showForm && (
                <div className="card p-6 mb-6">
                    <h3 className="font-bold mb-4">Add New Bus</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Registration Number</label>
                            <input
                                className="form-input"
                                value={formData.registrationNumber}
                                onChange={e => setFormData({ ...formData, registrationNumber: e.target.value })}
                                required
                                placeholder="AP-XX-XX-XXXX"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Model</label>
                            <input
                                className="form-input"
                                value={formData.model}
                                onChange={e => setFormData({ ...formData, model: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Capacity</label>
                            <input
                                type="number"
                                className="form-input"
                                value={formData.capacity}
                                onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Type</label>
                            <select
                                className="form-input"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="Non-AC">Non-AC</option>
                                <option value="AC">AC</option>
                                <option value="Luxury">Luxury</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <button type="submit" className="btn btn-primary w-full" style={{ background: '#10b981', borderColor: '#10b981' }}>Save Bus</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {buses.map(bus => (
                    <div key={bus._id} className="card p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg">{bus.registrationNumber}</h3>
                            <span className={`badge ${bus.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                                {bus.status}
                            </span>
                        </div>
                        <p className="text-gray-600 mb-1">{bus.model}</p>
                        <div className="flex gap-2 text-sm text-gray-500 mb-3">
                            <span>💺 {bus.capacity} Seats</span>
                            {bus.features?.hasAC && <span>❄️ AC</span>}
                            {bus.features?.hasWifi && <span>📶 WiFi</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
