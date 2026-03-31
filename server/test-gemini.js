// test-gemini.js
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    console.log('🔍 Testing Google Gemini...');

    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ GEMINI_API_KEY not found');
        return;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Try different models
    const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];

    for (const modelName of models) {
        try {
            console.log(`\n📤 Testing model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });

            const result = await model.generateContent("What is software testing? Answer in one sentence.");
            const response = await result.response;
            const text = response.text();

            console.log(`✅ ${modelName} is working!`);
            console.log(`Response: ${text}`);
            console.log('\n💡 Use this model in your code!');
            return;
        } catch (error) {
            console.log(`❌ ${modelName} failed:`, error.message);
        }
    }

    console.log('\n⚠️ No Gemini models working. Please check your API key.');
}

testGemini();