// server/config/indexes.js
const mongoose = require('mongoose');

const createIndexes = async () => {
    console.log('🔍 Creating database indexes...');

    try {
        // User Model Indexes
        const User = mongoose.model('User');
        await User.collection.createIndex({ email: 1 }, { unique: true });
        await User.collection.createIndex({ username: 1 }, { unique: true });
        await User.collection.createIndex({ role: 1 });
        await User.collection.createIndex({ createdAt: -1 });
        await User.collection.createIndex({ isActive: 1 });
        console.log('✅ User indexes created');

        // Question Model Indexes
        const Question = mongoose.model('Question');
        await Question.collection.createIndex({ createdAt: -1 });
        await Question.collection.createIndex({ answersCount: -1 });
        await Question.collection.createIndex({ trendingScore: -1 });
        await Question.collection.createIndex({ user: 1, createdAt: -1 });
        await Question.collection.createIndex({ tags: 1 });
        await Question.collection.createIndex({ title: 'text', description: 'text' }); // Text search
        console.log('✅ Question indexes created');

        // Answer Model Indexes
        const Answer = mongoose.model('Answer');
        await Answer.collection.createIndex({ questionId: 1, createdAt: -1 });
        await Answer.collection.createIndex({ questionId: 1, upvotes: -1 });
        await Answer.collection.createIndex({ user: 1 });
        console.log('✅ Answer indexes created');

        // Comment Model Indexes
        const Comment = mongoose.model('Comment');
        await Comment.collection.createIndex({ answerId: 1, createdAt: -1 });
        await Comment.collection.createIndex({ user: 1 });
        console.log('✅ Comment indexes created');

        // Vote Model Indexes
        const Vote = mongoose.model('Vote');
        await Vote.collection.createIndex({ user: 1, answerId: 1 }, { unique: true });
        await Vote.collection.createIndex({ answerId: 1 });
        console.log('✅ Vote indexes created');

        // Message Model Indexes
        const Message = mongoose.model('Message');
        await Message.collection.createIndex({ discussionId: 1, createdAt: 1 });
        console.log('✅ Message indexes created');

        // Discussion Model Indexes
        const Discussion = mongoose.model('Discussion');
        await Discussion.collection.createIndex({ createdAt: -1 });
        await Discussion.collection.createIndex({ author: 1 });
        console.log('✅ Discussion indexes created');

        // Mentor/Mentee Application Indexes
        const MentorApplication = mongoose.model('MentorApplication');
        await MentorApplication.collection.createIndex({ userId: 1, status: 1 });
        await MentorApplication.collection.createIndex({ status: 1, createdAt: -1 });
        console.log('✅ MentorApplication indexes created');

        const MenteeApplication = mongoose.model('MenteeApplication');
        await MenteeApplication.collection.createIndex({ userId: 1, status: 1 });
        await MenteeApplication.collection.createIndex({ status: 1, createdAt: -1 });
        console.log('✅ MenteeApplication indexes created');

        // AiConversation Indexes
        const AiConversation = mongoose.model('AiConversation');
        await AiConversation.collection.createIndex({ userId: 1 });
        await AiConversation.collection.createIndex({ updatedAt: -1 });
        console.log('✅ AiConversation indexes created');

        console.log('🎉 All database indexes created successfully!');

    } catch (error) {
        console.error('❌ Error creating indexes:', error);
    }
};

module.exports = createIndexes;