
import React from 'react';
import { Exercise, ExerciseType, WorkoutTemplate, BlockType } from './types';

export const SEED_EXERCISES: Exercise[] = [
  { id: '1', name: 'Weighted Pull-ups', type: ExerciseType.Strength, category: 'Upper Body' },
  { id: '2', name: 'Barbell Squat', type: ExerciseType.Strength, category: 'Lower Body' },
  { id: '3', name: 'Max Hangs (20mm)', type: ExerciseType.Hangboard, category: 'Fingers' },
  { id: '4', name: '7/3 Repeaters', type: ExerciseType.Hangboard, category: 'Fingers' },
  { id: '5', name: '1-4-7 Ladder', type: ExerciseType.Campus, category: 'Power' },
  { id: '6', name: 'Moonboard Projecting', type: ExerciseType.Climbing, category: 'Limit' },
  { id: '7', name: 'Kilterboard Volume', type: ExerciseType.Climbing, category: 'Endurance' },
  { id: '8', name: 'Gym Bouldering', type: ExerciseType.Climbing, category: 'Technical' },
  { id: '9', name: 'Core: L-Sit', type: ExerciseType.Strength, category: 'Core' },
  { id: '10', name: 'Finger Glides', type: ExerciseType.Strength, category: 'Warm-up' },
];

export const SEED_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 't1',
    name: 'Standard Strength & Hangs',
    description: 'A focused session on max finger strength and big compound movements.',
    createdAt: new Date().toISOString(),
    blocks: [
      {
        id: 'b1',
        type: BlockType.WarmUp,
        exercises: [{ exerciseId: '10', targetSets: 2 }]
      },
      {
        id: 'b2',
        type: BlockType.Hangboard,
        exercises: [{ exerciseId: '3', targetSets: 5 }]
      },
      {
        id: 'b3',
        type: BlockType.Strength,
        exercises: [
          { exerciseId: '1', targetSets: 3 },
          { exerciseId: '9', targetSets: 3 }
        ]
      }
    ]
  },
  {
    id: 't2',
    name: 'Moonboard Power',
    description: 'High intensity board climbing session.',
    createdAt: new Date().toISOString(),
    blocks: [
      {
        id: 'b4',
        type: BlockType.Climbing,
        exercises: [{ exerciseId: '6', targetSets: 10 }]
      }
    ]
  }
];

export const GRADE_VALUES: Record<string, number> = {
  'V0': 0, 'V1': 1, 'V2': 2, 'V3': 3, 'V4': 4, 'V5': 5, 'V6': 6, 'V7': 7, 'V8': 8, 'V9': 9, 'V10': 10,
  '5.9': 1, '5.10a': 2, '5.10b': 3, '5.10c': 4, '5.10d': 5, '5.11a': 6, '5.11b': 7, '5.11c': 8, '5.11d': 9, '5.12a': 10
};
