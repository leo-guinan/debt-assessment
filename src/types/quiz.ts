export interface QuizAnswer {
  questionId: number;
  selectedOption: string;
  rankedOptions?: string[]; // For drag-and-drop questions
  multiSelectOptions?: string[]; // For multi-select questions
}

export interface ProfileScore {
  student: number;
  credit: number;
  medical: number;
  mortgage: number;
  multi: number;
  solidarity: number;
}

export interface QuizResult {
  answers: QuizAnswer[];
  freeformResponse?: string;
  contactInfo?: string;
  profileScores: ProfileScore;
  primaryProfile: {
    type: keyof ProfileScore;
    name: string;
    matchPercentage: number;
  };
  readinessScore: number;
  readinessLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface Question {
  id: number;
  question: string;
  type?: 'multiple-choice' | 'freeform' | 'drag-drop' | 'multi-select';
  options: {
    label: string;
    value: string;
    scoring: {
      profiles?: Partial<ProfileScore>;
      readiness?: number;
    };
  }[];
}