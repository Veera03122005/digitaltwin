import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '@/lib/api'
import LoadingSpinner from '@/components/LoadingSpinner'

interface Ticket {
    _id: string
    bookingReference: string
    passengerName: string
    fromStop: string
    toStop: string
    status: string
}

export default function TripDetails() {
    const { tripId } = useParams()
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchManifest = async () => {
            try {
                const res = await api.get(`/tickets/trip/${tripId}`)
                setTickets(res.data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        if (tripId) fetchManifest()
    }, [tripId])

    if (loading) return <LoadingSpinner />

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-xl)' }}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">📋 Passenger Manifest</h1>
                <Link to="/conductor/dashboard" className="btn btn-outline">Back</Link>
            </div>

            <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <tr>
                                <th style={{ padding: '1rem' }}>Ref</th>
                                <th style={{ padding: '1rem' }}>Passenger</th>
                                <th style={{ padding: '1rem' }}>Route</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                                        No passengers found for this trip.
                                    </td>
                                </tr>
                            ) : (
                                tickets.map((ticket) => (
                                    <tr key={ticket._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                        <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.875rem' }}>{ticket.bookingReference}</td>
                                        <td style={{ padding: '1rem', fontWeight: '500' }}>{ticket.passengerName}</td>
                                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#4b5563' }}>{ticket.fromStop} → {ticket.toStop}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                background: ticket.status === 'boarded' ? '#dcfce7' : '#fef3c7',
                                                color: ticket.status === 'boarded' ? '#166534' : '#92400e'
                                            }}>
                                                {ticket.status === 'boarded' ? 'DETAILS CHECKED' : ticket.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
