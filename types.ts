
export enum TestSection {
  Grammar = "Grammar",
  Vocabulary = "Vocabulary",
  Listening = "Listening",
}

export enum CEFRLevel {
  A1 = "A1",
  A2 = "A2",
  B1 = "B1",
  B2 = "B2",
  C1 = "C1",
}

export interface Question {
  id: number;
  section: TestSection;
  level: CEFRLevel;
  questionText: string;
  options: string[];
  correctAnswer: string;
  audioPrompt?: string | null;
}

export interface UserAnswer {
  questionId: number;
  answer: string;
}

export interface TestResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  level: CEFRLevel;
  levelDescription: string;
}

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext
  }
}
