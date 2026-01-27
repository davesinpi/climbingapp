
import { GoogleGenAI, Type } from "@google/genai";
import { Session } from "../types";

// Helper to safely get the API key from environment
const getApiKey = () => {
  try {
    return (window as any).process?.env?.API_KEY || (process as any)?.env?.API_KEY || '';
  } catch (e) {
    return '';
  }
};

const apiKey = getApiKey();
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const GeminiService = {
  async analyzeSession(session: Session) {
    if (!ai) return "AI analysis unavailable (API key not provided in environment).";

    const prompt = `
      As a climbing coach, analyze this training session and provide 3 concise bullet points for improvement or praise.
      Workout Data: ${JSON.stringify(session)}
      Consider climbing grades, volume, and rest. 
      Keep it high-performance but encouraging.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          temperature: 0.7,
        }
      });
      return response.text || "No analysis generated.";
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return "Unable to analyze session at this time.";
    }
  },

  async suggestWorkout(history: Session[]) {
    if (!ai) return "AI tips disabled (No API Key).";

    const prompt = `
      Based on the user's last 5 climbing sessions, suggest a focus for their next session. 
      History: ${JSON.stringify(history.slice(-5))}
      Be specific about whether they need more volume, more limit bouldering, or more rest.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text || "Start training to get suggestions.";
    } catch (error) {
      return "Could not generate suggestion.";
    }
  }
};
