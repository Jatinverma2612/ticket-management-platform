const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: 'Priority must be Low, Medium, or High',
      },
      default: 'Medium',
    },
    status: {
      type: String,
      enum: {
        values: ['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
        message: 'Status must be Open, Assigned, In Progress, Resolved, or Closed',
      },
      default: 'Open',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Ticket creator is required'],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Validate that status cannot be 'Assigned' without an assigned engineer
ticketSchema.pre('validate', function (next) {
  if (this.status === 'Assigned' && !this.assignedTo) {
    this.invalidate(
      'status',
      'A ticket cannot have status "Assigned" without an assigned engineer.'
    );
  }
  next();
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
