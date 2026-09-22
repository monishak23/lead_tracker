const express = require('express');
const router = express.Router();
const { createLead, updateLeadStatus, getLeads} = require('./controller');

// POST /leads - Create a new lead
router.post('/leads', createLead);

router.patch('/leads/:id/status', updateLeadStatus);

router.get('/leads', getLeads);

module.exports = router;