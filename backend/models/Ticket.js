import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    passengerName: {
        type: String,
        required: true
    },
    passengerPhone: {
        type: String,
        required: true
    },
    passengerEmail: {
        type: String,
        required: true
    },
    fromStop: {
        type: String,
        required: true
    },
    toStop: {
        type: String,
        required: true
    },
    seatNumber: {
        type: String,
        default: null
    },
    fare: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'boarded', 'completed', 'cancelled'],
        default: 'confirmed'
    },
    qrCode: {
        type: String,
        required: true
    },
    bookingReference: {
        type: String,
        required: true,
        unique: true
    },
    boardedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

export default mongoose.model('Ticket', ticketSchema);
