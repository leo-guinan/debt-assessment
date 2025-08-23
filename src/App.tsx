import React, { useState } from 'react';
import Quiz from './components/Quiz';
import Results from './components/Results';
import { QuizResult } from './types/quiz';

function App() {
  const [currentView, setCurrentView] = useState<'intro' | 'quiz' | 'results'>('intro');
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const startQuiz = () => setCurrentView('quiz');
  
  const handleQuizComplete = (result: QuizResult) => {
    setQuizResult(result);
    setCurrentView('results');
  };

  const resetQuiz = () => {
    setCurrentView('intro');
    setQuizResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {currentView === 'intro' && (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Debt Profile Assessment
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We're preparing to build a collaborative debt management platform and need to understand 
                the diverse debt profiles in our community. This brief assessment will help us design 
                solutions that truly serve your needs.
              </p>
              <div className="bg-blue-50 rounded-lg p-4 mb-8">
                <p className="text-blue-800 text-sm">
                  <strong>Your data is confidential</strong> • 11 questions • Takes about 5 minutes
                </p>
              </div>
              <button
                onClick={startQuiz}
                className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Assessment
              </button>
            </div>
          </div>
        </div>
      )}
      {currentView === 'quiz' && <Quiz onComplete={handleQuizComplete} />}
      {currentView === 'results' && quizResult && (
        <Results result={quizResult} onRestart={resetQuiz} />
      )}
    </div>
  );
}

export default App;