// test-groq.js
require('dotenv').config();
const Groq = require('groq-sdk');

async function testGroq() {
    console.log('🔍 Testing Groq API...');

    if (!process.env.GROQ_API_KEY) {
        console.error('❌ GROQ_API_KEY not found in .env file');
        console.log('Get your free API key at: https://console.groq.com');
        return;
    }

    console.log('API Key exists:', process.env.GROQ_API_KEY.substring(0, 10) + '...');

    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY
    });

    try {
        console.log('📤 Sending test request to Groq...');

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant specializing in software testing."
                },
                {
                    role: "user",
                    content: "What is software testing? Answer in one sentence."
                }
            ],
            model: "llama-3.3-70b-versatile", // Free, fast model
            temperature: 0.7,
            max_tokens: 100,
        });

        console.log('✅ Groq is working!');
        console.log('Response:', chatCompletion.choices[0].message.content);
        console.log('\n💡 Your AI mentor is ready to use!');

    } catch (error) {
        console.error('❌ Groq test failed:');
        console.error('Error message:', error.message);

        if (error.status === 401) {
            console.log('\n⚠️ Invalid API key. Please check your key at: https://console.groq.com');
        }
    }
}

testGroq();