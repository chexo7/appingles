import { GoogleGenAI } from "@google/genai";
import { QuizQuestion } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `
  You are an expert English teacher specializing in creating engaging quizzes for intermediate (B1-B2 level) Spanish-speaking students from Chile.
  Your task is to generate a single multiple-choice question.

  CRITICAL INSTRUCTIONS FOR YOUR ENTIRE RESPONSE:
  - Your response MUST BE ONLY a valid, perfectly formatted JSON object.
  - Do NOT include any text, explanations, or markdown formatting like \`\`\`json outside of the JSON object itself.
  - The entire output must be a single JSON string that can be parsed directly. No trailing commas, no comments.
`;

const userPrompt = `
  Generate 1 multiple-choice question to test and improve understanding of a common English grammar point.
  Focus on one of these areas: connectors (however, although), auxiliary verbs (do/does/did, was/were), prepositions, phrasal verbs, or verb tenses (simple past vs. present perfect).

  For the question, provide:
  1.  A 'question' sentence in English with a blank space represented by '___'.
  2.  An 'options' array with one correct answer and two plausible incorrect answers (distractors).
  3.  The 'answer', which is the exact string of the correct option.
  4.  An 'explanation' in formal but simple Spanish, specifically adapted for a speaker from Chile. Use "usted" or "ustedes". Avoid technical jargon. The tone should be like a helpful teacher. This explanation MUST clarify the specific grammar rule being tested, explaining why the correct answer is right and the others are wrong.

  The JSON structure for the question object MUST be exactly as follows:
  {
    "question": "The English sentence with a blank, represented by '___'.",
    "options": ["Option A", "Option B", "Correct Answer"],
    "answer": "The exact string of the correct answer.",
    "explanation": "A clear, simple explanation of the grammar rule in Chilean Spanish."
  }
`;

export async function generateSingleQuizQuestion(): Promise<QuizQuestion> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.8, // Slightly increased temperature for more variety in single questions
      },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr);

    if (Array.isArray(parsedData) || !parsedData.question || !parsedData.options || !parsedData.answer || !parsedData.explanation) {
        console.error("Invalid API response format. Expected a QuizQuestion object.", parsedData);
        throw new Error("Formato de respuesta de API inválido.");
    }

    return parsedData as QuizQuestion;

  } catch (error) {
    console.error("Error generating quiz questions:", error);
     if (error instanceof SyntaxError) {
        console.error("The API returned a malformed JSON, causing a SyntaxError.");
    }
    throw new Error("No se pudo comunicar con el servicio de IA para generar preguntas.");
  }
}