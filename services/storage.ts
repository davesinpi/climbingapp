
import { WorkoutTemplate, Exercise, Session, ScheduledWorkout } from '../types';
import { SEED_EXERCISES, SEED_TEMPLATES } from '../constants';

const STORAGE_KEYS = {
  EXERCISES: 'climb_app_exercises',
  TEMPLATES: 'climb_app_templates',
  SESSIONS: 'climb_app_sessions',
  SCHEDULE: 'climb_app_schedule',
};

export const StorageService = {
  init: () => {
    if (!localStorage.getItem(STORAGE_KEYS.EXERCISES)) {
      localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(SEED_EXERCISES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TEMPLATES)) {
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(SEED_TEMPLATES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SCHEDULE)) {
      localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify([]));
    }
  },

  getExercises: (): Exercise[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.EXERCISES) || '[]'),
  saveExercise: (exercise: Exercise) => {
    const data = StorageService.getExercises();
    const existing = data.findIndex(e => e.id === exercise.id);
    if (existing > -1) data[existing] = exercise;
    else data.push(exercise);
    localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(data));
  },

  getTemplates: (): WorkoutTemplate[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.TEMPLATES) || '[]'),
  saveTemplate: (template: WorkoutTemplate) => {
    const data = StorageService.getTemplates();
    const existing = data.findIndex(t => t.id === template.id);
    if (existing > -1) data[existing] = template;
    else data.push(template);
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(data));
  },
  deleteTemplate: (id: string) => {
    const data = StorageService.getTemplates().filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(data));
  },

  getSessions: (): Session[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS) || '[]'),
  saveSession: (session: Session) => {
    const data = StorageService.getSessions();
    const existing = data.findIndex(s => s.id === session.id);
    if (existing > -1) data[existing] = session;
    else data.push(session);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(data));
  },
  deleteSession: (id: string) => {
    const data = StorageService.getSessions().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(data));
  },

  getSchedule: (): ScheduledWorkout[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHEDULE) || '[]'),
  saveSchedule: (schedule: ScheduledWorkout) => {
    const data = StorageService.getSchedule();
    data.push(schedule);
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(data));
  },
  removeFromSchedule: (id: string) => {
    const data = StorageService.getSchedule().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(data));
  }
};
