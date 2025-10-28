
import React, { useState, useCallback } from 'react';
import { Question, UserAnswer } from '../types';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';

interface TestScreenProps {
  questions: Question[];
  onFinishTest: (answers: UserAnswer[]) => void;
}

const TestScreen: React.FC<TestScreenProps> = ({ questions, onFinishTest }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  
  const handleAnswer = useCallback((questionId: number, answer: string) => {
    setUserAnswers(prev => {
        const existingAnswerIndex = prev.findIndex(a => a.questionId === questionId);
        if (existingAnswerIndex > -1) {
            const updatedAnswers = [...prev];
            updatedAnswers[existingAnswerIndex] = { questionId, answer };
            return updatedAnswers;
        }
        return [...prev, { questionId, answer }];
    });
  }, []);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onFinishTest(userAnswers);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const currentAnswer = userAnswers.find(a => a.questionId === currentQuestion.id)?.answer;

  return (
    <div className="flex flex-col w-full">
      <ProgressBar current={currentQuestionIndex + 1} total={questions.length} />
      <div className="mt-8">
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          onAnswer={handleAnswer}
          selectedAnswer={currentAnswer}
        />
      </div>
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleNext}
          disabled={!currentAnswer}
          className={`px-6 py-3 font-bold text-white rounded-lg transition-colors ${
            !currentAnswer
              ? 'bg-gray-300 cursor-not-allowed'
              : `bg-primary hover:bg-blue-600`
          }`}
        >
          {isLastQuestion ? 'Finish Test' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};

export default TestScreen;
