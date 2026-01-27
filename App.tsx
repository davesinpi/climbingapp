
import React, { useState, useEffect } from 'react';
import { AppView, Session, WorkoutTemplate, LoggedExercise, ScheduledWorkout } from './types';
import { StorageService } from './services/storage';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SessionLogger from './components/SessionLogger';

const TemplatesView: React.FC<{ onStartSession: (t: WorkoutTemplate) => void }> = ({ onStartSession }) => {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  
  useEffect(() => {
    setTemplates(StorageService.getTemplates());
  }, []);

  return (
    <div className="space-y-6">
       <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold dark:text-white transition-colors">Training Templates</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 dark:shadow-indigo-900/20 active:scale-95">+ Create</button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map(t => (
          <div key={t.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2 dark:text-slate-100">{t.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{t.description}</p>
              <div className="flex gap-2 flex-wrap mb-6">
                {t.blocks.map(b => (
                  <span key={b.id} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
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
  
  useEffect(() => {
    setSessions(StorageService.getSessions().filter(s => s.isCompleted).reverse());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this session? This cannot be undone.')) {
      StorageService.deleteSession(id);
      setSessions(prev => prev.filter(s => s.id !== id));
      onDeleteSession(id);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold dark:text-white transition-colors">Past Sessions</h1>
      <div className="space-y-4">
        {sessions.map(s => (
          <div key={s.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors group relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold dark:text-slate-100">{s.name}</h3>
                <p className="text-slate-500 dark:text-slate-400">{new Date(s.date).toLocaleDateString()} • {s.endTime ? 'Completed' : 'Partial'}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => onEditSession(s)}
                  className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  title="Edit Session"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  onClick={(e) => handleDelete(s.id, e)}
                  className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Delete Session"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
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
            </div>
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

  const handleDeleteSession = (id: string) => {
    // Session is already deleted from storage in HistoryView
    // This hook is for any app-level cleanup needed
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

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {activeView === 'Dashboard' && <Dashboard />}
      {activeView === 'Templates' && <TemplatesView onStartSession={startSessionFromTemplate} />}
      {activeView === 'Calendar' && <CalendarView />}
      {activeView === 'History' && <HistoryView onEditSession={handleEditSession} onDeleteSession={handleDeleteSession} />}
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
