"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeImage = void 0;
const genai_1 = require("@google/genai");
const analyzeImage = async (mimeType, imageBuffer) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set.");
    }
    const ai = new genai_1.GoogleGenAI({ apiKey });
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
exports.analyzeImage = analyzeImage;
//# sourceMappingURL=gemini.service.js.map