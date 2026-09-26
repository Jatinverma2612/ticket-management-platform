const express = require('express');
const router = express.Router();
const {
  createTicket,
  getTickets,
  getTicketById,
  assignTicket,
  updateTicketStatus,
  updateTicketPriority,
  getTicketActivities,
} = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const commentRoutes = require('./commentRoutes');
const { getCommentsInbox } = require('../controllers/commentController');

// Forward comments sub-route to commentRoutes
router.use('/:id/comments', commentRoutes);

// Base ticket routes
router
  .route('/')
  .post(protect, requireRole('user'), createTicket)
  .get(protect, getTickets);

// Centralized incoming user comments inbox (Admin or Engineer)
router.get(
  '/comments/inbox',
  protect,
  requireRole('admin', 'engineer'),
  getCommentsInbox
);

router.route('/:id').get(protect, getTicketById);

// Admin-specific actions
router.patch('/:id/assign', protect, requireRole('admin'), assignTicket);
router.patch('/:id/priority', protect, requireRole('admin'), updateTicketPriority);

// Status updates (Admin or Assigned Engineer)
router.patch(
  '/:id/status',
  protect,
  requireRole('admin', 'engineer'),
  updateTicketStatus
);

// Ticket activity timeline
router.get('/:id/activities', protect, getTicketActivities);

module.exports = router;
