const express = require('express');
const router = express.Router();

const { protect } = require('../../../middleware/authMiddleware');

router.use(protect);

router.post('/subscribe', (req, res) => {
    res.json({ message: 'Subscribed successfully (Mock)' });
});

router.get('/status', (req, res) => {
    res.json({ status: 'Active', plan: 'Pro' });
});

module.exports = router;
