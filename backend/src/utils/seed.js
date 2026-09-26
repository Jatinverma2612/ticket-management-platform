/**
 * ============================================================================
 * DEVELOPMENT DATABASE SEED SCRIPT
 * ============================================================================
 * 
 * SAFETY WARNING & USAGE:
 * Running `npm run seed` completely resets development data:
 * - Clears all existing Users, Tickets, Comments, and TicketActivity records.
 * - Seeds fresh demo accounts (Admin, Engineers, User) and initial sample data.
 * - Intended ONLY for local development and demonstration purposes.
 * - DO NOT run in production environments.
 * 
 * Demo Credentials Created:
 * - Admin:    admin@example.com     / AdminPassword123!
 * - Engineer: engineer1@example.com / EngineerPassword123!
 * - Engineer: engineer2@example.com / EngineerPassword123!
 * - User:     user@example.com      / UserPassword123!
 * ============================================================================
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');
const TicketActivity = require('../models/TicketActivity');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables.');
    }

    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');

    // Clear existing collections
    await User.deleteMany({});
    await Ticket.deleteMany({});
    await Comment.deleteMany({});
    await TicketActivity.deleteMany({});
    console.log('[Seed] Cleared existing data');

    // Create demo users (passwords will be hashed via User pre-save hook)
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@example.com',
      password: 'AdminPassword123!',
      role: 'admin',
      isAvailable: true,
    });

    const engineer1 = await User.create({
      name: 'Sarah Connor (Senior Engineer)',
      email: 'engineer1@example.com',
      password: 'EngineerPassword123!',
      role: 'engineer',
      isAvailable: true,
    });

    const engineer2 = await User.create({
      name: 'Alex Murphy (Support Engineer)',
      email: 'engineer2@example.com',
      password: 'EngineerPassword123!',
      role: 'engineer',
      isAvailable: true,
    });

    const user = await User.create({
      name: 'Alice Johnson',
      email: 'user@example.com',
      password: 'UserPassword123!',
      role: 'user',
      isAvailable: true,
    });

    console.log('[Seed] Demo users created:');
    console.log(' - Admin:    admin@example.com / AdminPassword123!');
    console.log(' - Engineer: engineer1@example.com / EngineerPassword123!');
    console.log(' - Engineer: engineer2@example.com / EngineerPassword123!');
    console.log(' - User:     user@example.com / UserPassword123!');

    // Create initial sample ticket created by User
    const sampleTicket = await Ticket.create({
      title: 'Database connection timeout under heavy load',
      description: 'The backend service intermittently fails to acquire connection pool sockets during peak traffic hours.',
      category: 'Infrastructure',
      priority: 'High',
      status: 'Assigned',
      createdBy: user._id,
      assignedTo: engineer1._id,
    });

    // Record activities
    await TicketActivity.create({
      ticket: sampleTicket._id,
      user: user._id,
      action: 'Ticket created',
      oldValue: null,
      newValue: sampleTicket.title,
    });

    await TicketActivity.create({
      ticket: sampleTicket._id,
      user: admin._id,
      action: 'Ticket assigned',
      oldValue: 'Unassigned',
      newValue: engineer1.name,
    });

    await TicketActivity.create({
      ticket: sampleTicket._id,
      user: admin._id,
      action: 'Status changed',
      oldValue: 'Open',
      newValue: 'Assigned',
    });

    // Add an initial comment
    const sampleComment = await Comment.create({
      ticket: sampleTicket._id,
      user: engineer1._id,
      message: 'Investigating MongoDB connection pool limits. Will update shortly.',
    });

    await TicketActivity.create({
      ticket: sampleTicket._id,
      user: engineer1._id,
      action: 'Comment added',
      oldValue: null,
      newValue: sampleComment.message,
    });

    console.log(`[Seed] Seeded sample ticket with ID: ${sampleTicket._id}`);
    console.log('[Seed] Database seeding completed successfully.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
