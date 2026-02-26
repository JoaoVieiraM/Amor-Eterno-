import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';

async function testGeminiImage() {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    try {
        const response = await ai.models.generateImages({
            model: 'gemini-2.5-flash-image',
            prompt: 'A cute dog with angel wings in a starry night sky, high quality digital art',
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1'
            }
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64Image = response.generatedImages[0].image.imageBytes;
            fs.writeFileSync("test_image_gemini.jpg", Buffer.from(base64Image, 'base64'));
            console.log("Success! Image saved to test_image_gemini.jpg");
        } else {
            console.log("No images generated", response);
        }
    } catch (err) {
        console.error("Error:", err);
    }
}

testGeminiImage();
