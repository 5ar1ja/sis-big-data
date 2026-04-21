import { GoogleGenAI } from "@google/genai";

export const analyzeImage = async (mimeType: string, imageBuffer: Buffer): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = "Please analyze this image and provide a detailed summary of its contents. If there is text, extract it. Focus on details that would be relevant for a business context.";

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: imageBuffer.toString("base64"),
              mimeType,
            },
          },
        ],
      },
    ],
  });

  return response.text || "No analysis provided.";
};
