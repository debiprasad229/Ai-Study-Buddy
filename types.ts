
export enum FeatureTab {
  EXPLAIN = 'EXPLAIN',
  SUMMARIZE = 'SUMMARIZE',
  QUIZ = 'QUIZ',
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  title: string;
  questions: QuizQuestion[];
}
