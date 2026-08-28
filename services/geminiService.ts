import { Quiz } from '../types';

async function callApi(action: 'explain' | 'summarize' | 'quiz', payload: string): Promise<any> {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, payload }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Server request failed with status ${response.status}`);
  }

  return data.result;
}

export const explainTopic = async (topic: string): Promise<string> => {
  return callApi('explain', topic);
};

export const summarizeText = async (notes: string): Promise<string> => {
  return callApi('summarize', notes);
};

export const generateQuiz = async (topicOrNotes: string): Promise<Quiz> => {
  const quizData = await callApi('quiz', topicOrNotes);
  if (!quizData?.title || !Array.isArray(quizData?.questions)) {
    throw new Error('Invalid quiz format received from server.');
  }
  return quizData;
};
