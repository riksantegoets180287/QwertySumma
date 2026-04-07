
export interface Student {
  name: string;
  studentNumber: string;
}

export interface TaskAttempt {
  index: number;
  target: string;
  firstTryCorrect: boolean;
  attempts: number;
  errors: number;
  skipped: boolean;
  typedHistory: string[];
}

export interface SessionSummary {
  startTimestampISO: string;
  endTimestampISO: string;
  totalErrors: number;
  totalSkipped: number;
  correctOnFirstTryCount: number;
  totalAttempts: number;
}

export enum GameState {
  LOGIN = 'LOGIN',
  PLAYING = 'PLAYING',
  RESULTS = 'RESULTS'
}

export interface Task {
  character: string;
  hint: string;
}
