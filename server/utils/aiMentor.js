const OpenAI = require("openai"); // Make sure to install the OpenAI package using npm

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // Store API Key in environment variables
});

/**
 * Generates an AI response for a mentorship-related query.
 * @param {string} userQuery - The mentee's question.
 * @returns {Promise<string>} - The AI-generated response.
 */
const generateAIResponse = async (userQuery) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4", // You can change to "gpt-3.5-turbo" if needed
            messages: [{ role: "system", content: "You are an AI mentor specializing in software testing and QA automation." },
                { role: "user", content: userQuery }],
            temperature: 0.7
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error("Error generating AI response:", error);
        return "Sorry, I couldn't generate a response. Please try again later.";
    }
};

module.exports = { generateAIResponse };
