
import React, { useState, useEffect } from 'react';

const SettingsView: React.FC = () => {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));

  const checkApiKeyStatus = async () => {
    // Rely primarily on the window.aistudio helper for the status
    if ((window as any).aistudio?.hasSelectedApiKey) {
      const has = await (window as any).aistudio.hasSelectedApiKey();
      setHasApiKey(has);
    } else {
      // Fallback check for environment injection
      setHasApiKey(!!process.env.API_KEY);
    }
  };

  useEffect(() => {
    checkApiKeyStatus();
  }, []);

  const handleManualKeySetup = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      try {
        await (window as any).aistudio.openSelectKey();
        // Promptly update the status UI
        await checkApiKeyStatus();
      } catch (err) {
        console.error("Manual key selection failed:", err);
      }
    } else {
      alert("Manual API selection is restricted to the current application environment.");
    }
  };

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">System Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your training environment and AI preferences.</p>
      </header>

      <div className="space-y-6">
        {/* Manual API Configuration Section */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
             </svg>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full animate-pulse ${hasApiKey ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
              <h3 className="text-xl font-bold dark:text-white">AI Coach: Manual Configuration</h3>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Your training analysis is powered by <span className="text-indigo-600 dark:text-indigo-400 font-bold">Gemini 3</span>. 
              To enable coaching tips, you must manually link a valid API key from a project with billing enabled.
            </p>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Connectivity Status</span>
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${hasApiKey ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {hasApiKey ? "API Linked" : "No Key Active"}
                </span>
              </div>

              <button 
                onClick={handleManualKeySetup}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl shadow-xl shadow-indigo-100 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Configure API Key
              </button>

              <p className="text-[10px] text-center text-slate-400 font-medium">
                Selection is required for initial activation. Projects must have Gemini API access.
                <br/>
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">View Billing Documentation</a>
              </p>
            </div>
          </div>
        </section>

        {/* Display & Data Persistence */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
           <h3 className="text-xl font-bold dark:text-white mb-6">Application Preferences</h3>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                 <div className="flex items-center gap-4">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                       </svg>
                    </div>
                    <div>
                       <p className="font-bold dark:text-slate-200">Dark Interface</p>
                       <p className="text-xs text-slate-500">Toggle dark/light mode preference.</p>
                    </div>
                 </div>
                 <button 
                   onClick={toggleDarkMode}
                   className={`w-14 h-8 rounded-full p-1 transition-colors relative ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
                 >
                   <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                 </button>
              </div>

              <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                 <div className="flex items-center gap-4">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                       </svg>
                    </div>
                    <div>
                       <p className="font-bold dark:text-slate-200">Data Cleanup</p>
                       <p className="text-xs text-slate-500">Permanently delete all logs and templates.</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => {
                     if(window.confirm("CRITICAL: This will permanently delete ALL your training history and custom templates. This action cannot be undone. Proceed?")) {
                       localStorage.clear();
                       window.location.reload();
                     }
                   }}
                   className="px-4 py-2 text-red-500 text-xs font-black hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg uppercase tracking-widest transition-colors"
                 >
                    Reset App
                 </button>
              </div>
           </div>
        </section>
      </div>

      <footer className="text-center pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-black tracking-widest">ROAD TO V10 • BUILD 1.4.2</p>
        </div>
      </footer>
    </div>
  );
};

export default SettingsView;
