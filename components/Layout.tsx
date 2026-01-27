
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  hasActiveSession?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView, hasActiveSession }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Dynamically build nav items based on session state
  const getNavItems = () => {
    const items = [
      { view: 'Dashboard' as AppView, label: 'Home', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )},
      { view: 'Calendar' as AppView, label: 'Plan', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )},
    ];

    if (hasActiveSession) {
      items.push({ view: 'ActiveSession' as AppView, label: 'Active', icon: (
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          </svg>
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </div>
      )});
    }

    items.push(
      { view: 'History' as AppView, label: 'Log', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )},
      { view: 'Templates' as AppView, label: 'Build', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )}
    );

    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen pb-32 lg:pb-0 lg:pl-64 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col p-6 shadow-sm z-50">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl">S</div>
          <h2 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">SEND IT</h2>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setActiveView(hasActiveSession ? 'ActiveSession' : 'Templates')}
            className={`w-full flex items-center gap-3 px-4 py-4 mb-6 rounded-2xl transition-all shadow-lg hover:scale-[1.02] active:scale-95 ${
              hasActiveSession 
                ? 'bg-red-500 text-white shadow-red-200 dark:shadow-none' 
                : 'bg-indigo-600 text-white shadow-indigo-200 dark:shadow-none'
            }`}
          >
            {hasActiveSession ? (
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
            <span className="font-bold text-lg">{hasActiveSession ? 'Resume Workout' : 'Start Workout'}</span>
          </button>

          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeView === item.view 
                  ? (item.view === 'ActiveSession' ? 'bg-red-50 dark:bg-red-950/20 text-red-600' : 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400') 
                  : (item.view === 'ActiveSession' ? 'text-red-400 hover:bg-red-50 dark:hover:bg-red-950/10' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800')
              }`}
            >
              {item.icon}
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="mt-auto space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
           <button 
             onClick={() => setIsDarkMode(!isDarkMode)}
             className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
           >
             {isDarkMode ? (
               <><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 18v1m9-9h1m-18 0h1m3.342-7.658l.707.707m12.728 12.728l.707.707M6.342 17.658l-.707.707M17.658 6.342l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg><span>Light Mode</span></>
             ) : (
               <><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg><span>Dark Mode</span></>
             )}
           </button>
           <button onClick={() => setActiveView('Exercises')} className="w-full text-left px-4 py-2 text-sm text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">Exercise Library</button>
        </div>
      </aside>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-2 py-3 pb-6 flex justify-around items-center z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <button onClick={() => setActiveView('Dashboard')} className={`flex flex-col items-center gap-1 p-2 min-w-[50px] ${activeView === 'Dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}>
          {navItems[0].icon}<span className="text-[10px] font-bold">Home</span>
        </button>
        <button onClick={() => setActiveView('Calendar')} className={`flex flex-col items-center gap-1 p-2 min-w-[50px] ${activeView === 'Calendar' ? 'text-indigo-600' : 'text-slate-400'}`}>
          {navItems[1].icon}<span className="text-[10px] font-bold">Plan</span>
        </button>

        {/* Central Usable Button */}
        <div className="relative -top-8 flex flex-col items-center group">
          <button 
            onClick={() => setActiveView(hasActiveSession ? 'ActiveSession' : 'Templates')}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transform transition-all active:scale-90 active:translate-y-1 ring-4 ring-white dark:ring-slate-950 ${
              hasActiveSession 
                ? 'bg-red-500 shadow-red-200' 
                : 'bg-indigo-600 shadow-indigo-200'
            }`}
          >
            {hasActiveSession ? (
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
               </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>
          <span className={`mt-2 text-[10px] font-black uppercase tracking-widest whitespace-nowrap px-3 py-1 rounded-full shadow-sm ${
            hasActiveSession ? 'bg-red-500 text-white' : 'bg-indigo-600 text-white'
          }`}>
            {hasActiveSession ? 'RESUME' : 'START'}
          </span>
        </div>

        <button onClick={() => setActiveView('History')} className={`flex flex-col items-center gap-1 p-2 min-w-[50px] ${activeView === 'History' ? 'text-indigo-600' : 'text-slate-400'}`}>
          {navItems[navItems.length - 2].icon}<span className="text-[10px] font-bold">Log</span>
        </button>
        <button onClick={() => setActiveView('Templates')} className={`flex flex-col items-center gap-1 p-2 min-w-[50px] ${activeView === 'Templates' ? 'text-indigo-600' : 'text-slate-400'}`}>
          {navItems[navItems.length - 1].icon}<span className="text-[10px] font-bold">Build</span>
        </button>
      </nav>

      <main className={`max-w-5xl mx-auto p-4 md:p-8 ${activeView === 'ActiveSession' ? 'md:p-0' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
