const express = require('express');
const {
    getLeads,
    getLead,
    createLead,
    updateLead,
    deleteLead,
} = require('../controllers/leadController');
const { protect, authorize } = require('../../../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Protect all routes

router.route('/')
    .get(getLeads)
    .post(createLead);

router.route('/:id')
    .get(getLead)
    .put(updateLead)
    .delete(authorize('Admin', 'Manager'), deleteLead); // Only Admin/Manager can delete

module.exports = router;
