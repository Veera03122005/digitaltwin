import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    origin: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    distance: {
        type: Number,
        required: true
    },
    estimatedDuration: {
        type: Number, // in minutes
        required: true
    },
    baseFare: {
        type: Number,
        required: true
    },
    stops: [{
        name: String,
        sequence: Number,
        distanceFromOrigin: Number,
        estimatedArrival: Number // minutes from origin
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Route', routeSchema);
