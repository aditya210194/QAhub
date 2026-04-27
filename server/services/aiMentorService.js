// services/aiMentorService.js
const Groq = require('groq-sdk');

// Initialize Groq
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const generateAIResponse = async (userQuery) => {
    try {
        if (!process.env.GROQ_API_KEY) {
            return getFallbackResponse(userQuery);
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an expert QA mentor with 10+ years of experience in software testing.
You provide detailed, practical, and actionable advice.

When responding:
1. Use proper formatting with bullet points, code blocks, and clear sections
2. Include real code examples when relevant (Python, JavaScript, Java)
3. Explain concepts thoroughly but concisely
4. Provide best practices and common pitfalls to avoid
5. Be encouraging and supportive
6. Format code blocks with language specification (python,javascript, etc.)

Your expertise covers:
- Automation Testing (Selenium, Cypress, Playwright)
- Manual Testing Techniques
- API Testing (Postman, REST Assured)
- Performance Testing (JMeter, LoadRunner)
- Security Testing (OWASP, penetration testing)
- Test Management (TestRail, JIRA)
- CI/CD Integration (Jenkins, GitHub Actions)
- Career Development and Interview Preparation`
                },
                {
                    role: "user",
                    content: userQuery
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 2000, // Increased for better responses
        });

        return chatCompletion.choices[0]?.message?.content || getFallbackResponse(userQuery);

    } catch (error) {
        console.error('Error:', error.message);
        return getFallbackResponse(userQuery);
    }
};

// Fallback responses (keep existing)
const getFallbackResponse = (query) => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('automation') || lowerQuery.includes('selenium') || lowerQuery.includes('cypress')) {
        return "For automation testing, I recommend starting with Selenium WebDriver. It's widely used and has great community support. Key frameworks to learn: Selenium, Cypress, Playwright. Would you like to know more about any specific framework?";
    }
    if (lowerQuery.includes('api') || lowerQuery.includes('postman') || lowerQuery.includes('rest')) {
        return "API testing is crucial for modern applications. Tools like Postman, REST Assured, and SoapUI can help. Start with understanding HTTP methods, status codes, authentication, and response validation. Need help with specific API testing concepts?";
    }
    if (lowerQuery.includes('manual')) {
        return "Manual testing requires strong analytical skills. Focus on:\n• Writing clear test cases\n• Understanding requirements thoroughly\n• Exploratory testing techniques\n• Test case design (equivalence partitioning, boundary value analysis)\n• Bug reporting best practices\n\nWhat specific area would you like to explore?";
    }
    if (lowerQuery.includes('code') || lowerQuery.includes('review') || lowerQuery.includes('bug')) {
        return "I see you're sharing code! For code review, I look for:\n• Code readability and naming conventions\n• Error handling\n• Test coverage\n• Performance considerations\n• Security vulnerabilities\n\nIf you'd like specific feedback, please share more context about what you're trying to accomplish.";
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
        return "Hello! I'm your AI Mentor for QA and Testing. I'm here to help with:\n• Automation Testing (Selenium, Cypress, Playwright)\n• Manual Testing Techniques\n• API Testing (Postman, REST Assured)\n• Performance Testing (JMeter)\n• Security Testing\n• Career Advice\n• Interview Preparation\n• Code Review\n\nWhat would you like to learn about today?";
    }

    return "That's a great question! I'm your AI mentor for QA and Testing. I can help with:\n\n• Automation Testing - Selenium, Cypress, Playwright\n• Manual Testing - Test cases, exploratory testing\n• API Testing - Postman, REST APIs\n• Performance Testing - JMeter, Load testing\n• Security Testing - OWASP, vulnerabilities\n• Code Review - Best practices, bug detection\n• Career Development - Certifications, job prep\n\nCould you be more specific about what you'd like to know?";
};

module.exports = { generateAIResponse };