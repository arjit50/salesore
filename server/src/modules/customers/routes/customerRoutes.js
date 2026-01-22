const express = require('express');
const router = express.Router();

const { protect } = require('../../../middleware/authMiddleware');

router.use(protect);

router.get('/', (req, res) => {
    res.send('Customers route');
});

module.exports = router;
