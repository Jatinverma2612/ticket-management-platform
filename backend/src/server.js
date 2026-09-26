const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Security HTTP headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// Configure CORS - supports FRONTEND_URL, CLIENT_URL, comma-separated values, and local development
const rawFrontendOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

const allowedOrigins = rawFrontendOrigins
  .filter(Boolean)
  .flatMap((originStr) => originStr.split(',').map((url) => url.trim().replace(/\/$/, '')))
  .filter((url, index, self) => self.indexOf(url) === index && url.length > 0);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server health checks)
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/$/, '');
      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Ticket Management Platform API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);

// Centralized error handling
app.use(notFound);
app.use(errorHandler);

const PORT = parseInt(process.env.PORT, 10) || 5000;
const HOST = '0.0.0.0';

// Start server only after database connection succeeds
const startServer = async () => {
  await connectDB();

  app.listen(PORT, HOST, () => {
    console.log(`[Server] Backend running on http://${HOST}:${PORT}`);
    console.log(`[Server] API Base URL: http://${HOST}:${PORT}/api`);
    console.log(`[Server] Configured CORS Origins: ${allowedOrigins.join(', ')}`);
  });
};

startServer();

module.exports = app;
