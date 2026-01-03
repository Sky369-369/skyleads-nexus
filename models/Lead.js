const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    leadId: { type: String, required: true, unique: true },
    trackingId: { type: String, required: true },
    name: String,
    email: String,
    phone: String,
    category: String,
    payout: Number,
    status: { type: String, default: 'pending' },
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', leadSchema);
