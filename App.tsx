
import React, { useState, useMemo } from 'react';
import { FeatureTab } from './types';
import Header from './components/Header';
import Tabs from './components/Tabs';
import ExplainTopic from './components/ExplainTopic';
import SummarizeNotes from './components/SummarizeNotes';
import GenerateQuiz from './components/GenerateQuiz';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FeatureTab>(FeatureTab.EXPLAIN);

  const renderContent = useMemo(() => {
    switch (activeTab) {
      case FeatureTab.EXPLAIN:
        return <ExplainTopic />;
      case FeatureTab.SUMMARIZE:
        return <SummarizeNotes />;
      case FeatureTab.QUIZ:
        return <GenerateQuiz />;
      default:
        return <ExplainTopic />;
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header />
      <main className="max-w-4xl mx-auto p-4 sm:p-6">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-6">
          {renderContent}
        </div>
      </main>
      <footer className="text-center p-4 mt-8 text-sm text-slate-500">
        <p>Powered by Google Gemini AI API.</p>
      </footer>
    </div>
  );
};

export default App;
