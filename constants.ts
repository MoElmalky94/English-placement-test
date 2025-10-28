
import { CEFRLevel } from './types';

export const LEVEL_DESCRIPTIONS: Record<CEFRLevel, string> = {
  [CEFRLevel.A1]: "Beginner: Can understand and use familiar everyday expressions and very basic phrases.",
  [CEFRLevel.A2]: "Elementary: Can understand sentences and frequently used expressions related to areas of most immediate relevance.",
  [CEFRLevel.B1]: "Intermediate: Can understand the main points of clear standard input on familiar matters regularly encountered.",
  [CEFRLevel.B2]: "Upper-Intermediate: Can understand the main ideas of complex text on both concrete and abstract topics.",
  [CEFRLevel.C1]: "Advanced: Can understand a wide range of demanding, longer texts, and recognize implicit meaning.",
};

export const getLevelFromPercentage = (percentage: number): CEFRLevel => {
  if (percentage <= 20) return CEFRLevel.A1;
  if (percentage <= 40) return CEFRLevel.A2;
  if (percentage <= 60) return CEFRLevel.B1;
  if (percentage <= 80) return CEFRLevel.B2;
  return CEFRLevel.C1;
};

export const TOTAL_QUESTIONS = 60;
