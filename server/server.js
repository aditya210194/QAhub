// ==================== ENVIRONMENT CONFIGURATION ====================
require('dotenv').config({
    path: `.env.${process.env.NODE_ENV || 'development'}`
});

// ==================== CORE DEPENDENCIES ====================
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// ==================== DATABASE ====================
const connectDB = require('./config/db');
const createIndexes = require('./config/indexes');

// ==================== SOCKET.IO ====================
const socketIo = require('socket.io');
const Discussion = require('./models/Discussion');
const Message = require('./models/Message');

// ==================== CRON JOBS ====================
const cron = require('node-cron');
const calculateTrendingScore = require('./cron/trendingScore');

// ==================== MIDDLEWARE ====================
const { cacheMiddleware, clearCache } = require('./middleware/cache');

// ==================== ROUTES ====================
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contactRoutes');
const messageRoutes = require('./routes/messageRoutes');
const discussionRoutes = require('./routes/discussionRoutes');
const profileRoute = require('./routes/profileRoutes');
const qaRoutes = require('./routes/qaRoutes');
const adminRoutes = require('./routes/adminRoutes');
const mentorshipRoutes = require('./routes/mentorshipRoutes');
const aiMentorRoutes = require('./routes/aiMentorRoutes');
const userRoutes = require('./routes/userRoutes');

// ==================== INITIALIZE APP ====================
const app = express();
const port = process.env.PORT || 5000;
app.set('trust proxy', 1);

// ==================== CREATE HTTP SERVER ====================
const server = http.createServer(app);

// ==================== SOCKET.IO CONFIGURATION ====================
const io = socketIo(server, {
    cors: {
        origin: [
            "https://qahub.co.in",
            "https://www.qahub.co.in",
            "http://localhost:3000"
        ],
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ["websocket", "polling"]
});

// Set Socket.IO instance in mentorship controller
const { setSocketIO } = require('./controllers/mentorshipController');
setSocketIO(io);

// ==================== DATABASE CONNECTION & INDEXES ====================
connectDB().then(async () => {
    console.log('✅ Database connected successfully');

    // Create database indexes for performance
    await createIndexes();
    console.log('✅ Database indexes created');

    // Schedule trending score calculation every hour
    cron.schedule('0 * * * *', async () => {
        console.log('⏰ Running trending score calculation...');
        try {
            await calculateTrendingScore();
            console.log('✅ Trending scores updated successfully');
        } catch (error) {
            console.error('❌ Error calculating trending scores:', error);
        }
    });

    // Immediate test in development
    if (process.env.NODE_ENV === 'development') {
        await calculateTrendingScore();
        console.log('🔬 Development trending score calculation complete');
    }
}).catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
});

// ==================== GLOBAL MIDDLEWARE ====================
// Security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
        },
    },
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging (skip in test environment)
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

// Cookie parser
app.use(cookieParser());

// ==================== CORS CONFIGURATION ====================
const allowedOrigins = [
    'https://qahub.co.in',
    'https://www.qahub.co.in',
    'http://localhost:3000',
    'https://api.qahub.co.in'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Handle preflight requests
app.options('*', cors());

// ==================== RATE LIMITING ====================
// General API rate limiter
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter limiter for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    skipSuccessfulRequests: true,
    message: 'Too many attempts, please try again later.',
});

// Question-specific limiter
const questionLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: process.env.NODE_ENV === 'production' ? 50 : 200,
    message: 'Too many questions from this IP, please try again later.',
    handler: (req, res) => {
        console.log(`⚠️ Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({ error: 'Too many questions, please try again later.' });
    },
    keyGenerator: (req) => req.ip,
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply rate limiting
app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/qa', questionLimiter);

// ==================== STATIC FILES ====================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==================== HEALTH CHECK ====================
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.get('/', (req, res) => {
    res.send('API is working!');
});

// ==================== CLEAR CACHE ENDPOINT (Admin only) ====================
app.post('/api/admin/clear-cache', (req, res) => {
    // In production, add admin authentication here
    clearCache();
    res.json({ message: 'Cache cleared successfully' });
});

// ==================== ROUTES ====================
// Public routes
app.use('/api', contactRoutes);
app.use('/api', discussionRoutes);
app.use('/api', messageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', profileRoute);

// QA Routes
app.use('/api/qa', qaRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

// User routes
app.use('/api/users', userRoutes);

// Mentorship routes
app.use('/api/mentorship', mentorshipRoutes);

// AI Mentor routes
app.use('/api/ai-mentor', aiMentorRoutes);

// ==================== DEBUG ROUTES (Development only) ====================
if (process.env.NODE_ENV === 'development') {
    console.log('\n📋 Registered Routes:');
    const routes = [];
    app._router.stack.forEach((r) => {
        if (r.route && r.route.path) {
            routes.push(`${Object.keys(r.route.methods)} ${r.route.path}`);
        } else if (r.name === 'router') {
            r.handle.stack.forEach((subRoute) => {
                if (subRoute.route) {
                    routes.push(`${Object.keys(subRoute.route.methods)} ${subRoute.route.path}`);
                }
            });
        }
    });
    routes.sort().forEach(route => console.log(`  ${route}`));
    console.log(`\n✅ Total routes: ${routes.length}\n`);
}

// ==================== ERROR HANDLING ====================
// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : 'Something went wrong!';
    res.status(statusCode).json({ error: message });
});

// ==================== SOCKET.IO EVENT HANDLERS ====================
io.on('connection', (socket) => {
    console.log('✅ Socket connected:', socket.id);
    socket.join(socket.id);

    // New Discussion
    socket.on('new-discussion', async (discussion) => {
        try {
            const newDiscussion = new Discussion(discussion);
            await newDiscussion.save();
            io.emit('new-discussion', newDiscussion);
        } catch (error) {
            console.error('Error saving new discussion:', error);
            socket.emit('error', { message: 'Failed to create discussion' });
        }
    });

    // Messages
    socket.on('sendMessage', async (messageData) => {
        try {
            const newMessage = new Message({
                discussionId: messageData.discussionId,
                sender: messageData.sender,
                text: messageData.text,
            });
            await newMessage.save();
            io.to(messageData.discussionId).emit('receiveMessage', newMessage);
        } catch (error) {
            console.error('Error saving message:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    // Join discussion room
    socket.on('joinDiscussion', (discussionId) => {
        socket.join(discussionId);
        console.log(`Socket ${socket.id} joined discussion ${discussionId}`);
    });

    socket.on('disconnect', () => {
        console.log('❌ Socket disconnected:', socket.id);
    });
});

// ==================== START SERVER ====================
server.listen(port, '0.0.0.0', () => {
    console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}                         ║
║   📡 API: http://localhost:${port}                                            ║
║   🔌 WebSocket: enabled                                                      ║
║   💾 Cache: enabled (TTL: 5 minutes)                                         ║
║   🔒 Rate limiting: enabled                                                  ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
    `);
});

// ==================== GRACEFUL SHUTDOWN ====================
const shutdown = async () => {
    console.log('🛑 Shutting down gracefully...');
    server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
        console.error('⚠️ Force closing after timeout');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('💥 Uncaught Exception:', err);
    shutdown();
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection:', reason);
    shutdown();
});