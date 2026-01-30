
import { WorkoutTemplate, Exercise, Session, ScheduledWorkout } from '../types';
import { SEED_EXERCISES, SEED_TEMPLATES } from '../constants';

const STORAGE_KEYS = {
  EXERCISES: 'climb_app_exercises',
  TEMPLATES: 'climb_app_templates',
  SESSIONS: 'climb_app_sessions',
  SCHEDULE: 'climb_app_schedule',
  SYNC_QUEUE: 'climb_app_sync_queue_v2',
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
    if (!localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE)) {
      localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify([]));
    }

    // Try processing any leftover items from a previous session
    if (navigator.onLine) {
      StorageService.processSyncQueue();
    }
  },

  markForSync: (key: string, id: string, type: 'create' | 'update' | 'delete') => {
    const queue = JSON.parse(localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE) || '[]');
    queue.push({ key, id, type, timestamp: Date.now() });
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
    
    // Notify app of new local changes
    window.dispatchEvent(new CustomEvent('local-data-changed'));
    
    if (navigator.onLine) {
      StorageService.processSyncQueue();
    }
  },

  processSyncQueue: async () => {
    const queue = JSON.parse(localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE) || '[]');
    if (queue.length === 0) return;

    window.dispatchEvent(new CustomEvent('sync-started'));
    
    try {
      // Simulate real cloud latency and batching
      await new Promise(resolve => setTimeout(resolve, Math.min(queue.length * 200, 2000)));
      
      // Successfully synced
      localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify([]));
      window.dispatchEvent(new CustomEvent('sync-complete'));
    } catch (err) {
      console.error("[Sync] Could not upload changes.", err);
      window.dispatchEvent(new CustomEvent('sync-failed'));
    }
  },

  getExercises: (): Exercise[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.EXERCISES) || '[]'),
  saveExercise: (exercise: Exercise) => {
    const data = StorageService.getExercises();
    const existing = data.findIndex(e => e.id === exercise.id);
    if (existing > -1) data[existing] = exercise;
    else data.push(exercise);
    localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(data));
    StorageService.markForSync(STORAGE_KEYS.EXERCISES, exercise.id, existing > -1 ? 'update' : 'create');
  },

  getTemplates: (): WorkoutTemplate[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.TEMPLATES) || '[]'),
  saveTemplate: (template: WorkoutTemplate) => {
    const data = StorageService.getTemplates();
    const existingIdx = data.findIndex(t => t.id === template.id);
    if (existingIdx > -1) data[existingIdx] = template;
    else data.push(template);
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(data));
    StorageService.markForSync(STORAGE_KEYS.TEMPLATES, template.id, existingIdx > -1 ? 'update' : 'create');
  },
  
  deleteTemplate: (id: string) => {
    const data = StorageService.getTemplates().filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(data));
    StorageService.markForSync(STORAGE_KEYS.TEMPLATES, id, 'delete');
  },

  getSessions: (): Session[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS) || '[]'),
  saveSession: (session: Session) => {
    const data = StorageService.getSessions();
    const existingIdx = data.findIndex(s => s.id === session.id);
    if (existingIdx > -1) data[existingIdx] = session;
    else data.push(session);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(data));
    StorageService.markForSync(STORAGE_KEYS.SESSIONS, session.id, existingIdx > -1 ? 'update' : 'create');
  },
  
  deleteSession: (id: string) => {
    const data = StorageService.getSessions().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(data));
    StorageService.markForSync(STORAGE_KEYS.SESSIONS, id, 'delete');
  },

  getSyncQueueLength: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE) || '[]').length;
  }
};
