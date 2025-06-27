
import { GoogleGenAI } from "@google/genai";
import type { QuizQuestion } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set. Please set it in your environment.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PROMPT = `
You are an expert AI assistant specialized in English language teaching for Spanish speakers.
Your task is to generate a 5-question multiple-choice quiz for a Chilean Spanish speaker whose English level is B1-B2.
The quiz must focus on common grammatical challenges for this level, specifically:
- English connectors (e.g., however, although, therefore).
- Auxiliary verbs in different tenses (e.g., do/does/did, was/were, has/have).
- Prepositions (e.g., in, on, at).
- Phrasal verbs.

Each question must be a fill-in-the-blank sentence.
Provide one correct answer and two plausible but incorrect distractors.

The output MUST be a valid JSON array of 5 objects.
Each object in the array must have the following structure:
{
  "question": "The English sentence with a '_____' for the blank.",
  "options": ["option A", "option B", "the correct option"],
  "correctAnswer": "the correct option string",
  "explanation_es": "A clear explanation in Chilean Spanish about why the correct answer is right and the other options are wrong. Use Chilean Spanish idioms or phrasing where appropriate to make it more relatable, for example use 'cachai' or 'al tiro' if it fits naturally."
}

Example of a desired object:
{
  "question": "If I had known you were coming, I ______ have baked a cake.",
  "options": ["would", "will", "did"],
  "correctAnswer": "would",
  "explanation_es": "Se usa 'would' porque es una oración condicional de tercer tipo (third conditional), que habla de una situación hipotética en el pasado. 'Will' es para futuro y 'did' no calza en esta estructura, ¿cachai?"
}

Now, generate the 5-question quiz.
`;


export const generateQuizQuestions = async (): Promise<QuizQuestion[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite-preview-06-17",
            contents: PROMPT,
            config: {
                responseMimeType: "application/json",
                temperature: 1.1,
            },
        });
        
        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }

        const parsedData = JSON.parse(jsonStr);
        
        if (!Array.isArray(parsedData) || parsedData.length === 0) {
            throw new Error("API did not return a valid array of questions.");
        }
        
        // Simple validation
        const isValid = parsedData.every(q => 
            q.question && q.options && q.correctAnswer && q.explanation_es
        );

        if (!isValid) {
            throw new Error("API response is missing required fields in one or more questions.");
        }

        return parsedData as QuizQuestion[];

    } catch (error) {
        console.error("Error generating quiz questions:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate quiz from API: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the quiz.");
    }
};
