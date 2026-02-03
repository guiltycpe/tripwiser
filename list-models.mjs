
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
        console.error('API Key not found');
        return;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        if (data.models) {
            const contentModels = data.models
                .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
                .map(m => m.name);
            console.log('AVAILABLE GENERATION MODELS:', JSON.stringify(contentModels, null, 2));
        } else {
            console.log('NO MODELS FOUND OR ERROR:', JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error('Error listing models:', error);
    }
}

listModels();
