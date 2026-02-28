import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function checkModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API key found.");
        return;
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log("Using API key:", apiKey.substring(0, 5) + "...");

    try {
        // Unfortunately standard JS SDK doesn't expose listModels as easily in v0.x without REST or it might.
        // Let's try to just fetch a text prompt with gemini-1.5-flash to reproduce.
        const model15Flash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        await model15Flash.generateContent("Hello");
        console.log("gemini-1.5-flash works");
    } catch (e: any) {
        console.error("gemini-1.5-flash error:", e.message);
    }

    try {
        // Try gemini-1.5-pro
        const modelPro = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        await modelPro.generateContent("Hello");
        console.log("gemini-1.5-pro works");
    } catch (e: any) {
        console.error("gemini-1.5-pro error:", e.message);
    }
    
    try {
        // Try gemini-1.5-flash-latest
        const modelFlashLatest = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        await modelFlashLatest.generateContent("Hello");
        console.log("gemini-1.5-flash-latest works");
    } catch (e: any) {
        console.error("gemini-1.5-flash-latest error:", e.message);
    }
}

checkModels();
