
import React from 'react';
import { TOTAL_QUESTIONS } from '../constants';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center animate-fade-in">
      <h2 className="text-3xl font-bold text-dark mb-4">Welcome to the English Placement Test</h2>
      <p className="text-lg text-secondary mb-8 max-w-2xl mx-auto">
        This test will help you determine your English proficiency level according to the CEFR standard (A1-C1). 
        It consists of <strong>{TOTAL_QUESTIONS} questions</strong> covering grammar, vocabulary, and listening skills.
      </p>
      <div className="bg-blue-50 border-l-4 border-primary p-4 rounded-r-lg text-left max-w-xl mx-auto mb-8">
        <h3 className="font-bold text-primary">Instructions:</h3>
        <ul className="list-disc list-inside text-secondary mt-2 space-y-1">
          <li>Please complete the test in one sitting.</li>
          <li>Choose the best answer for each question.</li>
          <li>For the listening section, you may play the audio clip multiple times.</li>
        </ul>
      </div>
      <button
        onClick={onStart}
        className="bg-primary text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-600 transition-transform transform hover:scale-105 shadow-lg"
      >
        Start Test
      </button>
    </div>
  );
};

export default WelcomeScreen;
