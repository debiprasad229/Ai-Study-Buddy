
import React, { useState, useCallback } from 'react';
import { generateQuiz } from '../services/geminiService';
import { Quiz, QuizQuestion } from '../types';
import Card from './common/Card';
import LoadingSpinner from './common/LoadingSpinner';
import ErrorMessage from './common/ErrorMessage';

const GenerateQuiz: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQuiz = useCallback(async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    setQuiz(null);
    setUserAnswers({});
    setSubmitted(false);

    try {
      const result = await generateQuiz(topic);
      setQuiz(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [topic]);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmitQuiz = () => {
    setSubmitted(true);
  };
  
  const calculateScore = () => {
    if (!quiz) return 0;
    return quiz.questions.reduce((score, question, index) => {
      return userAnswers[index] === question.correctAnswer ? score + 1 : score;
    }, 0);
  };

  const getOptionClasses = (question: QuizQuestion, option: string, index: number) => {
    if (!submitted) {
        return 'border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700';
    }
    if (option === question.correctAnswer) {
        return 'border-green-500 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
    }
    if (userAnswers[index] === option && option !== question.correctAnswer) {
        return 'border-red-500 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
    }
    return 'border-slate-300 dark:border-slate-600';
  };
  
  const resetQuiz = () => {
    setQuiz(null);
    setUserAnswers({});
    setSubmitted(false);
    setError(null);
    // setTopic(''); // Optional: uncomment to clear the input field as well
  }

  return (
    <Card>
      {!quiz && (
        <>
          <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Generate a Quiz</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">Enter a topic or paste notes to create a multiple-choice quiz and test your knowledge.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., The French Revolution, Cell Biology"
              className="flex-grow w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
            <button
              onClick={handleGenerateQuiz}
              disabled={isLoading || !topic.trim()}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Generating...' : 'Generate Quiz'}
            </button>
          </div>
          {isLoading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} />}
        </>
      )}

      {quiz && (
        <div>
          <h2 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">{quiz.title}</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Test your knowledge. Select an answer for each question.</p>

          {submitted && (
            <div className="mb-6 p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200">
                Quiz Complete! Your score: {calculateScore()} / {quiz.questions.length}
              </h3>
            </div>
          )}

          <div className="space-y-6">
            {quiz.questions.map((q, qIndex) => (
              <div key={qIndex}>
                <p className="font-semibold mb-2">{qIndex + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((option, oIndex) => (
                    <label key={oIndex} className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${getOptionClasses(q, option, qIndex)}`}>
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        value={option}
                        checked={userAnswers[qIndex] === option}
                        onChange={() => handleAnswerChange(qIndex, option)}
                        disabled={submitted}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 disabled:opacity-50"
                      />
                      <span className="ml-3">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end gap-3">
             <button
                onClick={resetQuiz}
                className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Create New Quiz
              </button>
            {!submitted ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(userAnswers).length !== quiz.questions.length}
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
              >
                Check Answers
              </button>
            ) : null}
          </div>
        </div>
      )}
    </Card>
  );
};

export default GenerateQuiz;
