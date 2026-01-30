
import React, { useState } from 'react';
import { User } from '../types';

interface LoginViewProps {
  onLogin: (user: User) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulated Google OAuth Flow with a slight delay for realism
    setTimeout(() => {
      const mockUser: User = {
        id: 'google-123',
        name: 'Alex Honnold',
        email: 'alex@v10.com',
        photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
      };
      onLogin(mockUser);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 dark:bg-slate-950 p-4 relative overflow-hidden font-sans">
      {/* Dynamic Climbing Background (Simulated) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-slate-900/90 to-black z-10" />
        <svg className="w-full h-full object-cover opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 L20 40 L40 80 L60 20 L80 90 L100 30 L100 100 Z" fill="currentColor" className="text-indigo-500" />
        </svg>
      </div>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl rounded-[3rem] shadow-2xl p-10 md:p-14 relative z-10 border border-white/10 animate-in fade-in zoom-in-95 duration-700">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="bg-indigo-600 w-20 h-20 rounded-3xl flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-indigo-500/40 animate-bounce">R</div>
          
          <div>
            <h1 className="text-5xl font-black text-white tracking-tight leading-tight mb-3">ROAD TO<br/><span className="text-indigo-400">V10</span></h1>
            <p className="text-slate-300 font-medium text-lg px-4">Systematic climbing performance and AI-powered training.</p>
          </div>

          <div className="space-y-6 w-full pt-4">
            <button 
              disabled={isLoading}
              onClick={handleGoogleLogin}
              className="group w-full flex items-center justify-center gap-4 bg-white hover:bg-slate-50 py-5 rounded-2xl font-black text-slate-900 transition-all active:scale-[0.98] shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
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
                  Sign in with Google
                </>
              )}
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900/50 backdrop-blur-md px-3 text-slate-500 font-black tracking-[0.2em]">Secure Cloud Sync</span></div>
            </div>

            <div className="grid grid-cols-3 gap-3">
               <div className="flex flex-col items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                 <span className="text-2xl mb-1">☁️</span>
                 <span className="text-[9px] font-black uppercase text-indigo-400">Offline</span>
               </div>
               <div className="flex flex-col items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                 <span className="text-2xl mb-1">⚡</span>
                 <span className="text-[9px] font-black uppercase text-indigo-400">Sync</span>
               </div>
               <div className="flex flex-col items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                 <span className="text-2xl mb-1">🤖</span>
                 <span className="text-[9px] font-black uppercase text-indigo-400">AI Logic</span>
               </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest max-w-[200px]">
            Your data is stored locally first and synced to the cloud automatically.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
