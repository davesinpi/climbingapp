
import React, { useState, useEffect } from 'react';

const SettingsView: React.FC = () => {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const checkApiKey = async () => {
      // Check both the aistudio helper and the direct process env
      if ((window as any).aistudio?.hasSelectedApiKey) {
        const has = await (window as any).aistudio.hasSelectedApiKey();
        setHasApiKey(has);
      } else if (process.env.API_KEY && process.env.API_KEY !== '') {
        setHasApiKey(true);
      }
    };
    checkApiKey();
  }, []);

  const handleSelectApiKey = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      try {
        await (window as any).aistudio.openSelectKey();
        // Assume success as per platform guidelines and refresh status
        setHasApiKey(true);
      } catch (err) {
        console.error("Key selection failed:", err);
      }
    } else {
      alert("Manual environment key selection is required in this context. Please ensure your environment has an API_KEY set.");
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
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Configure your "Road to V10" experience.</p>
      </header>

      <div className="space-y-6">
        {/* API Section */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold dark:text-white">Gemini AI Configuration</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Manage the API key used for coaching and analysis.</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold dark:text-slate-200">Current API Status</p>
                  <p className="text-xs text-slate-500">
                    {hasApiKey ? "Your environment is correctly linked to a Gemini API key." : "Waiting for manual API key linkage."}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${hasApiKey ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-amber-500 shadow-[0_0_10px_#f59e0b]'}`}></span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${hasApiKey ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {hasApiKey ? "Active" : "Pending Manual Setup"}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Manual Control</p>
                 <button 
                  onClick={handleSelectApiKey}
                  className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Link API Key Manually
                </button>
              </div>
            </div>
            <p className="text-[10px] text-center text-slate-400">
              Note: AI Studio environments require selecting a project with billing. Visit <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-indigo-500 underline">Gemini API Billing Docs</a> for more.
            </p>
          </div>
        </section>

        {/* Display Section */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
           <h3 className="text-xl font-bold dark:text-white mb-6">Display & App</h3>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                 <div>
                    <p className="font-bold dark:text-slate-200">Dark Mode</p>
                    <p className="text-xs text-slate-500">Toggle the application's appearance.</p>
                 </div>
                 <button 
                   onClick={toggleDarkMode}
                   className={`w-14 h-8 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
                 >
                   <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                 </button>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-between">
                 <div>
                    <p className="font-bold dark:text-slate-200">Data Persistence</p>
                    <p className="text-xs text-slate-500">All data is stored locally in your browser.</p>
                 </div>
                 <button 
                   onClick={() => {
                     if(window.confirm("This will permanently delete ALL your training history and templates. This cannot be undone.")) {
                       localStorage.clear();
                       window.location.reload();
                     }
                   }}
                   className="text-red-500 text-xs font-bold hover:underline uppercase tracking-widest"
                 >
                    Clear All Data
                 </button>
              </div>
           </div>
        </section>
      </div>

      <footer className="text-center pt-8">
        <p className="text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">ROAD TO V10 • VERSION 1.3.0</p>
      </footer>
    </div>
  );
};

export default SettingsView;
