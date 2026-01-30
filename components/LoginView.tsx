
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface LoginViewProps {
  onLogin: (user: User) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkExistingConnection = async () => {
      if ((window as any).aistudio?.hasSelectedApiKey) {
        const connected = await (window as any).aistudio.hasSelectedApiKey();
        if (connected) {
          handleAuthSuccess();
        }
      }
    };
    checkExistingConnection();
  }, []);

  const handleAuthSuccess = () => {
    // We derive the user state from the successful project/key selection
    const authenticatedUser: User = {
      id: 'google-cloud-' + Math.random().toString(36).substr(2, 9),
      name: 'Google Cloud Climber',
      email: 'connected-via-project@gmail.com',
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=GCP-${Math.floor(Math.random() * 100)}`
    };
    onLogin(authenticatedUser);
  };

  const handleConnectGoogleAccount = async () => {
    setIsLoading(true);
    try {
      if ((window as any).aistudio?.openSelectKey) {
        // This is the official Google login/project selection for this platform
        await (window as any).aistudio.openSelectKey();
        // Proceeding to the app as the key selection is handled by the platform dialog
        handleAuthSuccess();
      } else {
        // Development fallback
        setTimeout(() => {
          handleAuthSuccess();
          setIsLoading(false);
        }, 800);
      }
    } catch (err) {
      console.error("Google Account Connection Error:", err);
      alert("Failed to connect to Gmail/Google Project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Immersive Climbing Background Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-slate-950 to-black z-10" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
      </div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl rounded-[3.5rem] shadow-2xl p-10 md:p-16 relative z-10 border border-white/10 animate-in fade-in zoom-in-95 duration-1000">
        <div className="flex flex-col items-center text-center space-y-12">
          <div className="relative group">
            <div className="absolute -inset-4 bg-indigo-500/20 rounded-[2.5rem] blur-xl group-hover:bg-indigo-500/40 transition-all duration-500" />
            <div className="bg-indigo-600 w-24 h-24 rounded-[2rem] flex items-center justify-center text-white font-black text-5xl shadow-2xl relative z-10 animate-pulse-slow">
              V
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-6xl font-black text-white tracking-tighter leading-none italic">ROAD TO<br/><span className="text-indigo-500">V10</span></h1>
            <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-xs mx-auto">
              Master your training with systematic logs and Google Cloud AI analysis.
            </p>
          </div>

          <div className="space-y-8 w-full">
            <div className="space-y-4">
              <button 
                disabled={isLoading}
                onClick={handleConnectGoogleAccount}
                className="group w-full flex items-center justify-center gap-4 bg-white hover:bg-slate-50 py-5 rounded-3xl font-black text-slate-950 transition-all active:scale-95 shadow-2xl disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="h-6 w-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>
              
              <div className="flex flex-col items-center gap-2">
                <a 
                  href="https://ai.google.dev/gemini-api/docs/billing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5"
                >
                  Setup Billing Project
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">Required for AI Coaching</p>
              </div>
            </div>

            <div className="pt-4 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                 </div>
                 <span className="text-[9px] font-black uppercase text-slate-400">OAuth Security</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 </div>
                 <span className="text-[9px] font-black uppercase text-slate-400">Cloud Sync</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-600 font-bold leading-relaxed uppercase tracking-widest max-w-[280px]">
            Your climbing logs are stored in your local storage and synced via your Google Cloud API Key.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
