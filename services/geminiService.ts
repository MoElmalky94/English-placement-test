
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { Question } from '../types';
import { TOTAL_QUESTIONS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const testGenerationPrompt = `
You are an expert in English language assessment. Generate a comprehensive English placement test with a total of ${TOTAL_QUESTIONS} questions to assess proficiency from CEFR level A1 to C1.

The test must be divided into three sections: Grammar, Vocabulary, and Listening.
- 20 Grammar questions
- 20 Vocabulary questions
- 20 Listening questions

For each section, provide an equal number of questions for each CEFR level: A1, A2, B1, B2, C1. This means 4 questions per level per section.

Return the entire test as a single JSON object.

For each question, provide the following fields:
- id: A unique number for the question, from 1 to ${TOTAL_QUESTIONS}.
- section: A string, either "Grammar", "Vocabulary", or "Listening".
- level: A string, either "A1", "A2", "B1", "B2", or "C1".
- questionText: The main text of the question. For Listening questions, this should be the question about the audio, not the audio script itself.
- options: An array of 4 strings representing the multiple-choice options.
- correctAnswer: A string that exactly matches one of the values in the 'options' array.
- audioPrompt (for Listening questions only): A short text (1-3 sentences) to be converted to audio. The prompt should be a natural-sounding utterance or short dialogue relevant to the question's CEFR level. For Grammar and Vocabulary questions, this field should be null.
`;

const questionSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.INTEGER },
        section: { type: Type.STRING },
        level: { type: Type.STRING },
        questionText: { type: Type.STRING },
        options: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        },
        correctAnswer: { type: Type.STRING },
        audioPrompt: { type: Type.STRING, nullable: true },
    },
    required: ['id', 'section', 'level', 'questionText', 'options', 'correctAnswer']
};

export const generateTestQuestions = async (): Promise<Question[]> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: testGenerationPrompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    questions: {
                        type: Type.ARRAY,
                        items: questionSchema,
                    }
                }
            }
        }
    });

    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    return parsed.questions;
};

export const generateAudio = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error('Audio generation failed, no data received.');
    }
    return base64Audio;
};
