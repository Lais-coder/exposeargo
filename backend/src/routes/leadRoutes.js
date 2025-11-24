const express = require('express');
const router = express.Router();
const { createLead } = require('../controllers/leadController');
const validateInput = require('../middleware/validateInput');

router.post('/', validateInput, createLead);

module.exports = router;
