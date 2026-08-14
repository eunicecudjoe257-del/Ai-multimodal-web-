import { GoogleGenAI } from "@google/genai";

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

export async function callGemini(model: string, message: string, attachments: any[]) {
  if (!ai) {
      // Simulate response if key missing
      await new Promise(resolve => setTimeout(resolve, 1000));
      return `Gemini (${model}) response (mocked) to: ${message}`;
  }
  
  // Real implementation using @google/genai
  const modelInstance = ai.getGenerativeModel({ model: model });
  const result = await modelInstance.generateContent(message);
  return result.response.text();
}
