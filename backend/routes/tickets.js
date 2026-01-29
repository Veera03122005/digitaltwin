import express from 'express';
import Ticket from '../models/Ticket.js';
import Trip from '../models/Trip.js';
import QRCode from 'qrcode';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Book a new ticket
// @route   POST /api/tickets
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const {
            tripId,
            passengerName,
            passengerPhone,
            passengerEmail,
            fromStop,
            toStop,
            fare
        } = req.body;

        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        if (trip.availableSeats <= 0) {
            return res.status(400).json({ error: 'No seats available' });
        }

        // Generate Booking Reference (Unique ID)
        const bookingReference = 'T' + Date.now().toString().slice(-6) + Math.random().toString(36).substring(2, 5).toUpperCase();

        // Generate QR Code Data (JSON string is common practice)
        const qrData = JSON.stringify({
            ref: bookingReference,
            tripId: trip._id,
            passenger: passengerName
        });

        const qrCodeImage = await QRCode.toDataURL(qrData);

        const ticket = new Ticket({
            userId: req.user._id,
            tripId,
            passengerName,
            passengerPhone,
            passengerEmail,
            fromStop,
            toStop,
            fare,
            qrCode: qrCodeImage,
            bookingReference
        });

        await ticket.save();

        // Decrement available seats
        trip.availableSeats -= 1;
        await trip.save();

        res.status(201).json(ticket);
    } catch (error) {
        console.error('Error booking ticket:', error);
        res.status(500).json({ error: 'Server error booking ticket' });
    }
});

// @desc    Get my tickets
// @route   GET /api/tickets/my-tickets
// @access  Private
router.get('/my-tickets', protect, async (req, res) => {
    try {
        const tickets = await Ticket.find({ userId: req.user._id })
            .populate({
                path: 'tripId',
                populate: { path: 'routeId busId' } // Deep populate
            })
            .sort({ createdAt: -1 });

        res.json(tickets);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ error: 'Server error fetching tickets' });
    }
});

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate({
                path: 'tripId',
                populate: { path: 'routeId busId' }
            });

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        // Ensure user owns ticket (or is admin/conductor)
        if (ticket.userId.toString() !== req.user._id.toString() && req.user.role === 'passenger') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        res.json(ticket);
    } catch (error) {
        console.error('Error fetching ticket:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @desc    Verify ticket (Conductor only)
// @route   POST /api/tickets/verify
// @access  Private (Conductor)
router.post('/verify', protect, async (req, res) => {
    try {
        const { ticketId, bookingReference } = req.body;

        // Find ticket by ID or Reference
        let ticket;
        if (ticketId) {
            ticket = await Ticket.findById(ticketId).populate({
                path: 'tripId',
                populate: { path: 'routeId' }
            });
        } else if (bookingReference) {
            ticket = await Ticket.findOne({ bookingReference }).populate({
                path: 'tripId',
                populate: { path: 'routeId' }
            });
        }

        if (!ticket) {
            return res.status(404).json({ error: 'Invalid Ticket' });
        }

        // Check auth
        if (req.user.role !== 'conductor' && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to verify tickets' });
        }

        if (ticket.status === 'boarded' || ticket.status === 'completed') {
            return res.status(400).json({ error: 'Ticket already used/boarded', ticket });
        }

        if (ticket.status === 'cancelled') {
            return res.status(400).json({ error: 'Ticket is cancelled', ticket });
        }

        // Update status
        ticket.status = 'boarded';
        ticket.boardedAt = Date.now();
        await ticket.save();

        res.json({ message: 'Ticket Verified Successfully', ticket });
    } catch (error) {
        console.error('Error verifying ticket:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @desc    Get tickets for a trip (Manifest)
// @route   GET /api/tickets/trip/:tripId
// @access  Private (Conductor/Admin)
router.get('/trip/:tripId', protect, async (req, res) => {
    try {
        if (req.user.role === 'passenger') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const tickets = await Ticket.find({ tripId: req.params.tripId })
            .sort({ passengerName: 1 });

        res.json(tickets);
    } catch (error) {
        console.error('Error fetching manifest:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
