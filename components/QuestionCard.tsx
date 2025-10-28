
import React from 'react';
import { Question, TestSection } from '../types';
import AudioPlayer from './AudioPlayer';

interface QuestionCardProps {
  question: Question;
  onAnswer: (questionId: number, answer: string) => void;
  selectedAnswer?: string;
}

const getSectionIcon = (section: TestSection) => {
    switch (section) {
        case TestSection.Grammar:
            return 'G';
        case TestSection.Vocabulary:
            return 'V';
        case TestSection.Listening:
            return 'L';
    }
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, selectedAnswer }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-sm font-semibold text-primary bg-blue-100 py-1 px-3 rounded-full">{question.section}</span>
          <p className="text-xl md:text-2xl font-semibold text-dark mt-3">{question.questionText}</p>
        </div>
         <div className="flex-shrink-0 ml-4">
            <span className="text-sm font-bold text-gray-500 bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full">{question.id}</span>
        </div>
      </div>
      
      {question.section === TestSection.Listening && question.audioPrompt && (
        <div className="my-4">
            <AudioPlayer audioPrompt={question.audioPrompt} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(question.id, option)}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
              selectedAnswer === option
                ? 'bg-primary border-primary text-white shadow-md'
                : 'bg-white border-gray-300 hover:border-primary hover:bg-blue-50'
            }`}
          >
            <span className={`font-semibold ${selectedAnswer === option ? 'text-white' : 'text-primary'} mr-2`}>
                {String.fromCharCode(65 + index)}
            </span>
            <span className={`${selectedAnswer === option ? 'text-white' : 'text-dark'}`}>{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
