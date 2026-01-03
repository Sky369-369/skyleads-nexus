const express = require('express');
const router = express.Router();

router.get('/config', (req, res) => {
    res.json({
        stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        cryptoEnabled: true
    });
});

router.post('/payout', (req, res) => {
    res.json({ message: 'Payout request received' });
});

module.exports = router;
