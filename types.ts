
export enum ExerciseType {
  Strength = 'Strength',
  Hangboard = 'Hangboard',
  Campus = 'Campus',
  Climbing = 'Climbing'
}

export enum BlockType {
  WarmUp = 'Warm-up',
  Climbing = 'Climbing',
  Hangboard = 'Hangboard',
  Campus = 'Campus',
  Strength = 'Strength',
  Prehab = 'Prehab',
  Cooldown = 'Cooldown'
}

export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  category: string;
}

export interface Block {
  id: string;
  type: BlockType;
  exercises: {
    exerciseId: string;
    targetSets: number;
    notes?: string;
  }[];
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  blocks: Block[];
  createdAt: string;
}

export interface SetData {
  id: string;
  reps?: number;
  weight?: number;
  rpe?: number;
  rest?: number;
  // Hangboard specific
  hangTime?: number;
  edgeSize?: number;
  gripType?: string;
  protocol?: string;
  // Campus specific
  ladderType?: string;
  touches?: number;
  rungSize?: number;
  // Climbing specific
  grade?: string;
  attempts?: number;
  sends?: number;
  qualityAttempts?: number;
  boardType?: string;
  angle?: number;
  style?: string[];
  notes?: string;
}

export interface LoggedExercise {
  exerciseId: string;
  sets: SetData[];
}

export interface Session {
  id: string;
  templateId?: string;
  name: string;
  date: string; // ISO string
  startTime?: string;
  endTime?: string;
  exercises: LoggedExercise[];
  painLevel?: number; // 0-10
  painLocation?: string;
  notes?: string;
  isCompleted: boolean;
}

export interface ScheduledWorkout {
  id: string;
  date: string;
  templateId: string;
}

export type AppView = 'Dashboard' | 'Calendar' | 'Templates' | 'Exercises' | 'ActiveSession' | 'History' | 'Analysis';
