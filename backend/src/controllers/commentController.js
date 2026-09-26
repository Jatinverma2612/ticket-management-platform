const Comment = require('../models/Comment');
const Ticket = require('../models/Ticket');
const TicketActivity = require('../models/TicketActivity');
const User = require('../models/User');

// @desc    Get comments for a ticket
// @route   GET /api/tickets/:id/comments
// @access  Private
const getComments = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    // Authorization check
    if (req.user.role === 'user') {
      if (ticket.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to view comments for this ticket',
        });
      }
    } else if (req.user.role === 'engineer') {
      if (
        !ticket.assignedTo ||
        ticket.assignedTo.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to view comments for this ticket',
        });
      }
    }

    const comments = await Comment.find({ ticket: req.params.id })
      .populate('user', '_id name email role')
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      message: 'Comments retrieved successfully',
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a comment to a ticket
// @route   POST /api/tickets/:id/comments
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment message cannot be empty.',
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    // Authorization check
    if (req.user.role === 'user') {
      if (ticket.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to comment on this ticket',
        });
      }
    } else if (req.user.role === 'engineer') {
      if (
        !ticket.assignedTo ||
        ticket.assignedTo.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to comment on this ticket',
        });
      }
    }

    const comment = await Comment.create({
      ticket: ticket._id,
      user: req.user._id,
      message: message.trim(),
    });

    // Create activity record for comment addition
    const previewMessage =
      message.trim().length > 60
        ? message.trim().substring(0, 57) + '...'
        : message.trim();

    await TicketActivity.create({
      ticket: ticket._id,
      user: req.user._id,
      action: 'Comment added',
      oldValue: null,
      newValue: previewMessage,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      'user',
      '_id name email role'
    );

    return res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: populatedComment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent incoming user comments on authorized tickets
// @route   GET /api/tickets/comments/inbox
// @access  Private (Admin or Engineer)
const getCommentsInbox = async (req, res, next) => {
  try {
    let ticketFilter = {};

    if (req.user.role === 'engineer') {
      ticketFilter = { assignedTo: req.user._id };
    } else if (req.user.role === 'admin') {
      ticketFilter = {};
    } else {
      return res.status(403).json({
        success: false,
        message: 'Only administrators and engineers can access the comments inbox.',
      });
    }

    const tickets = await Ticket.find(ticketFilter).select('_id title status priority');
    const ticketIds = tickets.map((t) => t._id);

    // Filter to standard users (exclude engineer/admin responses)
    const standardUsers = await User.find({ role: 'user' }).select('_id');
    const standardUserIds = standardUsers.map((u) => u._id);

    const comments = await Comment.find({
      ticket: { $in: ticketIds },
      user: { $in: standardUserIds },
    })
      .populate('user', '_id name email role')
      .populate('ticket', '_id title status priority')
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getComments,
  addComment,
  getCommentsInbox,
};
