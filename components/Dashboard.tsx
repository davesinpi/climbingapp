
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StorageService } from '../services/storage';
import { Session, Exercise } from '../types';
import { GeminiService } from '../services/gemini';

interface DashboardProps {
  onEditSession: (session: Session) => void;
  activeSession: Session | null;
  onCancelActiveSession: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onEditSession, activeSession, onCancelActiveSession }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>('Loading AI insights...');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Small delay ensures the layout engine has finished initial passes
    const timer = setTimeout(() => setIsMounted(true), 50);
    
    const s = StorageService.getSessions().filter(sess => sess.isCompleted);
    setSessions(s);
    setExercises(StorageService.getExercises());
    
    if (s.length > 0) {
      handleRefreshAI(s);
    } else {
      setAiAnalysis("Log your first session to get AI training tips!");
    }

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const handleRefreshAI = async (currentSessions?: Session[]) => {
    const targetSessions = currentSessions || sessions;
    if (targetSessions.length === 0) return;
    
    setIsAnalyzing(true);
    setAiAnalysis("Analyzing your training history...");
    try {
      const result = await GeminiService.suggestWorkout(targetSessions);
      setAiAnalysis(result);
    } catch (error) {
      setAiAnalysis("Failed to refresh coaching tips. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRecentVolume = () => {
    const data = sessions.slice(-7).map(s => ({
      date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sets: s.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)
    }));
    while (data.length < 7) {
      data.unshift({ date: '-', sets: 0 });
    }
    return data;
  };

  const getPRs = () => {
    const weightPR = sessions.reduce((max, s) => {
      const sessMax = s.exercises.reduce((m, ex) => {
        const exMax = ex.sets.reduce((maxWeight, set) => Math.max(maxWeight, set.weight || 0), 0);
        return Math.max(m, exMax);
      }, 0);
      return Math.max(max, sessMax);
    }, 0);

    return [
      { label: 'Max Added Weight', value: `${weightPR}kg`, icon: '🏋️' },
      { label: 'Sessions This Month', value: sessions.filter(s => new Date(s.date).getMonth() === new Date().getMonth()).length, icon: '📅' },
      { label: 'Avg RPE', value: (sessions.reduce((acc, s) => {
        const sessRpe = s.exercises.flatMap(e => e.sets).reduce((sum, set) => sum + (set.rpe || 0), 0) / Math.max(1, s.exercises.flatMap(e => e.sets).length);
        return acc + sessRpe;
      }, 0) / Math.max(1, sessions.length)).toFixed(1), icon: '🔥' }
    ];
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Climbing Performance</h1>
        <p className="text-slate-500 dark:text-slate-400">Track your progress and send your projects.</p>
      </header>

      {activeSession && (
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">Ongoing Session</span>
            </div>
            <h2 className="text-2xl font-black mb-4">{activeSession.name}</h2>
            <div className="flex gap-3">
              <button 
                onClick={() => onEditSession(activeSession)}
                className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg active:scale-95"
              >
                Resume Workout
              </button>
              <button 
                onClick={onCancelActiveSession}
                className="bg-indigo-500/30 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-500/50 transition-colors border border-indigo-400/30"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {getPRs().map((pr, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{pr.label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{pr.value}</p>
            </div>
            <span className="text-3xl">{pr.icon}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 min-w-0">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 dark:text-slate-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Training Volume (Sets)
          </h3>
          <div className="h-[250px] w-full min-w-0">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={getRecentVolume()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }} 
                  />
                  <Tooltip 
                    cursor={{ fill: isDark ? '#1e293b' : '#f8fafc' }}
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      backgroundColor: isDark ? '#1e293b' : '#fff',
                      color: isDark ? '#f1f5f9' : '#0f172a'
                    }}
                  />
                  <Bar dataKey="sets" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-indigo-900 dark:bg-indigo-950 text-indigo-100 p-6 rounded-2xl shadow-lg border border-indigo-800 dark:border-indigo-900 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-700 dark:bg-indigo-800 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-bold text-lg">AI Performance Coach</h3>
            </div>
            <button 
              onClick={() => handleRefreshAI()} 
              disabled={isAnalyzing || sessions.length === 0}
              className={`p-2 rounded-lg transition-all hover:bg-white/10 active:scale-90 disabled:opacity-50 disabled:pointer-events-none group`}
              title="Refresh AI Insights"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 ${isAnalyzing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <div className="flex-1">
            <p className={`text-indigo-200 dark:text-indigo-300 leading-relaxed italic ${isAnalyzing ? 'animate-pulse' : ''}`}>
              "{aiAnalysis}"
            </p>
          </div>
          <div className="mt-6 flex justify-end">
            <span className="text-xs font-bold text-indigo-400 dark:text-indigo-500 uppercase tracking-widest">Powered by Gemini 3</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 className="text-lg font-bold mb-4 dark:text-slate-100">Recent Sessions</h3>
        <div className="space-y-4">
          {sessions.slice(-3).reverse().map(s => (
            <div 
              key={s.id} 
              onClick={() => onEditSession(s)}
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold group-hover:scale-110 transition-transform">
                  {new Date(s.date).getDate()}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{s.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(s.date).toDateString()}</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-4">
                <div>
                  <p className="font-semibold text-indigo-600 dark:text-indigo-400">{s.exercises.length} Exercises</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 uppercase font-bold">{s.exercises.reduce((acc, e) => acc + e.sets.length, 0)} Total Sets</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300 dark:text-slate-700 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
          {sessions.length === 0 && <p className="text-slate-400 dark:text-slate-500 text-center py-8">No sessions logged yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
