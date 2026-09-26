const express = require('express');
const router = express.Router();
const { getEngineers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// Admin-only route to get list of engineers
router.get('/engineers', protect, requireRole('admin'), getEngineers);

module.exports = router;
