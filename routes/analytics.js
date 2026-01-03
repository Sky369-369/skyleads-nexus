const express = require('express');
const router = express.Router();

router.get('/overview', (req, res) => {
    res.json({
        daily: 0,
        monthly: 0,
        total: 0
    });
});

module.exports = router;
