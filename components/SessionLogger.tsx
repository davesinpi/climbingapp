
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
    <div className="flex flex-col h-screen bg-white dark:bg-slate-950">
      <div className="bg-indigo-600 text-white p-4 flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="p-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          <div>
            <h2 className="font-bold">{session.name}</h2>
            <p className="text-xs opacity-70">Training in progress</p>
          </div>
        </div>
        <button onClick={() => { StorageService.saveSession({ ...session, isCompleted: true, endTime: new Date().toISOString() }); onComplete(); }} className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold">Finish</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="flex gap-2 overflow-x-auto pb-4 sticky top-0 bg-white dark:bg-slate-950 z-10">
          {session.exercises.map((ex, idx) => (
            <button key={idx} onClick={() => setActiveExerciseIndex(idx)} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border ${activeExerciseIndex === idx ? 'bg-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}>
              {exercises.find(e => e.id === ex.exerciseId)?.name || '...'}
            </button>
          ))}
          <button onClick={() => setShowAddExercise(true)} className="px-4 py-2 rounded-full text-xs font-bold border border-dashed border-slate-300 text-indigo-500">+ Add</button>
        </div>

        {showAddExercise && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 dark:text-white">Choose Exercise</h3>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {exercises.map(e => (
                  <button key={e.id} onClick={() => addExerciseToSession(e.id)} className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl dark:text-slate-300">
                    {e.name}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowAddExercise(false)} className="w-full mt-4 py-3 text-slate-400 font-bold">Cancel</button>
            </div>
          </div>
        )}

        {currentExercise ? (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold dark:text-white">{exerciseMeta?.name}</h3>
            <div className="space-y-4">
              {currentExercise.sets.map((set, sIdx) => (
                <div key={set.id} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl relative group">
                  <div className="grid grid-cols-2 gap-4">
                    {exerciseMeta?.type === ExerciseType.Climbing ? (
                      <>
                        <input value={set.grade} onChange={(e) => updateSet(activeExerciseIndex, sIdx, 'grade', e.target.value)} className="bg-white dark:bg-slate-800 p-2 rounded text-xs dark:text-white" placeholder="Grade" />
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateSet(activeExerciseIndex, sIdx, 'attempts', (set.attempts || 0) + 1)} className="bg-white dark:bg-slate-800 px-2 rounded">+</button>
                          <span className="text-xs dark:text-white">{set.attempts} att</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <input type="number" value={set.weight} onChange={(e) => updateSet(activeExerciseIndex, sIdx, 'weight', e.target.value)} className="bg-white dark:bg-slate-800 p-2 rounded text-xs dark:text-white" placeholder="kg" />
                        <input type="number" value={set.reps} onChange={(e) => updateSet(activeExerciseIndex, sIdx, 'reps', e.target.value)} className="bg-white dark:bg-slate-800 p-2 rounded text-xs dark:text-white" placeholder="reps" />
                      </>
                    )}
                  </div>
                  <button onClick={() => removeSet(activeExerciseIndex, sIdx)} className="absolute top-1 right-1 text-slate-300 opacity-0 group-hover:opacity-100">×</button>
                </div>
              ))}
              <button onClick={() => addSet(activeExerciseIndex)} className="w-full border-2 border-dashed border-slate-200 p-4 rounded-xl text-slate-400 font-bold hover:text-indigo-500 transition-colors">+ Add Set</button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400 italic">Add an exercise to start logging!</div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-2xl font-mono font-bold text-indigo-600">{Math.floor(timer/60)}:{(timer%60).toString().padStart(2, '0')}</p>
          <button onClick={() => setIsTimerRunning(!isTimerRunning)} className={`p-3 rounded-full ${isTimerRunning ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
            {isTimerRunning ? 'Pause' : 'Start Rest'}
          </button>
        </div>
        <div className="flex gap-2">
          <button disabled={activeExerciseIndex === 0} onClick={() => setActiveExerciseIndex(v => v-1)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl opacity-50 disabled:hidden">Prev</button>
          <button disabled={activeExerciseIndex === session.exercises.length - 1} onClick={() => setActiveExerciseIndex(v => v+1)} className="p-3 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 rounded-xl disabled:hidden">Next</button>
        </div>
      </div>
    </div>
  );
};

export default SessionLogger;
