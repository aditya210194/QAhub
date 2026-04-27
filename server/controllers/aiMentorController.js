// controllers/aiMentorController.js
const { generateAIResponse } = require('../services/aiMentorService');
const AiConversation = require('../models/AiConversation');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/ai-mentor';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain',
                          'application/json', 'text/javascript', 'text/html', 'text/css'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images, PDFs, and text files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: fileFilter
}).array('files', 5); // Allow up to 5 files

// Original AI mentor response endpoint (without files)
exports.getAiMentorResponse = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: 'Question is required.' });
        }

        console.log('AI Mentor question:', question);

        // Save user message to conversation
        let conversation = await AiConversation.findOne({ userId: req.user.id });
        if (!conversation) {
            conversation = new AiConversation({ userId: req.user.id, messages: [] });
        }

        conversation.messages.push({
            role: 'user',
            content: question,
            timestamp: new Date()
        });

        const response = await generateAIResponse(question);

        conversation.messages.push({
            role: 'assistant',
            content: response,
            timestamp: new Date()
        });

        conversation.updatedAt = new Date();
        await conversation.save();

        res.json({
            response,
            conversationId: conversation._id,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in AI Mentor Response:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// New endpoint for AI mentor response with file uploads
exports.getAiMentorResponseWithFiles = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('File upload error:', err);
            return res.status(400).json({ error: err.message });
        }

        try {
            const { question } = req.body;
            const files = req.files || [];

            if (!question && files.length === 0) {
                return res.status(400).json({ error: 'Question or files are required.' });
            }

            console.log('AI Mentor question with files:', question);
            console.log('Files uploaded:', files.map(f => f.originalname));

            // Process uploaded files
            const processedFiles = files.map(file => ({
                name: file.originalname,
                type: file.mimetype.split('/')[0],
                size: file.size,
                path: file.path,
                mimeType: file.mimetype
            }));

            // Extract content from files if they are text files
            let fileContents = [];
            for (const file of files) {
                if (file.mimetype === 'text/plain' || file.mimetype === 'application/json' ||
                    file.mimetype === 'text/javascript' || file.mimetype === 'text/html' ||
                    file.mimetype === 'text/css') {
                    const content = fs.readFileSync(file.path, 'utf8');
                    fileContents.push({
                        name: file.originalname,
                        content: content.substring(0, 5000) // Limit content length
                    });
                }
            }

            // Save user message with attachments to conversation
            let conversation = await AiConversation.findOne({ userId: req.user.id });
            if (!conversation) {
                conversation = new AiConversation({ userId: req.user.id, messages: [] });
            }

            conversation.messages.push({
                role: 'user',
                content: question || (files.length > 0 ? `[Uploaded ${files.length} file(s)]` : ''),
                attachments: processedFiles,
                timestamp: new Date()
            });

            // Generate AI response with file context
            let enhancedQuestion = question;
            if (fileContents.length > 0) {
                enhancedQuestion = question + '\n\nUploaded files content:\n' +
                    fileContents.map(fc => `--- ${fc.name} ---\n${fc.content}`).join('\n\n');
            }

            const response = await generateAIResponse(enhancedQuestion);

            conversation.messages.push({
                role: 'assistant',
                content: response,
                timestamp: new Date()
            });

            conversation.updatedAt = new Date();
            await conversation.save();

            res.json({
                response,
                attachments: processedFiles,
                conversationId: conversation._id,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error in AI Mentor Response with Files:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
};

// Get conversation history
exports.getAiConversation = async (req, res) => {
    try {
        const conversation = await AiConversation.findOne({ userId: req.user.id });
        if (!conversation) {
            return res.json({ messages: [] });
        }
        res.json({ messages: conversation.messages });
    } catch (error) {
        console.error('Error fetching conversation:', error);
        res.status(500).json({ error: 'Failed to fetch conversation' });
    }
};

// Delete conversation history
exports.deleteAiConversation = async (req, res) => {
    try {
        await AiConversation.findOneAndDelete({ userId: req.user.id });
        res.json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        console.error('Error deleting conversation:', error);
        res.status(500).json({ error: 'Failed to delete conversation' });
    }
};