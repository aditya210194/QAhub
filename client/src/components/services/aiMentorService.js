// services/aiMentorService.js
const OpenAI = require("openai");

// Initialize OpenAI with your API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // Make sure this is in your .env file
});

/**
 * Generates an AI response for a mentorship-related query.
 * @param {string} userQuery - The mentee's question.
 * @returns {Promise<string>} - The AI-generated response.
 */
const generateAIResponse = async (userQuery) => {
    try {
        // For now, use fallback responses
        // Later you can integrate OpenAI by uncommenting the code below

        // Check if OpenAI is configured (optional)
        const useOpenAI = false; // Set to true when you have OpenAI API key installed

        if (useOpenAI && process.env.OPENAI_API_KEY) {
            // This is where you'd call OpenAI
            // const OpenAI = require('openai');
            // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            // const response = await openai.chat.completions.create({...});
            // return response.choices[0].message.content;

            // For now, use fallback
            return getFallbackResponse(userQuery);
        }

        // Use intelligent fallback responses
        return getFallbackResponse(userQuery);
    } catch (error) {
        console.error("Error generating AI response:", error);
        return "I'm having trouble generating a response right now. Please try again later or rephrase your question.";
    }
};

// Fallback responses when OpenAI is not available
const getFallbackResponse = (query) => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('automation') || lowerQuery.includes('selenium') || lowerQuery.includes('cypress')) {
        return "For automation testing, I recommend starting with Selenium WebDriver. It's widely used and has great community support. Key frameworks to learn: Selenium, Cypress, Playwright. Would you like to know more about any specific framework?";
    }
    if (lowerQuery.includes('api') || lowerQuery.includes('postman') || lowerQuery.includes('rest')) {
        return "API testing is crucial for modern applications. Tools like Postman, REST Assured, and SoapUI can help. Start with understanding HTTP methods, status codes, authentication, and response validation. Need help with specific API testing concepts?";
    }
    if (lowerQuery.includes('manual')) {
        return "Manual testing requires strong analytical skills. Focus on: \n• Writing clear test cases\n• Understanding requirements thoroughly\n• Exploratory testing techniques\n• Test case design (equivalence partitioning, boundary value analysis)\n• Bug reporting best practices\n\nWhat specific area would you like to explore?";
    }
    if (lowerQuery.includes('performance') || lowerQuery.includes('jmeter') || lowerQuery.includes('load')) {
        return "Performance testing ensures your application can handle expected load. Key concepts:\n• Load Testing\n• Stress Testing\n• Endurance Testing\n• Spike Testing\n• JMeter and LoadRunner tools\n\nStart with JMeter - it's free and powerful. Would you like resources on getting started?";
    }
    if (lowerQuery.includes('security')) {
        return "Security testing is critical. Start with:\n• OWASP Top 10 vulnerabilities\n• SQL Injection prevention\n• Cross-Site Scripting (XSS)\n• CSRF attacks\n• Tools: OWASP ZAP, Burp Suite\n\nWhat security testing topic interests you most?";
    }
    if (lowerQuery.includes('career') || lowerQuery.includes('job') || lowerQuery.includes('salary')) {
        return "Building a career in QA requires:\n• Continuous learning (automation skills)\n• ISTQB certification\n• CI/CD integration knowledge\n• Cloud testing (AWS, Azure)\n• Soft skills and communication\n\nCurrent trends: AI in testing, DevOps, Test Automation.\nWhat specific career questions do you have?";
    }
    if (lowerQuery.includes('interview')) {
        return "Common QA interview topics:\n• Testing methodologies\n• Automation frameworks\n• Bug lifecycle\n• API testing\n• Performance testing basics\n• SQL queries\n• Agile/Scrum\n\nWant me to help you prepare for specific questions?";
    }
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
        return "Hello! I'm your AI Mentor for QA and Testing. I'm here to help with:\n• Automation Testing (Selenium, Cypress, Playwright)\n• Manual Testing Techniques\n• API Testing (Postman, REST Assured)\n• Performance Testing (JMeter)\n• Security Testing\n• Career Advice\n• Interview Preparation\n\nWhat would you like to learn about today?";
    }

    return "That's a great question! I'm your AI mentor for QA and Testing. I can help with:\n\n• Automation Testing - Selenium, Cypress, Playwright\n• Manual Testing - Test cases, exploratory testing\n• API Testing - Postman, REST APIs\n• Performance Testing - JMeter, Load testing\n• Security Testing - OWASP, vulnerabilities\n• Career Development - Certifications, job prep\n\nCould you be more specific about what you'd like to know?";
};

module.exports = { generateAIResponse };