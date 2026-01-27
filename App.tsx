
import React, { useState, useEffect } from 'react';
import { AppView, Session, WorkoutTemplate, LoggedExercise, ScheduledWorkout, Exercise } from './types';
import { StorageService } from './services/storage';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SessionLogger from './components/SessionLogger';
import TemplateEditor from './components/TemplateEditor';

const TemplatesView: React.FC<{ 
  onStartSession: (t: WorkoutTemplate) => void;
  onCreateTemplate: () => void;
  onEditTemplate: (t: WorkoutTemplate) => void;
  onDeleteTemplate: (id: string) => void;
}> = ({ onStartSession, onCreateTemplate, onEditTemplate, onDeleteTemplate }) => {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  
  useEffect(() => {
    setTemplates(StorageService.getTemplates());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this template?')) {
      StorageService.deleteTemplate(id);
      setTemplates(prev => prev.filter(t => t.id !== id));
      onDeleteTemplate(id);
    }
  };

  return (
    <div className="space-y-6">
       <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold dark:text-white transition-colors">Training Templates</h1>
        <button 
          onClick={onCreateTemplate}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 dark:shadow-indigo-900/20 active:scale-95"
        >
          + Create
        </button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map(t => (
          <div key={t.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="relative">
              <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => onEditTemplate(t)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  onClick={(e) => handleDelete(t.id, e)}
                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-slate-100 pr-12">{t.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">{t.description}</p>
              <div className="flex gap-2 flex-wrap mb-6">
                {t.blocks.map(b => (
                  <span key={b.id} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                    {b.type}
                  </span>
                ))}
              </div>
            </div>
            <button 
              onClick={() => onStartSession(t)}
              className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-black dark:hover:bg-indigo-700 transition-colors"
            >
              Start Session
            </button>
          </div>
        ))}
        {templates.length === 0 && (
          <div className="col-span-full py-20 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
            <p className="text-slate-400">No templates yet. Create your first training program!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CalendarView: React.FC = () => {
  const [scheduled, setScheduled] = useState<ScheduledWorkout[]>([]);
  const today = new Date();
  
  useEffect(() => {
    setScheduled(StorageService.getSchedule());
  }, []);

  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold dark:text-white transition-colors">Training Calendar</h1>
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="grid grid-cols-7 gap-2 text-center mb-4">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
            <div key={d} className="text-xs font-bold text-slate-400 dark:text-slate-500">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map(d => {
            const isToday = d === today.getDate();
            return (
              <div 
                key={d} 
                className={`aspect-square border border-slate-100 dark:border-slate-800 rounded-lg p-1 flex flex-col items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isToday ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : ''}`}
              >
                <span className={`text-sm ${isToday ? 'font-bold text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>{d}</span>
                {d % 3 === 0 && <div className="w-2 h-2 rounded-full bg-indigo-400 dark:bg-indigo-500 mb-1"></div>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-300 text-sm transition-colors">
        Pro tip: Stick to your schedule to see 30% faster results in recruitment.
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
    if (window.confirm('Are you sure you want to remove this session? This cannot be undone.')) {
      StorageService.deleteSession(id);
      setSessions(prev => prev.filter(s => s.id !== id));
      onDeleteSession(id);
    }
  };

  const getExerciseName = (id: string) => exerciseLibrary.find(e => e.id === id)?.name || 'Unknown Exercise';

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold dark:text-white transition-colors">Past Sessions</h1>
      <div className="space-y-4">
        {sessions.map(s => (
          <div key={s.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors group relative">
            <div 
              className="flex justify-between items-start mb-4 cursor-pointer"
              onClick={() => setExpandedSessionId(expandedSessionId === s.id ? null : s.id)}
            >
              <div>
                <h3 className="text-xl font-bold dark:text-slate-100">{s.name}</h3>
                <p className="text-slate-500 dark:text-slate-400">{new Date(s.date).toLocaleDateString()} • {s.endTime ? 'Completed' : 'Partial'}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); onEditSession(s); }}
                  className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-slate-50 dark:bg-slate-800 rounded-lg"
                  title="Edit Session"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  onClick={(e) => handleDelete(s.id, e)}
                  className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors bg-slate-50 dark:bg-slate-800 rounded-lg"
                  title="Delete Session"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div 
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm cursor-pointer"
              onClick={() => setExpandedSessionId(expandedSessionId === s.id ? null : s.id)}
            >
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded transition-colors">
                <p className="text-slate-400 dark:text-slate-500 text-xs uppercase font-bold tracking-tighter">Exercises</p>
                <p className="font-bold dark:text-slate-200">{s.exercises.length}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded transition-colors">
                <p className="text-slate-400 dark:text-slate-500 text-xs uppercase font-bold tracking-tighter">Total Sets</p>
                <p className="font-bold dark:text-slate-200">{s.exercises.reduce((acc, e) => acc + e.sets.length, 0)}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded transition-colors">
                <p className="text-slate-400 dark:text-slate-500 text-xs uppercase font-bold tracking-tighter">Pain Score</p>
                <p className="font-bold text-amber-600 dark:text-amber-500">{s.painLevel ?? 'N/A'}/10</p>
              </div>
              <div className="flex items-center justify-center text-slate-400 dark:text-slate-600">
                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transform transition-transform ${expandedSessionId === s.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                 </svg>
              </div>
            </div>

            {expandedSessionId === s.id && (
              <div className="mt-6 space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
                {s.exercises.map((ex, exIdx) => (
                  <div key={exIdx} className="space-y-2">
                    <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                      {getExerciseName(ex.exerciseId)}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4">
                      {ex.sets.map((set, setIdx) => (
                        <div key={set.id} className="text-xs bg-slate-50 dark:bg-slate-800 p-2 rounded flex justify-between items-center text-slate-600 dark:text-slate-400">
                          <span className="font-mono">Set {setIdx + 1}</span>
                          <span className="font-medium text-slate-900 dark:text-slate-200">
                            {set.weight ? `${set.weight}kg` : ''} 
                            {set.reps ? ` × ${set.reps}` : ''}
                            {set.grade ? ` ${set.grade}` : ''}
                            {set.attempts ? ` (${set.attempts} att, ${set.sends} sends)` : ''}
                          </span>
                          <span className="opacity-60">RPE {set.rpe || '-'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {sessions.length === 0 && (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 transition-colors">
            <p className="text-slate-400 dark:text-slate-600 italic">No history yet. Start sending!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('Dashboard');
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | null>(null);

  useEffect(() => {
    StorageService.init();
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
        block.exercises.map(be => ({
          exerciseId: be.exerciseId,
          sets: []
        }))
      )
    };
    StorageService.saveSession(newSession);
    setActiveSession(newSession);
    setActiveView('ActiveSession');
  };

  const handleEditSession = (session: Session) => {
    setActiveSession(session);
    setActiveView('ActiveSession');
  };

  const handleSaveTemplate = (template: WorkoutTemplate) => {
    StorageService.saveTemplate(template);
    setEditingTemplate(null);
    setActiveView('Templates');
  };

  if (activeView === 'ActiveSession' && activeSession) {
    return (
      <SessionLogger 
        session={activeSession} 
        onComplete={() => {
          setActiveSession(null);
          setActiveView('History');
        }}
        onCancel={() => {
          setActiveSession(null);
          setActiveView('Dashboard');
        }}
      />
    );
  }

  if (activeView === 'TemplateEditor') {
    return (
      <Layout activeView={activeView} setActiveView={setActiveView}>
        <TemplateEditor 
          template={editingTemplate}
          onSave={handleSaveTemplate}
          onCancel={() => {
            setEditingTemplate(null);
            setActiveView('Templates');
          }}
        />
      </Layout>
    );
  }

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {activeView === 'Dashboard' && <Dashboard onEditSession={handleEditSession} />}
      {activeView === 'Templates' && (
        <TemplatesView 
          onStartSession={startSessionFromTemplate} 
          onCreateTemplate={() => {
            setEditingTemplate(null);
            setActiveView('TemplateEditor');
          }}
          onEditTemplate={(t) => {
            setEditingTemplate(t);
            setActiveView('TemplateEditor');
          }}
          onDeleteTemplate={() => {}}
        />
      )}
      {activeView === 'Calendar' && <CalendarView />}
      {activeView === 'History' && <HistoryView onEditSession={handleEditSession} onDeleteSession={() => {}} />}
      {activeView === 'Exercises' && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold dark:text-white transition-colors">Exercise Library</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {StorageService.getExercises().map(e => (
               <div key={e.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex justify-between items-center transition-colors">
                  <div>
                    <h4 className="font-bold dark:text-slate-100">{e.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-tighter">{e.type} • {e.category}</p>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
               </div>
             ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
