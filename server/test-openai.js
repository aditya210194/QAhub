// test-ai.js (renamed to be provider-agnostic)
require('dotenv').config();

// ==================== AI PROVIDER CONFIGURATION ====================
// Check which API keys are available
const hasOpenAI = !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-sec*******-key';
const hasGemini = !!process.env.GEMINI_API_KEY;
const hasGroq = !!process.env.GROQ_API_KEY;
const hasMistral = !!process.env.MISTRAL_API_KEY;

console.log('🔍 AI Provider Configuration:');
console.log('├─ OpenAI:', hasOpenAI ? '✅ Key found' : '❌ Not configured');
console.log('├─ Gemini:', hasGemini ? '✅ Key found' : '❌ Not configured');
console.log('├─ Groq:', hasGroq ? '✅ Key found' : '❌ Not configured');
console.log('└─ Mistral:', hasMistral ? '✅ Key found' : '❌ Not configured');
console.log('');

// ==================== PROVIDER IMPLEMENTATIONS ====================

// 1. OpenAI Provider
async function testOpenAI() {
    if (!hasOpenAI) return null;

    try {
        const OpenAI = require('openai');
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        console.log('📤 Testing OpenAI (gpt-3.5-turbo)...');

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "What is software testing? Answer in one sentence." }
            ],
            max_tokens: 100,
            temperature: 0.7
        });

        return {
            provider: 'OpenAI',
            response: response.choices[0].message.content,
            usage: response.usage
        };
    } catch (error) {
        console.error('❌ OpenAI test failed:', error.message);
        if (error.code === 'insufficient_quota') {
            console.log('   ⚠️ Insufficient quota - need to add billing or use alternative');
        }
        return null;
    }
}

// 2. Google Gemini Provider (Free)
async function testGemini() {
    if (!hasGemini) return null;

    try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        console.log('📤 Testing Google Gemini (gemini-1.5-flash)...');

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash"  // Changed to working model
        });

        const prompt = "What is software testing? Answer in one sentence.";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return {
            provider: 'Google Gemini',
            response: text,
            usage: { model: 'gemini-1.5-flash' }
        };
    } catch (error) {
        console.error('❌ Gemini test failed:', error.message);
        return null;
    }
}

// 3. Groq Provider (Free, Fast)
async function testGroq() {
    if (!hasGroq) return null;

    try {
        const Groq = require('groq-sdk');
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });

        console.log('📤 Testing Groq (llama-3.3-70b-versatile)...');

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "What is software testing? Answer in one sentence." }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 100,
        });

        return {
            provider: 'Groq (Llama)',
            response: chatCompletion.choices[0]?.message?.content,
            usage: { model: 'llama-3.3-70b-versatile' }
        };
    } catch (error) {
        console.error('❌ Groq test failed:', error.message);
        return null;
    }
}

// 4. Mistral Provider (Free)
async function testMistral() {
    if (!hasMistral) return null;

    try {
        const MistralClient = require('@mistralai/mistralai');
        const client = new MistralClient(process.env.MISTRAL_API_KEY);

        console.log('📤 Testing Mistral (mistral-large-latest)...');

        const chatResponse = await client.chat({
            model: "mistral-large-latest",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "What is software testing? Answer in one sentence." }
            ],
            maxTokens: 100,
            temperature: 0.7
        });

        return {
            provider: 'Mistral',
            response: chatResponse.choices[0].message.content,
            usage: { model: 'mistral-large-latest' }
        };
    } catch (error) {
        console.error('❌ Mistral test failed:', error.message);
        return null;
    }
}

// ==================== FALLBACK RESPONSES ====================
function getFallbackResponse() {
    const fallbacks = [
        "Software testing is the process of evaluating and verifying that a software application or system meets specified requirements and functions correctly.",
        "Software testing is the practice of identifying bugs and ensuring software quality through systematic evaluation and verification.",
        "Software testing involves executing software components to identify defects and ensure they meet expected requirements.",
        "Software testing is the process of validating and verifying that a software product works as intended and meets user needs."
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// ==================== MAIN TEST FUNCTION ====================
async function testAI() {
    console.log('🚀 Starting AI Provider Tests...\n');

    let workingProvider = null;
    const providers = [
        { name: 'OpenAI', test: testOpenAI, key: hasOpenAI },
        { name: 'Gemini', test: testGemini, key: hasGemini },
        { name: 'Groq', test: testGroq, key: hasGroq },
        { name: 'Mistral', test: testMistral, key: hasMistral }
    ];

    // Test each configured provider
    for (const provider of providers) {
        if (provider.key) {
            const result = await provider.test();
            if (result) {
                workingProvider = result;
                break;
            }
            console.log('');
        }
    }

    // Display results
    console.log('\n' + '='.repeat(60));
    if (workingProvider) {
        console.log('✅ SUCCESS! AI is working with:', workingProvider.provider);
        console.log('='.repeat(60));
        console.log('\n📝 Response:', workingProvider.response);
        console.log('\n📊 Usage:', workingProvider.usage);
        console.log('\n💡 This AI provider is ready to use in your mentorship page!');
    } else {
        console.log('⚠️  No AI providers configured or all tests failed.');
        console.log('='.repeat(60));
        console.log('\n📝 Using FALLBACK RESPONSE:');
        console.log(getFallbackResponse());
        console.log('\n💡 To enable AI, set up one of these providers:');
        console.log('\n1. Google Gemini (FREE - recommended):');
        console.log('   - Get API key: https://aistudio.google.com/apikey');
        console.log('   - Add to .env: GEMINI_API_KEY=your_key_here');
        console.log('\n2. Groq (FREE - fastest):');
        console.log('   - Get API key: https://console.groq.com');
        console.log('   - Add to .env: GROQ_API_KEY=your_key_here');
        console.log('\n3. Mistral (FREE - 1B tokens/month):');
        console.log('   - Get API key: https://console.mistral.ai');
        console.log('   - Add to .env: MISTRAL_API_KEY=your_key_here');
        console.log('\n4. OpenAI (Paid):');
        console.log('   - Add billing: https://platform.openai.com/billing');
        console.log('   - Already configured but needs credits');
    }
    console.log('');
}

// Run the test
testAI();