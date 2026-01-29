import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
    registrationNumber: {
        type: String,
        required: true,
        unique: true
    },
    model: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    depotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Depot',
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'maintenance', 'retired'],
        default: 'active'
    },
    features: {
        hasAC: { type: Boolean, default: false },
        hasWifi: { type: Boolean, default: false },
        hasUSB: { type: Boolean, default: false }
    }
}, {
    timestamps: true
});

export default mongoose.model('Bus', busSchema);
