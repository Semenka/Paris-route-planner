import { GoogleGenAI } from "@google/genai";
import type { UserLocation, GroundingChunk } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFastestRoute = async (userLocation: UserLocation | null): Promise<{ text: string, groundingChunks: GroundingChunk[] }> => {
  const model = "gemini-2.5-flash";
  const prompt = "In real time, what is the general fastest direction to get from DeFence Tour Coupole to 12 Rue Leonard De Vinci in Paris? Summarize the best mode of transport (e.g., metro, bus, car, walking) and the general route to take, without needing turn-by-turn details.";

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
      },
      toolConfig: userLocation ? {
        retrievalConfig: {
          latLng: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude
          }
        }
      } : undefined,
    });

    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { text, groundingChunks };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to fetch route suggestion from the AI model.");
  }
};