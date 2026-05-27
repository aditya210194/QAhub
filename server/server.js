require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
});
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contactRoutes');
const messageRoutes = require('./routes/messageRoutes');
const Discussion = require('./models/Discussion'); // <-- Add this import
const Message = require('./models/Message');
const profileRoute = require('./routes/profileRoutes'); // Import the profile route
const qaRoutes = require('./routes/qaRoutes');
const adminRoutes = require("./routes/adminRoutes");
const mentorshipRoutes = require("./routes/mentorshipRoutes");
//const { setSocketIO } = require('./controllers/mentorshipController');
const aiMentorRoutes = require("./routes/aiMentorRoutes");
const userRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const calculateTrendingScore = require('./cron/trendingScore');
const path = require('path');

let requestCounts = {}; // Store request counts per IP
const app = express();
const port = process.env.PORT || 5000;
app.set('trust proxy', 1);
// Create HTTP server and integrate Socket.io
const server = http.createServer(app);
//setSocketIO(io);
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
const { setSocketIO } = require('./controllers/mentorshipController');
setSocketIO(io);

// Connect to MongoDB

connectDB().then(() => {
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
        calculateTrendingScore().then(() =>
            console.log('🔬 Development trending score calculation complete')
        );
    }
});


// Middleware
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined'));
app.use(cookieParser()); // Required for accessing cookies
// CORS setup
// ✅ Apply CORS **before** defining routes
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = ['https://qahub.co.in', 'https://www.qahub.co.in', 'http://localhost:3000', 'https://api.qahub.co.in'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// ✅ Explicitly set CORS headers for all OPTIONS requests



const questionLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
   max: process.env.NODE_ENV === 'production' ? 200 : 1000, // Limit each IP to 5 requests per windowMs
    message: 'Too many questions from this IP, please try again later.',
    handler: (req, res, next) => {
        console.log(`Rate limit exceeded for IP: ${req.ip}. Requests made: ${req.rateLimit.current}.`);
        res.status(429).json({ error: 'Too many questions from this IP, please try again later.' });
    },
    keyGenerator: (req) => req.ip, // Uses the IP address as the identifier
    standardHeaders: true, // Adds `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
});
app.use('/api/qa', (req, res, next) => {
    console.log(`Request from IP: ${req.ip}`);
    next();
});
app.use('/api/qa', questionLimiter);


// Routes
app.use('/api', contactRoutes);
app.use('/api', require('./routes/discussionRoutes'));
app.use('/api', messageRoutes);
app.use('/api/auth', authRoutes);
// Use the profile route
app.use('/api', profileRoute);
app.use('/api/qa', qaRoutes);
app.get("/", (req, res) => {
    res.send("API is working!");
});
app.use("/api/admin", adminRoutes);
app.use('/api/users', userRoutes);
app.use("/api/mentorship", mentorshipRoutes);
app.use("/api/ai-mentor", aiMentorRoutes);
// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Health Check Route
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

console.log(app._router.stack); // Print all registered routes


// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : 'Something went wrong!';
    res.status(statusCode).json({ error: message });
});

// Socket.io event listeners
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

            socket
                .to(messageData.discussionId)
                .emit('receiveMessage', newMessage);

        } catch (error) {

            console.error('Error saving message:', error);

        }

    });

    socket.on('disconnect', () => {

        console.log('❌ Socket disconnected:', socket.id);

    });

});

// Start server
server.listen(port, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});
