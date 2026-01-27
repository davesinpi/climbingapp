
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
  const [showAddExercise, setShowAddExercise] = useState(false);

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

  const addExerciseToSession = (exerciseId: string) => {
    const updated = { ...session };
    updated.exercises.push({ exerciseId, sets: [] });
    setSession(updated);
    saveToDisk(updated);
    setActiveExerciseIndex(updated.exercises.length - 1);
    setShowAddExercise(false);
  };

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

  const updateSet = (exIdx: number, sIdx: number, field: keyof SetData, value: any) => {
    const updated = { ...session };
    updated.exercises[exIdx].sets[sIdx] = { ...updated.exercises[exIdx].sets[sIdx], [field]: value };
    setSession(updated);
    saveToDisk(updated);
  };

  const removeSet = (exIdx: number, sIdx: number) => {
    const updated = { ...session };
    updated.exercises[exIdx].sets.splice(sIdx, 1);
    setSession(updated);
    saveToDisk(updated);
  };

  const currentExercise = session.exercises[activeExerciseIndex];
  const exerciseMeta = exercises.find(e => e.id === currentExercise?.exerciseId);

  return (
    <div className="flex flex-col min-h-[600px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-indigo-600 text-white p-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={onCancel} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Cancel Session"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div>
            <h2 className="text-xl font-bold leading-tight">{session.name}</h2>
            <p className="text-xs opacity-80 font-medium uppercase tracking-widest">In Progress</p>
          </div>
        </div>
        <button 
          onClick={() => { StorageService.saveSession({ ...session, isCompleted: true, endTime: new Date().toISOString() }); onComplete(); }} 
          className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
        >
          Finish
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-40">
        <div className="flex gap-2 overflow-x-auto pb-6 sticky top-0 bg-white dark:bg-slate-900 z-10 -mx-6 px-6">
          {session.exercises.map((ex, idx) => (
            <button 
              key={idx} 
              onClick={() => setActiveExerciseIndex(idx)} 
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap border transition-all ${
                activeExerciseIndex === idx 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none scale-105' 
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-300'
              }`}
            >
              {exercises.find(e => e.id === ex.exerciseId)?.name || '...'}
            </button>
          ))}
          <button 
            onClick={() => setShowAddExercise(true)} 
            className="px-5 py-2.5 rounded-2xl text-xs font-bold border border-dashed border-slate-300 dark:border-slate-600 text-indigo-600 dark:text-indigo-400 hover:border-indigo-400 transition-colors"
          >
            + Add Exercise
          </button>
        </div>

        {showAddExercise && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-8 shadow-2xl animate-in zoom-in-95">
              <h3 className="text-2xl font-bold mb-6 dark:text-white">Add Exercise</h3>
              <div className="max-h-72 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {exercises.map(e => (
                  <button 
                    key={e.id} 
                    onClick={() => addExerciseToSession(e.id)} 
                    className="w-full text-left p-4 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl dark:text-slate-200 transition-colors border border-transparent hover:border-indigo-100 group flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold">{e.name}</p>
                      <p className="text-[10px] uppercase text-slate-400 font-bold tracking-tighter">{e.type}</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-300 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setShowAddExercise(false)} 
                className="w-full mt-6 py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {currentExercise ? (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{exerciseMeta?.type}</span>
                <h3 className="text-3xl font-black dark:text-white tracking-tight">{exerciseMeta?.name}</h3>
              </div>
            </div>

            <div className="space-y-4">
              {currentExercise.sets.map((set, sIdx) => (
                <div key={set.id} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl relative group border border-slate-100 dark:border-slate-800 hover:border-indigo-200 transition-colors">
                  <div className="grid grid-cols-2 gap-6">
                    {exerciseMeta?.type === ExerciseType.Climbing ? (
                      <>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Grade</label>
                          <input 
                            value={set.grade} 
                            onChange={(e) => updateSet(activeExerciseIndex, sIdx, 'grade', e.target.value)} 
                            className="w-full bg-white dark:bg-slate-800 p-3 rounded-xl font-bold text-lg dark:text-white border-none outline-none focus:ring-2 ring-indigo-500 shadow-sm" 
                            placeholder="Grade" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Attempts</label>
                          <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm">
                            <button onClick={() => updateSet(activeExerciseIndex, sIdx, 'attempts', Math.max(0, (set.attempts || 0) - 1))} className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">-</button>
                            <span className="flex-1 text-center font-bold text-lg dark:text-white">{set.attempts}</span>
                            <button onClick={() => updateSet(activeExerciseIndex, sIdx, 'attempts', (set.attempts || 0) + 1)} className="w-10 h-10 flex items-center justify-center bg-indigo-50 dark:bg-indigo-900 rounded-lg text-indigo-600 dark:text-indigo-300 font-bold hover:bg-indigo-100">+</button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Weight (kg)</label>
                          <input 
                            type="number" 
                            value={set.weight} 
                            onChange={(e) => updateSet(activeExerciseIndex, sIdx, 'weight', parseFloat(e.target.value))} 
                            className="w-full bg-white dark:bg-slate-800 p-3 rounded-xl font-bold text-lg dark:text-white border-none outline-none focus:ring-2 ring-indigo-500 shadow-sm" 
                            placeholder="0" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Reps</label>
                          <input 
                            type="number" 
                            value={set.reps} 
                            onChange={(e) => updateSet(activeExerciseIndex, sIdx, 'reps', parseInt(e.target.value))} 
                            className="w-full bg-white dark:bg-slate-800 p-3 rounded-xl font-bold text-lg dark:text-white border-none outline-none focus:ring-2 ring-indigo-500 shadow-sm" 
                            placeholder="0" 
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <button 
                    onClick={() => removeSet(activeExerciseIndex, sIdx)} 
                    className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-slate-700 shadow-md border border-slate-100 dark:border-slate-600 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <button 
                onClick={() => addSet(activeExerciseIndex)} 
                className="w-full border-2 border-dashed border-slate-200 dark:border-slate-800 p-6 rounded-3xl text-slate-400 font-bold hover:text-indigo-600 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all active:scale-[0.99]"
              >
                + Add Set
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 animate-in fade-in duration-700">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-200 dark:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-medium italic">No exercises added to this session.</p>
            <button onClick={() => setShowAddExercise(true)} className="mt-4 text-indigo-600 font-bold hover:underline">Add one now</button>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-6 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Rest Timer</p>
            <p className="text-3xl font-black font-mono text-indigo-600 dark:text-indigo-400 leading-none">{Math.floor(timer/60)}:{(timer%60).toString().padStart(2, '0')}</p>
          </div>
          <button 
            onClick={() => setIsTimerRunning(!isTimerRunning)} 
            className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 ${
              isTimerRunning 
                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 shadow-sm' 
                : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 shadow-sm'
            }`}
          >
            {isTimerRunning ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Rest
              </>
            )}
          </button>
        </div>
        <div className="flex gap-3">
          <button 
            disabled={activeExerciseIndex === 0} 
            onClick={() => setActiveExerciseIndex(v => v-1)} 
            className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-400 hover:text-indigo-600 disabled:hidden transition-all active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            disabled={activeExerciseIndex === session.exercises.length - 1 || session.exercises.length === 0} 
            onClick={() => setActiveExerciseIndex(v => v+1)} 
            className="w-12 h-12 flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-2xl text-indigo-600 dark:text-indigo-400 font-bold disabled:hidden transition-all active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionLogger;
