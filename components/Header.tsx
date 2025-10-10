
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto p-4 flex items-center gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10" />
            <path d="M12 2a10 10 0 0 0-10 10" />
            <path d="M2 12a10 10 0 0 0 10 10" />
            <path d="M22 12a10 10 0 0 1-10 10" />
            <path d="M12 2v20" />
            <path d="M2 12h20" />
            <path d="m5 7 1 1" />
            <path d="m18 7-1 1" />
            <path d="m5 17 1-1" />
            <path d="m18 17-1-1" />
        </svg>
        <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Study Buddy</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Your personal AI-powered learning assistant</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
