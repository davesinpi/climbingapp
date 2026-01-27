
import React, { useState, useEffect } from 'react';
import { AppView, Session, WorkoutTemplate, LoggedExercise, ScheduledWorkout, Exercise, ExerciseType } from './types';
import { StorageService } from './services/storage';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SessionLogger from './components/SessionLogger';
import TemplateEditor from './components/TemplateEditor';

const ExerciseModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (e: Exercise) => void }> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<ExerciseType>(ExerciseType.Climbing);
  const [category, setCategory] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-2xl font-bold mb-6 dark:text-white">New Exercise</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Exercise Name</label>
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 outline-none focus:ring-2 ring-indigo-500 dark:text-white"
              placeholder="e.g. Weighted Pull-ups"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Training Type</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value as ExerciseType)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 outline-none focus:ring-2 ring-indigo-500 dark:text-white"
            >
              {Object.values(ExerciseType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category / Focus</label>
            <input 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 outline-none focus:ring-2 ring-indigo-500 dark:text-white"
              placeholder="e.g. Upper Body, Fingers, Power"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</button>
          <button 
            onClick={() => {
              if (name) {
                onSave({ id: Math.random().toString(36).substr(2, 9), name, type, category });
                setName('');
                onClose();
              }
            }}
            className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

const TemplateSelectorModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onSelect: (t: WorkoutTemplate | null) => void;
  templates: WorkoutTemplate[];
}> = ({ isOpen, onClose, onSelect, templates }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
        <h3 className="text-xl font-bold mb-4 dark:text-white text-center">Log Workout</h3>
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          <button 
            onClick={() => onSelect(null)}
            className="w-full text-left p-4 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl border border-transparent hover:border-indigo-100 transition-all group"
          >
            <p className="font-bold text-indigo-600 dark:text-indigo-400">Blank Session</p>
            <p className="text-[10px] uppercase text-slate-400 font-bold tracking-tight">Add exercises manually</p>
          </button>
          
          <div className="py-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2">From Template</p>
            {templates.map(t => (
              <button 
                key={t.id} 
                onClick={() => onSelect(t)} 
                className="w-full text-left p-4 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl dark:text-slate-200 transition-all border border-transparent hover:border-indigo-100 group flex items-center justify-between mb-2"
              >
                <div>
                  <p className="font-bold">{t.name}</p>
                  <p className="text-[10px] uppercase text-slate-400 font-bold tracking-tighter">{t.blocks.length} Blocks</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-300 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            ))}
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="w-full mt-4 py-3 text-slate-400 font-bold hover:text-slate-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const TemplatesView: React.FC<{ 
  onStartSession: (t: WorkoutTemplate) => void;
  onStartBlankSession: () => void;
  onCreateTemplate: () => void;
  onEditTemplate: (t: WorkoutTemplate) => void;
}> = ({ onStartSession, onStartBlankSession, onCreateTemplate, onEditTemplate }) => {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  
  useEffect(() => {
    setTemplates(StorageService.getTemplates());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this template?')) {
      StorageService.deleteTemplate(id);
      setTemplates(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-6">
       <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Templates</h1>
          <p className="text-slate-500 text-sm">Design or pick a workout</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onStartBlankSession}
            className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Quick Log
          </button>
          <button 
            onClick={onCreateTemplate}
            className="flex-1 sm:flex-none bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
          >
            + Create Workout
          </button>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map(t => (
          <div key={t.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="relative">
              <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => onEditTemplate(t)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button 
                  onClick={(e) => handleDelete(t.id, e)}
                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-slate-100 pr-12">{t.name}</h3>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">{t.description}</p>
              <div className="flex gap-2 flex-wrap mb-6">
                {t.blocks.map(b => (
                  <span key={b.id} className="px-3 py-1 bg-slate-50 dark:bg-slate-800/50 rounded-full text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {b.type}
                  </span>
                ))}
              </div>
            </div>
            <button 
              onClick={() => onStartSession(t)}
              className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-black dark:hover:bg-indigo-700 transition-colors active:scale-[0.98]"
            >
              Start Session
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const CalendarView: React.FC<{ 
  sessions: Session[], 
  onEditSession: (s: Session) => void,
  onAddSession: (date: Date) => void 
}> = ({ sessions, onEditSession, onAddSession }) => {
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const today = new Date();
  
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getSessionsForDay = (day: number) => {
    return sessions.filter(s => {
      const d = new Date(s.date);
      return d.getDate() === day && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    });
  };

  const sessionsForSelectedDay = getSessionsForDay(selectedDay);
  const selectedDateObject = new Date(today.getFullYear(), today.getMonth(), selectedDay);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <header>
        <h1 className="text-3xl font-bold dark:text-white transition-colors">Calendar</h1>
        <p className="text-slate-500 dark:text-slate-400">{today.toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
      </header>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="grid grid-cols-7 gap-2 text-center mb-4">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
            <div key={d} className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map(d => {
            const isToday = d === today.getDate();
            const isSelected = d === selectedDay;
            const sessionsCount = getSessionsForDay(d).length;
            
            return (
              <button 
                key={d} 
                onClick={() => setSelectedDay(d)}
                className={`aspect-square border border-slate-100 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center relative transition-all active:scale-95 ${
                  isSelected 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' 
                    : isToday 
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-sm font-bold">{d}</span>
                {sessionsCount > 0 && (
                  <div className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-400'}`}></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold dark:text-slate-100 flex items-center gap-2">
            Sessions on {today.toLocaleString('default', { month: 'short' })} {selectedDay}
            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs font-mono text-slate-500">{sessionsForSelectedDay.length}</span>
          </h2>
          <button 
            onClick={() => onAddSession(selectedDateObject)}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Workout
          </button>
        </div>
        
        {sessionsForSelectedDay.length > 0 ? (
          sessionsForSelectedDay.map(s => (
            <div 
              key={s.id} 
              onClick={() => onEditSession(s)}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex justify-between items-center cursor-pointer hover:border-indigo-400 transition-colors group"
            >
              <div>
                <p className="font-bold dark:text-slate-100 group-hover:text-indigo-600 transition-colors">{s.name}</p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">{s.exercises.length} Exercises • {s.exercises.reduce((acc, e) => acc + e.sets.length, 0)} Sets</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-400 italic text-sm">No training logged for this day.</p>
            <button 
              onClick={() => onAddSession(selectedDateObject)}
              className="mt-3 text-sm font-bold text-indigo-600 hover:underline"
            >
              Log workout for this day
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const HistoryView: React.FC<{ onEditSession: (s: Session) => void; onDeleteSession: (id: string) => void }> = ({ onEditSession, onDeleteSession }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [exerciseLibrary, setExerciseLibrary] = useState<Exercise[]>([]);
  
  useEffect(() => {
    setSessions(StorageService.getSessions().filter(s => s.isCompleted).reverse());
    setExerciseLibrary(StorageService.getExercises());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Remove this session log?')) {
      StorageService.deleteSession(id);
      setSessions(prev => prev.filter(s => s.id !== id));
      onDeleteSession(id);
    }
  };

  const getExerciseName = (id: string) => exerciseLibrary.find(e => e.id === id)?.name || 'Unknown Exercise';

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold dark:text-white">Logbook</h1>
      <div className="space-y-4">
        {sessions.map(s => (
          <div key={s.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div onClick={() => setExpandedSessionId(expandedSessionId === s.id ? null : s.id)} className="cursor-pointer">
                <h3 className="text-xl font-bold dark:text-slate-100">{s.name}</h3>
                <p className="text-slate-500 text-sm">{new Date(s.date).toLocaleDateString()} • {s.endTime ? 'Completed' : 'Draft'}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onEditSession(s)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={(e) => handleDelete(s.id, e)} className="p-2 text-slate-400 hover:text-red-600 transition-colors bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>

            <div onClick={() => setExpandedSessionId(expandedSessionId === s.id ? null : s.id)} className="grid grid-cols-3 gap-4 text-center cursor-pointer">
               <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                 <p className="text-[10px] text-slate-400 uppercase font-bold">Exercises</p>
                 <p className="font-bold dark:text-white">{s.exercises.length}</p>
               </div>
               <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                 <p className="text-[10px] text-slate-400 uppercase font-bold">Total Sets</p>
                 <p className="font-bold dark:text-white">{s.exercises.reduce((acc, e) => acc + e.sets.length, 0)}</p>
               </div>
               <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                 <p className="text-[10px] text-slate-400 uppercase font-bold">Status</p>
                 <p className="text-xs font-bold text-green-500">SAVED</p>
               </div>
            </div>

            {expandedSessionId === s.id && (
              <div className="mt-6 space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2">
                {s.exercises.map((ex, exIdx) => (
                  <div key={exIdx} className="space-y-1">
                    <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">{getExerciseName(ex.exerciseId)}</h4>
                    <div className="flex flex-wrap gap-2">
                      {ex.sets.map((set, setIdx) => (
                        <div key={setIdx} className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded font-mono dark:text-slate-400">
                          {set.weight ? `${set.weight}kg` : ''}{set.reps ? `x${set.reps}` : ''}
                          {set.grade ? ` ${set.grade}` : ''}
                          {set.attempts ? ` (${set.attempts}a)` : ''}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('Dashboard');
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | null>(null);
  const [exerciseLibrary, setExerciseLibrary] = useState<Exercise[]>([]);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [allSessions, setAllSessions] = useState<Session[]>([]);
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>([]);
  
  // State for date picking from calendar
  const [dateForNewSession, setDateForNewSession] = useState<Date | null>(null);

  useEffect(() => {
    StorageService.init();
    setExerciseLibrary(StorageService.getExercises());
    setWorkoutTemplates(StorageService.getTemplates());
    const sessions = StorageService.getSessions();
    setAllSessions(sessions);
    const current = sessions.find(s => !s.isCompleted);
    if (current) {
      setActiveSession(current);
    }
  }, []);

  const refreshSessions = () => {
    const sessions = StorageService.getSessions();
    setAllSessions(sessions);
  };

  const createSession = (template: WorkoutTemplate | null, date: Date = new Date()) => {
    const newSession: Session = {
      id: Math.random().toString(36).substr(2, 9),
      templateId: template?.id,
      name: template ? template.name : "Quick Session",
      date: date.toISOString(),
      startTime: date.toISOString(),
      isCompleted: false,
      exercises: template ? template.blocks.flatMap(block => 
        block.exercises.map(be => ({ exerciseId: be.exerciseId, sets: [] }))
      ) : []
    };
    StorageService.saveSession(newSession);
    setAllSessions(prev => [...prev, newSession]);
    setActiveSession(newSession);
    setActiveView('ActiveSession');
  };

  const startSessionFromTemplate = (template: WorkoutTemplate) => {
    createSession(template);
  };

  const startBlankSession = () => {
    createSession(null);
  };

  const handleSaveTemplate = (template: WorkoutTemplate) => {
    StorageService.saveTemplate(template);
    setWorkoutTemplates(StorageService.getTemplates());
    setEditingTemplate(null);
    setActiveView('Templates');
  };

  const handleSaveExercise = (exercise: Exercise) => {
    StorageService.saveExercise(exercise);
    setExerciseLibrary(StorageService.getExercises());
  };

  const handleCompleteSession = () => {
    setActiveSession(null);
    refreshSessions();
    setActiveView('History');
  };

  const handleCancelSession = () => {
    if (activeSession && window.confirm('Discard current workout session?')) {
      StorageService.deleteSession(activeSession.id);
      setActiveSession(null);
      refreshSessions();
      setActiveView('Dashboard');
    }
  };

  const handleEditSession = (s: Session) => {
    if (s.isCompleted) {
      setActiveSession({ ...s, isCompleted: false });
    } else {
      setActiveSession(s);
    }
    setActiveView('ActiveSession');
  };

  const handleAddSessionToDate = (date: Date) => {
    setDateForNewSession(date);
  };

  const handleSelectTemplateForDate = (template: WorkoutTemplate | null) => {
    if (dateForNewSession) {
      createSession(template, dateForNewSession);
      setDateForNewSession(null);
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView} hasActiveSession={activeSession !== null}>
      {activeView === 'Dashboard' && (
        <Dashboard 
          activeSession={activeSession}
          onEditSession={handleEditSession} 
          onCancelActiveSession={handleCancelSession}
        />
      )}
      {activeView === 'Templates' && (
        <TemplatesView 
          onStartSession={startSessionFromTemplate} 
          onStartBlankSession={startBlankSession}
          onCreateTemplate={() => { setEditingTemplate(null); setActiveView('TemplateEditor'); }}
          onEditTemplate={(t) => { setEditingTemplate(t); setActiveView('TemplateEditor'); }}
        />
      )}
      {activeView === 'TemplateEditor' && (
        <TemplateEditor 
          template={editingTemplate}
          onSave={handleSaveTemplate}
          onCancel={() => { setEditingTemplate(null); setActiveView('Templates'); }}
        />
      )}
      {activeView === 'Calendar' && (
        <CalendarView 
          sessions={allSessions} 
          onEditSession={handleEditSession} 
          onAddSession={handleAddSessionToDate}
        />
      )}
      {activeView === 'History' && <HistoryView onEditSession={handleEditSession} onDeleteSession={refreshSessions} />}
      {activeView === 'ActiveSession' && activeSession && (
        <SessionLogger 
          session={activeSession} 
          onComplete={handleCompleteSession}
          onCancel={handleCancelSession}
        />
      )}
      {activeView === 'Exercises' && (
        <div className="space-y-6">
          <header className="flex justify-between items-center">
            <h1 className="text-3xl font-bold dark:text-white">Exercise Library</h1>
            <button 
              onClick={() => setIsExerciseModalOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-md"
            >
              + Add Exercise
            </button>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {exerciseLibrary.map(e => (
               <div key={e.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <h4 className="font-bold dark:text-slate-100">{e.name}</h4>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full font-bold uppercase">{e.type}</span>
                    <span className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full font-bold uppercase">{e.category}</span>
                  </div>
               </div>
             ))}
          </div>
          <ExerciseModal 
            isOpen={isExerciseModalOpen} 
            onClose={() => setIsExerciseModalOpen(false)} 
            onSave={handleSaveExercise} 
          />
        </div>
      )}

      {/* Modal for picking a template when adding to a specific date */}
      <TemplateSelectorModal 
        isOpen={dateForNewSession !== null}
        onClose={() => setDateForNewSession(null)}
        onSelect={handleSelectTemplateForDate}
        templates={workoutTemplates}
      />
    </Layout>
  );
};

export default App;
