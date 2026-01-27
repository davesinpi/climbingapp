
import React, { useState, useEffect, useCallback } from 'react';
import { Session, LoggedExercise, Exercise, SetData, ExerciseType } from '../types';
import { StorageService } from '../services/storage';

interface SessionLoggerProps {
  session: Session;
  onComplete: () => void;
  onCancel: () => void;
}

const SessionLogger: React.FC<SessionLoggerProps> = ({ session: initialSession, onComplete, onCancel }) => {
  const [session, setSession] = useState<Session>(initialSession);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    setExercises(StorageService.getExercises());
  }, []);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const saveToDisk = useCallback((updatedSession: Session) => {
    StorageService.saveSession(updatedSession);
  }, []);

  const addSet = (exerciseIndex: number) => {
    const updated = { ...session };
    const exercise = updated.exercises[exerciseIndex];
    const newSet: SetData = { id: Math.random().toString(36).substr(2, 9), weight: 0, reps: 0 };
    
    const exMeta = exercises.find(e => e.id === exercise.exerciseId);
    if (exMeta?.type === ExerciseType.Hangboard) {
      newSet.edgeSize = 20;
      newSet.hangTime = 7;
    } else if (exMeta?.type === ExerciseType.Climbing) {
      newSet.grade = 'V3';
      newSet.attempts = 1;
      newSet.sends = 0;
    }

    exercise.sets.push(newSet);
    setSession(updated);
    saveToDisk(updated);
    
    setTimer(0);
    setIsTimerRunning(true);
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: keyof SetData, value: any) => {
    const updated = { ...session };
    updated.exercises[exerciseIndex].sets[setIndex] = {
      ...updated.exercises[exerciseIndex].sets[setIndex],
      [field]: value
    };
    setSession(updated);
    saveToDisk(updated);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updated = { ...session };
    updated.exercises[exerciseIndex].sets.splice(setIndex, 1);
    setSession(updated);
    saveToDisk(updated);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const currentExercise = session.exercises[activeExerciseIndex];
  const exerciseMeta = exercises.find(e => e.id === currentExercise?.exerciseId);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-slate-950 transition-colors">
      {/* Header */}
      <div className="bg-indigo-600 dark:bg-indigo-700 text-white p-4 flex justify-between items-center shadow-md z-20">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div>
            <h2 className="text-xl font-bold">{session.name}</h2>
            <p className="text-sm opacity-80">{initialSession.isCompleted ? 'Editing past session' : `Started at ${new Date(session.startTime!).toLocaleTimeString()}`}</p>
          </div>
        </div>
        <button 
          onClick={() => {
            const final = { ...session, isCompleted: true, endTime: session.endTime || new Date().toISOString() };
            StorageService.saveSession(final);
            onComplete();
          }}
          className="bg-white text-indigo-600 dark:text-indigo-700 px-4 py-2 rounded-lg font-bold shadow-sm active:scale-95 transition-transform"
        >
          {initialSession.isCompleted ? 'Save Changes' : 'Finish Session'}
        </button>
      </div>

      {/* Main Logging Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="flex gap-2 overflow-x-auto pb-4 sticky top-0 bg-white dark:bg-slate-950 z-10 transition-colors">
          {session.exercises.map((ex, idx) => {
            const meta = exercises.find(e => e.id === ex.exerciseId);
            return (
              <button
                key={ex.exerciseId + idx}
                onClick={() => setActiveExerciseIndex(idx)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${
                  activeExerciseIndex === idx 
                    ? 'bg-indigo-100 border-indigo-500 text-indigo-700 dark:bg-indigo-900/50 dark:border-indigo-400 dark:text-indigo-300' 
                    : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                }`}
              >
                {meta?.name || 'Unknown Exercise'}
              </button>
            );
          })}
        </div>

        {currentExercise && (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{exerciseMeta?.name}</h3>
              <span className="text-sm text-indigo-500 dark:text-indigo-400 font-semibold">{exerciseMeta?.type}</span>
            </div>

            <div className="space-y-4">
              {currentExercise.sets.map((set, sIdx) => (
                <div key={set.id} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative group transition-colors">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {exerciseMeta?.type === ExerciseType.Climbing ? (
                      <>
                        <div>
                          <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1 uppercase font-bold tracking-tight">Grade</label>
                          <input 
                            value={set.grade} 
                            onChange={(e) => updateSet(activeExerciseIndex, sIdx, 'grade', e.target.value)}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-1 text-sm dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1 uppercase font-bold tracking-tight">Attempts</label>
                          <div className="flex items-center gap-2">
                             <button onClick={() => updateSet(activeExerciseIndex, sIdx, 'attempts', (set.attempts || 0) + 1)} className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded px-2 text-indigo-600 dark:text-indigo-400 font-bold">+</button>
                             <span className="font-mono dark:text-white">{set.attempts}</span>
                             <button onClick={() => updateSet(activeExerciseIndex, sIdx, 'attempts', Math.max(0, (set.attempts || 0) - 1))} className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded px-2 text-slate-400 font-bold">-</button>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1 uppercase font-bold tracking-tight">Sends</label>
                          <div className="flex items-center gap-2">
                             <button onClick={() => updateSet(activeExerciseIndex, sIdx, 'sends', (set.sends || 0) + 1)} className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded px-2 text-green-600 dark:text-green-400 font-bold">+</button>
                             <span className="font-mono dark:text-white">{set.sends}</span>
                             <button onClick={() => updateSet(activeExerciseIndex, sIdx, 'sends', Math.max(0, (set.sends || 0) - 1))} className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded px-2 text-slate-400 font-bold">-</button>
                          </div>
                        </div>
                      </>
                    ) : exerciseMeta?.type === ExerciseType.Hangboard ? (
                      <>
                        <div>
                          <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1 uppercase font-bold tracking-tight">Weight (+/-)</label>
                          <input 
                            type="number"
                            value={set.weight} 
                            onChange={(e) => updateSet(activeExerciseIndex, sIdx, 'weight', parseFloat(e.target.value))}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-1 text-sm dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1 uppercase font-bold tracking-tight">Edge (mm)</label>
                          <input 
                            type="number"
                            value={set.edgeSize} 
                            onChange={(e) => updateSet(activeExerciseIndex, sIdx, 'edgeSize', parseInt(e.target.value))}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-1 text-sm dark:text-white"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1 uppercase font-bold tracking-tight">Weight</label>
                          <input 
                            type="number"
                            value={set.weight} 
                            onChange={(e) => updateSet(activeExerciseIndex, sIdx, 'weight', parseFloat(e.target.value))}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-1 text-sm dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1 uppercase font-bold tracking-tight">Reps</label>
                          <input 
                            type="number"
                            value={set.reps} 
                            onChange={(e) => updateSet(activeExerciseIndex, sIdx, 'reps', parseInt(e.target.value))}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-1 text-sm dark:text-white"
                          />
                        </div>
                      </>
                    )}
                    <div>
                      <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1 uppercase font-bold tracking-tight">RPE (1-10)</label>
                      <input 
                        type="number"
                        min="1" max="10"
                        value={set.rpe} 
                        onChange={(e) => updateSet(activeExerciseIndex, sIdx, 'rpe', parseInt(e.target.value))}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-1 text-sm dark:text-white"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => removeSet(activeExerciseIndex, sIdx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    ×
                  </button>
                </div>
              ))}

              <button 
                onClick={() => addSet(activeExerciseIndex)}
                className="w-full border-2 border-dashed border-slate-200 dark:border-slate-800 p-4 rounded-xl text-slate-400 dark:text-slate-600 font-medium hover:border-indigo-300 dark:hover:border-indigo-800 hover:text-indigo-400 dark:hover:text-indigo-400 transition-colors"
              >
                + Add Set
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Timer & Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.05)] transition-colors z-30">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Rest Timer</p>
            <p className={`text-2xl font-mono font-bold transition-colors ${isTimerRunning ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600'}`}>
              {formatTime(timer)}
            </p>
          </div>
          <button 
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className={`p-3 rounded-full transition-colors ${
              isTimerRunning ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
            }`}
          >
            {isTimerRunning ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          <button onClick={() => setTimer(0)} className="text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
          </button>
        </div>

        <div className="flex gap-2">
           <button 
            disabled={activeExerciseIndex === 0}
            onClick={() => setActiveExerciseIndex(prev => prev - 1)}
            className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl disabled:opacity-30 transition-colors"
           >
            Prev
           </button>
           <button 
            disabled={activeExerciseIndex === session.exercises.length - 1}
            onClick={() => setActiveExerciseIndex(prev => prev + 1)}
            className="p-3 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl disabled:opacity-30 transition-colors"
           >
            Next
           </button>
        </div>
      </div>
    </div>
  );
};

export default SessionLogger;
