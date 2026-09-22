const express = require('express');
const router = express.Router();
const { createLead, updateLeadStatus } = require('./controller');

// POST /leads - Create a new lead
router.post('/leads', createLead);

router.patch('/leads/:id/status', updateLeadStatus);

module.exports = router;