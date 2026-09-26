const Ticket = require('../models/Ticket');
const TicketActivity = require('../models/TicketActivity');
const User = require('../models/User');

// Allowed status lifecycle: Open -> Assigned -> In Progress -> Resolved -> Closed
const ALLOWED_TRANSITIONS = {
  Open: ['Assigned'],
  Assigned: ['In Progress'],
  'In Progress': ['Resolved'],
  Resolved: ['Closed'],
  Closed: [],
};

// @desc    Create a new ticket
// @route   POST /api/tickets
// @access  Private/User
const createTicket = async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and category.',
      });
    }

    const validPriorities = ['Low', 'Medium', 'High'];
    const selectedPriority = priority || 'Medium';

    if (!validPriorities.includes(selectedPriority)) {
      return res.status(400).json({
        success: false,
        message: 'Priority must be Low, Medium, or High.',
      });
    }

    const ticket = await Ticket.create({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      priority: selectedPriority,
      status: 'Open',
      createdBy: req.user._id,
      assignedTo: null,
    });

    // Create "Ticket created" activity
    await TicketActivity.create({
      ticket: ticket._id,
      user: req.user._id,
      action: 'Ticket created',
      oldValue: null,
      newValue: ticket.title,
    });

    const populatedTicket = await Ticket.findById(ticket._id).populate(
      'createdBy',
      '_id name email role'
    );

    return res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: populatedTicket,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tickets accessible by the authenticated user
// @route   GET /api/tickets
// @access  Private
const getTickets = async (req, res, next) => {
  try {
    let filter = {};

    if (req.user.role === 'user') {
      // User can only see tickets they created
      filter.createdBy = req.user._id;
    } else if (req.user.role === 'engineer') {
      // Engineer can only see tickets assigned to them
      filter.assignedTo = req.user._id;
    }
    // Admin sees all tickets (empty filter)

    const tickets = await Ticket.find(filter)
      .populate('createdBy', '_id name email role')
      .populate('assignedTo', '_id name email role isAvailable')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Tickets retrieved successfully',
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single ticket details and activity timeline
// @route   GET /api/tickets/:id
// @access  Private
const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', '_id name email role')
      .populate('assignedTo', '_id name email role isAvailable');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    // Role-based access validation
    if (req.user.role === 'user') {
      if (ticket.createdBy._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to access this ticket',
        });
      }
    } else if (req.user.role === 'engineer') {
      if (
        !ticket.assignedTo ||
        ticket.assignedTo._id.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to access this ticket',
        });
      }
    }
    // Admin is authorized to access any ticket

    // Fetch activity history
    const activities = await TicketActivity.find({ ticket: ticket._id })
      .populate('user', '_id name email role')
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      message: 'Ticket retrieved successfully',
      data: {
        ticket,
        activities,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign engineer to a ticket
// @route   PATCH /api/tickets/:id/assign
// @access  Private/Admin
const assignTicket = async (req, res, next) => {
  try {
    const { engineerId } = req.body;

    if (!engineerId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide engineerId to assign.',
      });
    }

    const engineer = await User.findById(engineerId);
    if (!engineer || engineer.role !== 'engineer') {
      return res.status(400).json({
        success: false,
        message: 'Target user is not an active engineer.',
      });
    }

    const ticket = await Ticket.findById(req.params.id).populate(
      'assignedTo',
      'name'
    );
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    const previousAssigneeName = ticket.assignedTo
      ? ticket.assignedTo.name
      : 'Unassigned';

    // Assign engineer
    ticket.assignedTo = engineer._id;

    // When a ticket is assigned, its status becomes "Assigned"
    const previousStatus = ticket.status;
    ticket.status = 'Assigned';

    await ticket.save();

    // Log assignment activity
    await TicketActivity.create({
      ticket: ticket._id,
      user: req.user._id,
      action: 'Ticket assigned',
      oldValue: previousAssigneeName,
      newValue: engineer.name,
    });

    // If status changed to Assigned, log that activity as well
    if (previousStatus !== ticket.status) {
      await TicketActivity.create({
        ticket: ticket._id,
        user: req.user._id,
        action: 'Status changed',
        oldValue: previousStatus,
        newValue: ticket.status,
      });
    }

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('createdBy', '_id name email role')
      .populate('assignedTo', '_id name email role isAvailable');

    return res.status(200).json({
      success: true,
      message: `Ticket successfully assigned to ${engineer.name}`,
      data: updatedTicket,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket status following lifecycle
// @route   PATCH /api/tickets/:id/status
// @access  Private (Admin or Assigned Engineer)
const updateTicketStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status to update.',
      });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    // Role authorization
    if (req.user.role === 'engineer') {
      // Engineers can only update tickets assigned to them
      if (
        !ticket.assignedTo ||
        ticket.assignedTo.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: 'You are only authorized to update tickets assigned to you.',
        });
      }

      // Closing tickets is an administrative action
      if (status === 'Closed') {
        return res.status(403).json({
          success: false,
          message: 'Only administrators can close tickets.',
        });
      }
    } else if (req.user.role !== 'admin') {
      // Users cannot change ticket status directly
      return res.status(403).json({
        success: false,
        message: 'Access denied: insufficient permissions to update ticket status.',
      });
    }

    // Enforce logical lifecycle transitions
    const allowedNext = ALLOWED_TRANSITIONS[ticket.status] || [];
    if (!allowedNext.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from "${ticket.status}" to "${status}". Allowed transition(s): ${
          allowedNext.length > 0 ? allowedNext.join(', ') : 'None (Ticket is Closed)'
        }.`,
      });
    }

    // Enforce that status cannot become "Assigned" without an assigned engineer
    if (status === 'Assigned' && !ticket.assignedTo) {
      return res.status(400).json({
        success: false,
        message: 'Cannot set ticket status to "Assigned" without an assigned engineer. Please assign an engineer first.',
      });
    }

    const previousStatus = ticket.status;
    ticket.status = status;
    await ticket.save();

    // Log activity
    const action = status === 'Resolved' ? 'Ticket resolved' : 'Status changed';
    await TicketActivity.create({
      ticket: ticket._id,
      user: req.user._id,
      action,
      oldValue: previousStatus,
      newValue: status,
    });

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('createdBy', '_id name email role')
      .populate('assignedTo', '_id name email role isAvailable');

    return res.status(200).json({
      success: true,
      message: `Ticket status updated to ${status}`,
      data: updatedTicket,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket priority
// @route   PATCH /api/tickets/:id/priority
// @access  Private/Admin
const updateTicketPriority = async (req, res, next) => {
  try {
    const { priority } = req.body;

    const validPriorities = ['Low', 'Medium', 'High'];
    if (!priority || !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid priority. Must be Low, Medium, or High.',
      });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    const previousPriority = ticket.priority;
    if (previousPriority === priority) {
      return res.status(200).json({
        success: true,
        message: `Priority is already ${priority}`,
        data: ticket,
      });
    }

    ticket.priority = priority;
    await ticket.save();

    // Log activity
    await TicketActivity.create({
      ticket: ticket._id,
      user: req.user._id,
      action: 'Priority changed',
      oldValue: previousPriority,
      newValue: priority,
    });

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('createdBy', '_id name email role')
      .populate('assignedTo', '_id name email role isAvailable');

    return res.status(200).json({
      success: true,
      message: `Ticket priority updated to ${priority}`,
      data: updatedTicket,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get activity timeline for a ticket
// @route   GET /api/tickets/:id/activities
// @access  Private
const getTicketActivities = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    // Role access check
    if (req.user.role === 'user') {
      if (ticket.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to view activities for this ticket',
        });
      }
    } else if (req.user.role === 'engineer') {
      if (
        !ticket.assignedTo ||
        ticket.assignedTo.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to view activities for this ticket',
        });
      }
    }

    const activities = await TicketActivity.find({ ticket: ticket._id })
      .populate('user', '_id name email role')
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      message: 'Ticket activities retrieved successfully',
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  assignTicket,
  updateTicketStatus,
  updateTicketPriority,
  getTicketActivities,
};
