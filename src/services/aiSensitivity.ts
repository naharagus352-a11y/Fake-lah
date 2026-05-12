import { GoogleGenAI } from "@google/genai";
import { DeviceSpecs, SensitivitySettings } from "../types";

export const generateAiSensitivity = async (specs: DeviceSpecs): Promise<SensitivitySettings> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Fallback if no API key
    return {
      general: 95,
      redDot: 90,
      scope2x: 85,
      scope4x: 80,
      sniper: 50,
      freeLook: 70
    };
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `You are a Free Fire gaming expert. Generate the optimal sensitivity settings for a mobile device with these specs:
  RAM: ${specs.ram}
  CPU: ${specs.cpu}
  GPU: ${specs.gpu}
  
  Return ONLY a valid JSON object with these keys: general, redDot, scope2x, scope4x, sniper, freeLook. All values should be between 0 and 100.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      general: result.general || 95,
      redDot: result.redDot || 90,
      scope2x: result.scope2x || 85,
      scope4x: result.scope4x || 80,
      sniper: result.sniper || 50,
      freeLook: result.freeLook || 70
    };
  } catch (error) {
    console.error("AI Sensitivity Generation failed:", error);
    return {
      general: 98,
      redDot: 92,
      scope2x: 88,
      scope4x: 82,
      sniper: 45,
      freeLook: 75
    };
  }
};
