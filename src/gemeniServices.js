import { GoogleGenerativeAI } from "@google/generative-ai";
import universityData from "./university-data.json";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY; // Ensure your API key is set in your .env file
const genAI = new GoogleGenerativeAI(API_KEY);

export async function getUniversitySuggested() {
    const model = genAI.getGenerativeModel({
        model: "gemini-pro", generationConfig: {
            maxOutputTokens: 250,
            temperature: 0.8,
        }
    });
    const prompt = ""
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating response:", error);
        return "Sorry, I couldn't find an answer to that question.";
    }
}
