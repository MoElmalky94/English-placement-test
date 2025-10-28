
import React, { useState, useCallback } from 'react';
import { Question, TestResult, UserAnswer } from './types';
import { getLevelFromPercentage, LEVEL_DESCRIPTIONS, TOTAL_QUESTIONS } from './constants';
import { generateTestQuestions } from './services/geminiService';
import WelcomeScreen from './components/WelcomeScreen';
import TestScreen from './components/TestScreen';
import ResultScreen from './components/ResultScreen';
import Spinner from './components/Spinner';

type AppState = 'welcome' | 'loading' | 'testing' | 'results' | 'error';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startTest = useCallback(async () => {
    setAppState('loading');
    setError(null);
    try {
      const fetchedQuestions = await generateTestQuestions();
      setQuestions(fetchedQuestions);
      setAppState('testing');
    } catch (err) {
      console.error('Failed to generate test questions:', err);
      setError('Sorry, we couldn\'t prepare the test. Please try again later.');
      setAppState('error');
    }
  }, []);

  const finishTest = useCallback((userAnswers: UserAnswer[]) => {
    let score = 0;
    userAnswers.forEach(userAnswer => {
      const question = questions.find(q => q.id === userAnswer.questionId);
      if (question && question.correctAnswer === userAnswer.answer) {
        score++;
      }
    });

    const percentage = Math.round((score / questions.length) * 100);
    const level = getLevelFromPercentage(percentage);
    const levelDescription = LEVEL_DESCRIPTIONS[level];

    setTestResult({
      score,
      totalQuestions: questions.length,
      percentage,
      level,
      levelDescription,
    });
    setAppState('results');
  }, [questions]);

  const restartTest = useCallback(() => {
    setQuestions([]);
    setTestResult(null);
    setAppState('welcome');
  }, []);

  const renderContent = () => {
    switch (appState) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center text-center">
            <Spinner />
            <p className="mt-4 text-lg text-secondary">Preparing your test questions...</p>
            <p className="text-sm text-gray-500">This may take a moment.</p>
          </div>
        );
      case 'testing':
        return <TestScreen questions={questions} onFinishTest={finishTest} />;
      case 'results':
        return testResult && <ResultScreen result={testResult} onRestart={restartTest} />;
      case 'error':
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold text-danger mb-4">An Error Occurred</h2>
                <p className="text-secondary mb-6">{error}</p>
                <button
                    onClick={restartTest}
                    className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
      case 'welcome':
      default:
        return <WelcomeScreen onStart={startTest} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
        <div className="w-full max-w-4xl mx-auto">
            <header className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-dark tracking-tight">
                    English Proficiency Test
                </h1>
                <p className="text-lg text-secondary mt-2">Discover your CEFR Level</p>
            </header>
            <main className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-12">
                {renderContent()}
            </main>
             <footer className="text-center mt-8 text-gray-500 text-sm">
                <p>Powered by Gemini API</p>
            </footer>
        </div>
    </div>
  );
};

export default App;
