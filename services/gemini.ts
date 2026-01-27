
import { GoogleGenAI } from "@google/genai";
import { Session } from "../types";

// Helper to get a fresh AI instance with the current API key
const getAI = () => {
  const apiKey = window.process?.env?.API_KEY || (globalThis as any).process?.env?.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing from environment");
  }
  return new GoogleGenAI({ apiKey });
};

export const GeminiService = {
  async analyzeSession(session: Session) {
    try {
      const ai = getAI();
      const prompt = `
        As a climbing coach, analyze this training session and provide 3 concise bullet points for improvement or praise.
        Workout Data: ${JSON.stringify(session)}
        Consider climbing grades, volume, and rest. 
        Keep it high-performance but encouraging.
      `;

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
      return "AI analysis unavailable (check API key or connection).";
    }
  },

  async suggestWorkout(history: Session[]) {
    try {
      const ai = getAI();
      const prompt = `
        Based on the user's last 5 climbing sessions, suggest a focus for their next session. 
        History: ${JSON.stringify(history.slice(-5))}
        Be specific about whether they need more volume, more limit bouldering, or more rest.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text || "Start training to get suggestions.";
    } catch (error) {
      console.error("Gemini Suggestion Error:", error);
      return "Could not generate AI suggestion at this time.";
    }
  }
};
