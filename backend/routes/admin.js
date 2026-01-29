import express from 'express';
import User from '../models/User.js';
import Trip from '../models/Trip.js';
import Bus from '../models/Bus.js';
import Route from '../models/Route.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, adminOnly, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'passenger' });
        const totalBuses = await Bus.countDocuments();
        const totalRoutes = await Route.countDocuments();
        const activeTrips = await Trip.countDocuments({ status: 'scheduled' });

        // Calculate total revenue (mock for now as we build Ticket model)
        const revenue = 12500; // Placeholder

        res.json({
            stats: {
                totalUsers,
                totalBuses,
                totalRoutes,
                activeTrips,
                revenue
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error fetching stats' });
    }
});

// @desc    Get all buses
// @route   GET /api/admin/buses
router.get('/buses', protect, adminOnly, async (req, res) => {
    try {
        const buses = await Bus.find({});
        res.json(buses);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// @desc    Add a new bus
// @route   POST /api/admin/buses
router.post('/buses', protect, adminOnly, async (req, res) => {
    try {
        const { registrationNumber, model, capacity, type, status } = req.body;

        // Check if bus exists
        const busExists = await Bus.findOne({ registrationNumber });
        if (busExists) {
            return res.status(400).json({ error: 'Bus already exists' });
        }

        const bus = await Bus.create({
            registrationNumber,
            model,
            capacity,
            status: status || 'active',
            features: {
                hasAC: type === 'AC' || type === 'Luxury',
                hasWifi: type === 'Luxury',
                hasUSB: true
            }
        });

        res.status(201).json(bus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error adding bus' });
    }
});

// @desc    Update bus status
// @route   PUT /api/admin/buses/:id
router.put('/buses/:id', protect, adminOnly, async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id);
        if (!bus) {
            return res.status(404).json({ error: 'Bus not found' });
        }

        bus.status = req.body.status || bus.status;
        await bus.save();

        res.json(bus);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// @desc    Get all routes
// @route   GET /api/admin/routes
router.get('/routes', protect, adminOnly, async (req, res) => {
    try {
        const routes = await Route.find({});
        res.json(routes);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
