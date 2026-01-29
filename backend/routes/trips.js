import express from 'express';
import Trip from '../models/Trip.js';
import Route from '../models/Route.js';
import Bus from '../models/Bus.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all active trips with filtering
// @route   GET /api/trips
// @access  Private (Passengers)
router.get('/', protect, async (req, res) => {
    try {
        const { from, to, date } = req.query;

        let query = { status: 'scheduled' };

        // If 'from' or 'to' is specified, we need to find matching routes first
        if (from || to) {
            let routeQuery = {};
            if (from) routeQuery.origin = { $regex: from, $options: 'i' };
            if (to) routeQuery.destination = { $regex: to, $options: 'i' };

            const matchingRoutes = await Route.find(routeQuery).select('_id');
            const routeIds = matchingRoutes.map(route => route._id);

            if (routeIds.length > 0) {
                query.routeId = { $in: routeIds };
            } else {
                return res.json([]); // No routes found matching criteria
            }
        }

        // Filter by date
        if (date) {
            const searchDate = new Date(date);
            const nextDay = new Date(searchDate);
            nextDay.setDate(nextDay.getDate() + 1);

            query.scheduledDeparture = {
                $gte: searchDate,
                $lt: nextDay
            };
        }

        const trips = await Trip.find(query)
            .populate('routeId')
            .populate('busId')
            .sort({ scheduledDeparture: 1 });

        res.json(trips);
    } catch (error) {
        console.error('Error fetching trips:', error);
        res.status(500).json({ error: 'Server error fetching trips' });
    }
});

// @desc    Get single trip details
// @route   GET /api/trips/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id)
            .populate('routeId')
            .populate('busId'); // Populate bus details

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        res.json(trip);
    } catch (error) {
        console.error('Error fetching trip:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @desc    Get trips for logged-in conductor
// @route   GET /api/trips/conductor
// @access  Private (Conductor)
router.get('/conductor', protect, async (req, res) => {
    try {
        if (req.user.role !== 'conductor') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const trips = await Trip.find({ conductorId: req.user._id })
            .populate('routeId')
            .populate('busId')
            .sort({ scheduledDeparture: 1 });

        res.json(trips);
    } catch (error) {
        console.error('Error fetching conductor trips:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
