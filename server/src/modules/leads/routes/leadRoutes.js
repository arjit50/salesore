const express = require('express');
const {
    getLeads,
    getLead,
    createLead,
    updateLead,
    deleteLead,
    importLeads,
    sendEmailToLead,
    deleteLeadsBulk,
    sendEmailToLeadsBulk,
    sendWhatsAppToLeadsBulk,
} = require('../controllers/leadController');
const { protect, authorize } = require('../../../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Protect all routes

router.post('/bulk', importLeads);
router.post('/bulk-delete', authorize('Admin', 'Manager'), deleteLeadsBulk);
router.post('/bulk-email', sendEmailToLeadsBulk);
router.post('/bulk-whatsapp', sendWhatsAppToLeadsBulk);

router.route('/')
    .get(getLeads)
    .post(createLead);

router.route('/:id')
    .get(getLead)
    .put(updateLead)
    .delete(authorize('Admin', 'Manager'), deleteLead); // Only Admin/Manager can delete

router.post('/:id/email', sendEmailToLead);

module.exports = router;
