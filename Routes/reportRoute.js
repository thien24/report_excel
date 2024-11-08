const express = require('express');
const router = express.Router();
const { generateExcelReport } = require('../controllers/reportController');

router.get('/report', generateExcelReport);

module.exports = router;
