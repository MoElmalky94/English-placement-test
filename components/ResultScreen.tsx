import React from 'react';
import { TestResult, CEFRLevel } from '../types';
import { LEVEL_DESCRIPTIONS } from '../constants';

interface ResultScreenProps {
  result: TestResult;
  onRestart: () => void;
}

const CircularProgress: React.FC<{ percentage: number }> = ({ percentage }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg className="w-40 h-40">
                <circle
                    className="text-gray-200"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="80"
                    cy="80"
                />
                <circle
                    className="text-primary"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="80"
                    cy="80"
                    style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                    transform="rotate(-90 80 80)"
                />
            </svg>
            <span className="absolute text-3xl font-bold text-dark">{`${percentage}%`}</span>
        </div>
    );
};

const ResultScreen: React.FC<ResultScreenProps> = ({ result, onRestart }) => {
  return (
    <div className="text-center animate-fade-in">
      <h2 className="text-3xl font-bold text-dark mb-4">Test Complete!</h2>
      <p className="text-lg text-secondary mb-6">Here are your results.</p>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 my-8">
        <CircularProgress percentage={result.percentage} />
        <div className="text-left">
            <p className="text-lg text-secondary">Your estimated CEFR Level is:</p>
            <h3 className="text-5xl font-extrabold text-primary my-2">{result.level}</h3>
            <p className="text-md text-gray-600 max-w-sm">{result.levelDescription}</p>
            <p className="font-semibold text-dark mt-4">Score: {result.score} / {result.totalQuestions}</p>
        </div>
      </div>

      <div className="mt-12 text-left max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-dark mb-6 text-center">CEFR Level Descriptions</h3>
        <div className="space-y-4">
          {(Object.keys(CEFRLevel) as Array<keyof typeof CEFRLevel>).map((levelKey) => {
            const level = CEFRLevel[levelKey];
            const description = LEVEL_DESCRIPTIONS[level];
            const [title, ...rest] = description.split(':');
            const descriptionText = rest.join(':').trim();
            const isUserLevel = result.level === level;

            return (
              <div 
                key={level}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  isUserLevel
                    ? 'bg-blue-50 border-primary shadow-lg transform scale-105' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <h4 className={`font-bold text-lg ${isUserLevel ? 'text-primary' : 'text-dark'}`}>
                  {level}: {title}
                  {isUserLevel && <span className="ml-3 text-xs font-semibold bg-primary text-white py-1 px-3 rounded-full align-middle">Your Level</span>}
                </h4>
                <p className="text-secondary mt-1">{descriptionText}</p>
              </div>
            );
          })}
        </div>
      </div>
      
      <button
        onClick={onRestart}
        className="mt-12 bg-success text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-600 transition-transform transform hover:scale-105 shadow-lg"
      >
        Take the Test Again
      </button>
    </div>
  );
};

export default ResultScreen;