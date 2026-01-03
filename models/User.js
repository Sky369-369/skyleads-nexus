const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    country: String,
    paymentMethod: { type: String, enum: ['bank', 'crypto'] },
    cryptoWallet: String,
    bankAccount: String,
    trackingId: { type: String, unique: true },
    trackingLink: String,
    status: { type: String, default: 'active' },
    earnings: {
        total: { type: Number, default: 0 },
        today: { type: Number, default: 0 },
        thisMonth: { type: Number, default: 0 }
    },
    leads: {
        total: { type: Number, default: 0 },
        approved: { type: Number, default: 0 },
        pending: { type: Number, default: 0 }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
