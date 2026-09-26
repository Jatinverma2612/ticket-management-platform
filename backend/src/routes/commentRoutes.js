const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getComments,
  addComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// All comment routes require authentication
router.use(protect);

// GET /api/tickets/:id/comments and POST /api/tickets/:id/comments
router.route('/').get(getComments).post(addComment);

module.exports = router;
