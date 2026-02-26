import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';

async function testGeminiImage() {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    role: 'user',
                    parts: [{ text: 'Generate an image of a cute dog with angel wings in a starry night sky, high quality digital art' }]
                }
            ]
        });

        console.log(response.text);
        if (response.candidates && response.candidates.length > 0) {
            console.log("Candidate parts:", response.candidates[0].content.parts);
        }
    } catch (err) {
        console.error("Error:", err);
    }
}

testGeminiImage();
