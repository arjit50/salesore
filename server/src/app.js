const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { protect } = require('./middleware/authMiddleware');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

// Basic Route
app.get('/', (req, res) => {
    res.send('Salesor API is running...');
});

// Routes
app.use('/auth', require('./modules/auth/routes/authRoutes'));

// Protect all routes below this line
app.use(protect);

app.use('/leads', require('./modules/leads/routes/leadRoutes'));
app.use('/analytics', require('./modules/analytics/routes/analyticsRoutes'));
app.use('/customers', require('./modules/customers/routes/customerRoutes'));
app.use('/billing', require('./modules/billing/routes/billingRoutes'));
app.use('/notifications', require('./modules/notifications/routes/notificationRoutes'));

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

module.exports = app;
