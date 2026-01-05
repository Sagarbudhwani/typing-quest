import React from 'react';

export default function BackgroundLayout({ children }) {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500 flex flex-col">
      
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-20 w-72 h-72 md:w-96 md:h-96 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 dark:opacity-30 animate-blob bg-purple-300 dark:bg-purple-600"></div>
        <div className="absolute top-0 -right-20 w-72 h-72 md:w-96 md:h-96 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 dark:opacity-30 animate-blob animation-delay-2000 bg-cyan-300 dark:bg-cyan-600"></div>
        <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-72 h-72 md:w-96 md:h-96 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 dark:opacity-30 animate-blob animation-delay-4000 bg-pink-300 dark:bg-pink-600"></div>
      </div>

      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05] pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}