
import React, { useState, useCallback } from 'react';
import { explainTopic } from '../services/geminiService';
import Card from './common/Card';
import LoadingSpinner from './common/LoadingSpinner';
import ErrorMessage from './common/ErrorMessage';

const ExplainTopic: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    setExplanation('');

    try {
      const result = await explainTopic(topic);
      setExplanation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [topic]);

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Explain a Complex Topic</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-4">Enter a topic you're struggling with, and the AI will break it down for you in simple terms.</p>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Quantum Computing, Photosynthesis"
            className="flex-grow w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Thinking...' : 'Explain'}
          </button>
        </div>
      </form>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      
      {explanation && (
        <div className="mt-6 prose prose-slate dark:prose-invert max-w-none">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4 dark:border-slate-600">Explanation for "{topic}"</h3>
            <div dangerouslySetInnerHTML={{ __html: explanation.replace(/\n/g, '<br />') }} />
        </div>
      )}
    </Card>
  );
};

export default ExplainTopic;
