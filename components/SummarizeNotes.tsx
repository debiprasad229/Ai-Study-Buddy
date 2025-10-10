
import React, { useState, useCallback } from 'react';
import { summarizeText } from '../services/geminiService';
import Card from './common/Card';
import LoadingSpinner from './common/LoadingSpinner';
import ErrorMessage from './common/ErrorMessage';

const SummarizeNotes: React.FC = () => {
  const [notes, setNotes] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    setIsLoading(true);
    setError(null);
    setSummary('');

    try {
      const result = await summarizeText(notes);
      setSummary(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [notes]);

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Summarize Study Notes</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-4">Paste your study notes below, and the AI will generate a concise summary of the key points.</p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Paste your notes here..."
          className="w-full h-48 px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !notes.trim()}
          className="mt-2 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Summarizing...' : 'Summarize'}
        </button>
      </form>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {summary && (
        <div className="mt-6 prose prose-slate dark:prose-invert max-w-none">
          <h3 className="text-lg font-semibold border-b pb-2 mb-4 dark:border-slate-600">Summary</h3>
          <div dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br />') }} />
        </div>
      )}
    </Card>
  );
};

export default SummarizeNotes;
