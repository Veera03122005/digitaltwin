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
    fare: number
    qrCode: string
    status: string
    tripId: {
        scheduledDeparture: string
        busId: {
            registrationNumber: string
            model: string
        }
        routeId: {
            name: string
        }
    }
}

export default function TicketDetail() {
    const { ticketId } = useParams()
    const [ticket, setTicket] = useState<Ticket | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const res = await api.get(`/tickets/${ticketId}`)
                setTicket(res.data)
            } catch (err) {
                console.error(err)
                setError('Failed to load ticket')
            } finally {
                setLoading(false)
            }
        }

        if (ticketId) fetchTicket()
    }, [ticketId])

    if (loading) return <LoadingSpinner />
    if (error || !ticket) return <div className="container" style={{ paddingTop: 'var(--spacing-xl)' }}><div className="alert alert-error">{error || 'Ticket not found'}</div></div>

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-xl)' }}>
            <div style={{ maxWidth: '28rem', margin: '0 auto' }}>
                <div className="card" style={{ padding: '1.5rem', textAlign: 'center', borderTop: '4px solid var(--primary-color)' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <span style={{
                            background: '#dcfce7',
                            color: '#15803d',
                            padding: '0.25rem 1rem',
                            borderRadius: '9999px',
                            fontWeight: '600'
                        }}>
                            Booking Confirmed
                        </span>
                    </div>

                    <h2 className="text-2xl font-bold mb-1">Trip to {ticket.toStop}</h2>
                    <p className="text-gray-500 mb-6">{new Date(ticket.tripId.scheduledDeparture).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

                    <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                        <img src={ticket.qrCode} alt="Ticket QR Code" style={{ width: '12rem', height: '12rem', margin: '0 auto' }} />
                        <p style={{ fontFamily: 'monospace', fontSize: '0.875rem', marginTop: '0.5rem', color: '#6b7280' }}>{ticket.bookingReference}</p>
                    </div>

                    <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                            <span className="text-gray-500">Passenger</span>
                            <span className="font-medium">{ticket.passengerName}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                            <span className="text-gray-500">Bus</span>
                            <span className="font-medium">{ticket.tripId.busId.model}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                            <span className="text-gray-500">Route</span>
                            <span className="font-medium">{ticket.tripId.routeId.name}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                            <span className="text-gray-500">From</span>
                            <span className="font-medium">{ticket.fromStop}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                            <span className="text-gray-500">To</span>
                            <span className="font-medium">{ticket.toStop}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                            <span className="text-gray-500">Departure</span>
                            <span className="font-medium">{new Date(ticket.tripId.scheduledDeparture).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => window.print()}>Print / Save</button>
                        <Link to="/" className="btn btn-outline" style={{ flex: 1, textAlign: 'center' }}>Home</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
