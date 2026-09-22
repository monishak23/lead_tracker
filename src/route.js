const express = require('express');
const router = express.Router();
const { createLead } = require('./controller');

// POST /leads - Create a new lead
router.post('/leads', createLead);

module.exports = router;