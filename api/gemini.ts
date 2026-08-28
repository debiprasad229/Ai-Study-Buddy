import { GoogleGenAI, Type } from "@google/genai";
import type { IncomingMessage, ServerResponse } from "http";

export interface GeminiRequestBody {
  action: "explain" | "summarize" | "quiz";
  payload: string;
}

const MODEL = "gemini-2.0-flash";

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }
  return key;
}

export async function handleGeminiAction(action: string, payload: string) {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  // Input length guards
  if (!payload || typeof payload !== "string") {
    throw new Error("Invalid or empty input provided.");
  }

  const trimmed = payload.trim();
  if (action === "explain" && trimmed.length > 500) {
    throw new Error("Topic exceeds maximum length of 500 characters.");
  }
  if (action === "summarize" && trimmed.length > 15000) {
    throw new Error("Notes exceed maximum length of 15,000 characters.");
  }
  if (action === "quiz" && trimmed.length > 5000) {
    throw new Error("Input exceeds maximum length of 5,000 characters.");
  }

  switch (action) {
    case "explain": {
      const prompt = `Explain the topic "${trimmed}" in simple and clear terms, as if you were teaching it to a high school student. Use analogies and examples where possible. Structure the explanation with headings and bullet points for readability.`;
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
      });
      return { result: response.text };
    }

    case "summarize": {
      const prompt = `Summarize the following study notes concisely. Focus on extracting the key concepts, definitions, and main points. Present the summary in a structured format using bullet points. \n\nNotes:\n${trimmed}`;
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
      });
      return { result: response.text };
    }

    case "quiz": {
      const prompt = `Generate a quiz with 5 multiple-choice questions based on the following topic or notes: "${trimmed}". The quiz should have a relevant title. Each question must have exactly 4 options and one correct answer.`;
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "A creative and relevant title for the quiz.",
              },
              questions: {
                type: Type.ARRAY,
                description: "An array of 5 quiz questions.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: {
                      type: Type.STRING,
                      description: "The text of the multiple-choice question.",
                    },
                    options: {
                      type: Type.ARRAY,
                      description: "An array of exactly 4 string options.",
                      items: {
                        type: Type.STRING,
                      },
                    },
                    correctAnswer: {
                      type: Type.STRING,
                      description: "The correct answer, which must be one of the provided options.",
                    },
                  },
                  required: ["question", "options", "correctAnswer"],
                },
              },
            },
            required: ["title", "questions"],
          },
        },
      });

      const jsonText = response.text?.trim() || "";
      const quizData = JSON.parse(jsonText);
      if (!quizData.title || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
        throw new Error("Invalid quiz format received from AI.");
      }
      return { result: quizData };
    }

    default:
      throw new Error(`Unsupported action: ${action}`);
  }
}

// Handler for Vercel / Node serverless requests
export default async function handler(req: any, res: any) {
  // Enable CORS if needed
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method Not Allowed. Use POST." }));
    return;
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    const { action, payload } = body || {};
    if (!action || !payload) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Missing required fields: action and payload." }));
      return;
    }

    const data = await handleGeminiAction(action, payload);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: error.message || "Internal server error." }));
  }
}
