const express = require('express');
const { handleChatMessage } = require('../controllers/chatController');
const { protect } = require('../../../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.post('/', handleChatMessage);

module.exports = router;
