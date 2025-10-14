const Question = require("../models/Question");
const logger = require("../utils/logger"); // Assuming you have a logger

const calculateTrendingScore = async () => {
    try {
        const questions = await Question.find().populate("answers");
        const now = Date.now();

        for (const question of questions) {
            const hoursSinceCreation = (now - question.createdAt) / (1000 * 3600);
            const engagement = (question.answersCount * 2) + question.votes;

            // Reddit's hot ranking algorithm variation
            const gravity = 1.5;
            const trendingScore = engagement / Math.pow(hoursSinceCreation + 2, gravity);

            await Question.findByIdAndUpdate(question._id, { trendingScore });
        }

        logger.info("Successfully updated trending scores");
    } catch (error) {
        logger.error("Error calculating trending scores:", error);
    }
};

module.exports = calculateTrendingScore;