
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

  useEffect(() => {
    StorageService.init();
    setExerciseLibrary(StorageService.getExercises());
    const current = StorageService.getSessions().find(s => !s.isCompleted);
    if (current) {
      setActiveSession(current);
      setActiveView('ActiveSession');
    }
  }, []);

  const startSessionFromTemplate = (template: WorkoutTemplate) => {
    const newSession: Session = {
      id: Math.random().toString(36).substr(2, 9),
      templateId: template.id,
      name: template.name,
      date: new Date().toISOString(),
      startTime: new Date().toISOString(),
      isCompleted: false,
      exercises: template.blocks.flatMap(block => 
        block.exercises.map(be => ({ exerciseId: be.exerciseId, sets: [] }))
      )
    };
    StorageService.saveSession(newSession);
    setActiveSession(newSession);
    setActiveView('ActiveSession');
  };

  const startBlankSession = () => {
    const newSession: Session = {
      id: Math.random().toString(36).substr(2, 9),
      name: "Quick Session",
      date: new Date().toISOString(),
      startTime: new Date().toISOString(),
      isCompleted: false,
      exercises: []
    };
    StorageService.saveSession(newSession);
    setActiveSession(newSession);
    setActiveView('ActiveSession');
  };

  const handleSaveTemplate = (template: WorkoutTemplate) => {
    StorageService.saveTemplate(template);
    setEditingTemplate(null);
    setActiveView('Templates');
  };

  const handleSaveExercise = (exercise: Exercise) => {
    StorageService.saveExercise(exercise);
    setExerciseLibrary(StorageService.getExercises());
  };

  if (activeView === 'ActiveSession' && activeSession) {
    return (
      <SessionLogger 
        session={activeSession} 
        onComplete={() => { setActiveSession(null); setActiveView('History'); }}
        onCancel={() => { setActiveSession(null); setActiveView('Dashboard'); }}
      />
    );
  }

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {activeView === 'Dashboard' && <Dashboard onEditSession={(s) => { setActiveSession(s); setActiveView('ActiveSession'); }} />}
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
      {activeView === 'History' && <HistoryView onEditSession={(s) => { setActiveSession(s); setActiveView('ActiveSession'); }} onDeleteSession={() => {}} />}
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
    </Layout>
  );
};

export default App;
