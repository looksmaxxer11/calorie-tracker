import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'DUMMY_KEY_FOR_BUILD' });

export const analyzeFoodImage = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is not configured.");
  }

  const model = "gemini-2.5-flash"; // Excellent for multimodal tasks

  const prompt = `
    You are an expert nutritionist and dietitian with a focus on realistic calorie tracking.
    Analyze the provided image of food. 
    Identify every distinct food item visible. 
    Estimate the portion sizes realistically, accounting for hidden fats, oils, and cooking methods (e.g., if something looks fried, assume oil absorption).
    
    Return a structured JSON response with:
    1. A list of food items, each with:
       - Name
       - Estimated portion size (e.g., "1 cup", "150g", "1 slice")
       - Calories (kcal)
       - Protein (g)
       - Carbs (g)
       - Fat (g)
       - Confidence level ("High", "Medium", "Low")
    2. A summary object with total totals and a short piece of nutritional advice.
    3. A health score from 1-10 (10 being perfectly balanced/healthy, 1 being junk).

    Be precise. Do not underestimate calories.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  portionSize: { type: Type.STRING },
                  calories: { type: Type.NUMBER },
                  protein: { type: Type.NUMBER },
                  carbs: { type: Type.NUMBER },
                  fat: { type: Type.NUMBER },
                  confidence: { type: Type.STRING },
                },
                required: ["name", "portionSize", "calories", "protein", "carbs", "fat", "confidence"],
              },
            },
            summary: {
              type: Type.OBJECT,
              properties: {
                totalCalories: { type: Type.NUMBER },
                totalProtein: { type: Type.NUMBER },
                totalCarbs: { type: Type.NUMBER },
                totalFat: { type: Type.NUMBER },
                healthScore: { type: Type.NUMBER },
                advice: { type: Type.STRING },
              },
              required: ["totalCalories", "totalProtein", "totalCarbs", "totalFat", "healthScore", "advice"],
            },
          },
          required: ["items", "summary"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini.");
    }

    const result = JSON.parse(text) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};