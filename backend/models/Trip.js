import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
    routeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: true
    },
    busId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
        required: true
    },
    conductorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    scheduledDeparture: {
        type: Date,
        required: true
    },
    scheduledArrival: {
        type: Date,
        required: true
    },
    actualDeparture: {
        type: Date,
        default: null
    },
    actualArrival: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    availableSeats: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Trip', tripSchema);
