export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export enum GameState {
  LOADING,
  PLAYING,
  ERROR,
}