// ============================================
// SKYLEAD - BACKEND SERVER
// PPL Arbitrage Platform with Hybrid Payments
// ============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const path = require('path');

// Import core logic
const SCNB = require('./core/NeuralBrain');
const paymentService = require('./services/PaymentService');
const leadDispatcher = require('./services/LeadDispatcher');

// Import routes
const authRoutes = require('./routes/auth');
const leadsRoutes = require('./routes/leads');
const paymentsRoutes = require('./routes/payments');
const analyticsRoutes = require('./routes/analytics');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Neural Brain
SCNB.boot().catch(err => console.error('SCNB Boot Failure:', err));

// ============================================
// MIDDLEWARE
// ============================================

// Security
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "'unsafe-inline'", "unpkg.com", "cdnjs.cloudflare.com"],
            "img-src": ["'self'", "data:", "https:"],
        },
    },
}));

// CORS
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Static files
app.use(express.static(path.join(__dirname)));

// ============================================
// DATABASE CONNECTION
// ============================================

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skylead';
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        // Continue without database for demo purposes
        console.log('⚠️  Running in demo mode without database');
    }
};

connectDB();

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Signup endpoint (simplified for demo)
app.post('/api/signup', async (req, res) => {
    try {
        const { fullName, email, phone, country, paymentMethod, cryptoWallet, bankAccount } = req.body;

        // Validate required fields
        if (!fullName || !email || !phone || !country) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Generate unique user ID
        const userId = 'SKY-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        // Generate tracking link
        const trackingId = Math.random().toString(36).substr(2, 12);
        const trackingLink = `${process.env.BASE_URL || 'https://skylead.io'}/track/${trackingId}`;

        // Create user object
        const user = {
            userId,
            fullName,
            email,
            phone,
            country,
            paymentMethod,
            cryptoWallet: paymentMethod === 'crypto' ? cryptoWallet : null,
            bankAccount: paymentMethod === 'bank' ? bankAccount : null,
            trackingLink,
            trackingId,
            createdAt: new Date(),
            status: 'active',
            earnings: {
                total: 0,
                today: 0,
                thisMonth: 0
            },
            leads: {
                total: 0,
                approved: 0,
                pending: 0,
                rejected: 0
            }
        };

        // Save to database (if connected)
        if (mongoose.connection.readyState === 1) {
            const User = require('./models/User');
            const newUser = new User(user);
            await newUser.save();
        }

        // Send welcome email (implement later)
        // await sendWelcomeEmail(user);

        res.json({
            success: true,
            userId: user.userId,
            trackingLink: user.trackingLink,
            message: 'Account created successfully'
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during signup'
        });
    }
});

// Get live stats including Neural Brain health
app.get('/api/stats/live', async (req, res) => {
    try {
        res.json({
            activePartners: Math.floor(SCNB.metrics.leadsProcessed * 0.1) + 5, // Organic growth based on leads
            paidOutToday: SCNB.metrics.revenueGenerated,
            leadsGenerated: SCNB.metrics.leadsProcessed,
            brainStatus: SCNB.status,
            scalingFactor: SCNB.metrics.scalingFactor,
            activeHeals: SCNB.metrics.activeHeals,
            uptime: SCNB.metrics.uptime,
            pulse: SCNB.metrics.apiPulse,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// Submit lead
app.post('/api/leads/submit', async (req, res) => {
    try {
        const { trackingId, leadData } = req.body;

        if (!trackingId || !leadData) {
            return res.status(400).json({
                success: false,
                message: 'Missing required data'
            });
        }

        // Validate lead data
        const { name, email, phone, category } = leadData;
        if (!name || !email || !phone || !category) {
            return res.status(400).json({
                success: false,
                message: 'Incomplete lead data'
            });
        }

        // 🧠 NEURAL CORE ACTION: Dispatch and Sell Lead
        const dispatchResult = await leadDispatcher.dispatch(leadData);

        if (!dispatchResult.success) {
            return res.status(500).json({
                success: false,
                message: 'Lead processing failed - Brain rerouting...'
            });
        }

        // Create lead object for DB
        const lead = {
            leadId: 'LEAD-' + Math.random().toString(36).substr(2, 12).toUpperCase(),
            trackingId,
            ...leadData,
            payout: dispatchResult.payout,
            status: 'approved', // Auto-approved by Dispatcher/SCNB
            submittedAt: new Date(),
            buyerId: dispatchResult.buyerId
        };

        // Save to database
        if (mongoose.connection.readyState === 1) {
            const Lead = require('./models/Lead');
            const newLead = new Lead(lead);
            await newLead.save();
        }

        res.json({
            success: true,
            leadId: lead.leadId,
            payout: lead.payout,
            status: lead.status,
            buyerId: lead.buyerId,
            message: 'Lead processed and sold by Neural Brain'
        });

    } catch (error) {
        console.error('Lead submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit lead'
        });
    }
});

// Request payout
app.post('/api/payments/payout', async (req, res) => {
    try {
        const { userId, amount, method, address } = req.body;

        if (!userId || !amount || !method) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Validate minimum payout
        if (amount < 10) {
            return res.status(400).json({
                success: false,
                message: 'Minimum payout is $10'
            });
        }

        // Process payout based on method
        let payoutResult;
        if (method === 'crypto') {
            payoutResult = await paymentService.createCryptoPayout(userId, amount, address);
        } else {
            payoutResult = await paymentService.createStripePayout(userId, amount, address);
        }

        res.json({
            success: true,
            transactionId: payoutResult.txId,
            amount,
            method,
            status: 'completed',
            message: 'Payout processed successfully'
        });

    } catch (error) {
        console.error('Payout error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process payout'
        });
    }
});

// ============================================
// PAYMENT PROCESSING FUNCTIONS
// ============================================

async function processCryptoPayout(userId, amount) {
    // Implement crypto payout logic
    // This would integrate with Web3, Solana, etc.
    return {
        transactionId: 'CRYPTO-' + Math.random().toString(36).substr(2, 16).toUpperCase(),
        status: 'processing'
    };
}

async function processBankPayout(userId, amount) {
    // Implement bank transfer logic
    // This would integrate with Stripe, PayPal, etc.
    return {
        transactionId: 'BANK-' + Math.random().toString(36).substr(2, 16).toUpperCase(),
        status: 'processing'
    };
}

// ============================================
// SERVE FRONTEND
// ============================================

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve dashboard (SECURE ADMIN ROUTE)
app.get('/admin-console', (req, res) => {
    // In production, you would check a session or JWT here.
    // For now, we serve it to the requester who knows the secret path.
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource does not exist'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log('');
    console.log('🚀 ============================================');
    console.log('🚀  SKYLEAD PPL ARBITRAGE SYSTEM');
    console.log('🚀 ============================================');
    console.log(`🌐  Server running on: http://localhost:${PORT}`);
    console.log(`📊  API endpoint: http://localhost:${PORT}/api`);
    console.log(`💰  Payment processing: ACTIVE`);
    console.log(`🔐  Security: ENABLED`);
    console.log('🚀 ============================================');
    console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
});

module.exports = app;
