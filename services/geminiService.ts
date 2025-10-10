
import { GoogleGenAI, Type } from "@google/genai";
import { Quiz } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

export const explainTopic = async (topic: string): Promise<string> => {
    const prompt = `Explain the topic "${topic}" in simple and clear terms, as if you were teaching it to a high school student. Use analogies and examples where possible. Structure the explanation with headings and bullet points for readability.`;
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error explaining topic:", error);
        throw new Error("Failed to get explanation from AI. Please try again.");
    }
};

export const summarizeText = async (notes: string): Promise<string> => {
    const prompt = `Summarize the following study notes concisely. Focus on extracting the key concepts, definitions, and main points. Present the summary in a structured format using bullet points. \n\nNotes:\n${notes}`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error summarizing notes:", error);
        throw new Error("Failed to summarize notes. Please check the input and try again.");
    }
};

export const generateQuiz = async (topicOrNotes: string): Promise<Quiz> => {
    const prompt = `Generate a quiz with 5 multiple-choice questions based on the following topic or notes: "${topicOrNotes}". The quiz should have a relevant title. Each question must have exactly 4 options and one correct answer.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: {
                            type: Type.STRING,
                            description: "A creative and relevant title for the quiz."
                        },
                        questions: {
                            type: Type.ARRAY,
                            description: "An array of 5 quiz questions.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: {
                                        type: Type.STRING,
                                        description: "The text of the multiple-choice question."
                                    },
                                    options: {
                                        type: Type.ARRAY,
                                        description: "An array of exactly 4 string options.",
                                        items: {
                                            type: Type.STRING
                                        }
                                    },
                                    correctAnswer: {
                                        type: Type.STRING,
                                        description: "The correct answer, which must be one of the provided options."
                                    }
                                },
                                required: ["question", "options", "correctAnswer"]
                            }
                        }
                    },
                    required: ["title", "questions"]
                }
            }
        });
        
        const jsonText = response.text.trim();
        const quizData: Quiz = JSON.parse(jsonText);

        // Basic validation
        if (!quizData.title || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
            throw new Error("Invalid quiz format received from AI.");
        }
        
        return quizData;
    } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate quiz. The AI might be unable to create a quiz from the provided text.");
    }
};
