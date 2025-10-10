
import React from 'react';
import { FeatureTab } from '../types';

interface TabsProps {
  activeTab: FeatureTab;
  setActiveTab: (tab: FeatureTab) => void;
}

const tabConfig = [
  { id: FeatureTab.EXPLAIN, label: 'Explain Topic' },
  { id: FeatureTab.SUMMARIZE, label: 'Summarize Notes' },
  { id: FeatureTab.QUIZ, label: 'Generate Quiz' },
];

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-slate-200 dark:border-slate-700">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {tabConfig.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:border-slate-500'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ease-in-out focus:outline-none`}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;
