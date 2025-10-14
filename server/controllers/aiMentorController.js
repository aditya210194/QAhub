exports.getAiMentorResponse = async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ error: "Question is required." });
        }

        // Placeholder response
        const response = `AI Mentor Response: ${question}`;

        res.json({ response });
    } catch (error) {
        console.error("Error in AI Mentor Response:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
