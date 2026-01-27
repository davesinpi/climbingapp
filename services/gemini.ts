
import { GoogleGenAI } from "@google/genai";
import { Session } from "../types";

// Helper to get a fresh AI instance with the current API key
const getAI = () => {
  // Use the standard environment variable injected by the platform
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API configuration is missing. Please visit Settings.");
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
        Focus on climbing grades, volume, and recovery. 
        Keep it high-performance, expert-level, but encouraging.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          temperature: 0.7,
        }
      });
      return response.text || "Analysis could not be generated at this time.";
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return "AI analysis unavailable. Please check your API configuration in Settings.";
    }
  },

  async suggestWorkout(history: Session[]) {
    try {
      const ai = getAI();
      const prompt = `
        Based on the user's last 5 climbing sessions, suggest a focus for their next session. 
        History: ${JSON.stringify(history.slice(-5))}
        Be specific about whether they need more volume (capacity), more limit bouldering (power), or more rest.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text || "Log more sessions to receive AI training suggestions.";
    } catch (error) {
      console.error("Gemini Suggestion Error:", error);
      return "Unable to generate AI suggestion. Ensure your API key is correctly configured.";
    }
  }
};
