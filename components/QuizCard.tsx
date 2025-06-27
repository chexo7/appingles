import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckIcon, XIcon } from './icons';

interface QuizCardProps {
  questionData: QuizQuestion;
  onAnswer: (selectedAnswer: string) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ questionData, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const isAnswered = selectedOption !== null;
  const isCorrect = isAnswered ? selectedOption === questionData.answer : null;

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;

    setSelectedOption(option);
    const wasCorrect = option === questionData.answer;

    if (wasCorrect) {
      // If correct, auto-advance after a short delay
      setTimeout(() => {
        onAnswer(option);
      }, 2500);
    }
    // If incorrect, do nothing. The user will click the 'Next' button.
  };

  const getButtonClass = (option: string) => {
    if (!isAnswered) {
      return 'bg-indigo-600/50 hover:bg-indigo-500/80 hover:scale-105';
    }

    const isCorrectAnswer = option === questionData.answer;
    const isSelectedAnswer = option === selectedOption;

    if (isCorrectAnswer) {
      return 'bg-green-600/80 scale-105 ring-2 ring-white/80'; // Correct answer is always green and highlighted
    }
    
    if (isSelectedAnswer && !isCorrect) {
      return 'bg-red-600/80'; // Incorrectly selected answer is red
    }
    
    return 'bg-indigo-600/30 opacity-50'; // Other incorrect options are faded
  };

  return (
    <div className="w-full max-w-lg">
      {/* Card for question and options */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20 mb-4 transition-all duration-300">
        <div>
          <p className="text-indigo-200 text-sm mb-2">Completa la oración:</p>
          <p className="text-2xl font-semibold text-white leading-relaxed">
            {questionData.question}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 mt-6">
          {questionData.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              disabled={isAnswered}
              className={`w-full p-4 text-white font-semibold rounded-lg shadow-md transition-all duration-300 disabled:cursor-not-allowed disabled:transform-none ${getButtonClass(option)}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback area below */}
      {isAnswered && (
        <div
          key={isCorrect ? 'correct' : 'incorrect'}
          className={`w-full p-4 rounded-xl shadow-lg flex flex-col items-start space-y-3 animate-fade-in-up ${
              isCorrect ? 'bg-green-500/80' : 'bg-red-500/80'
          }`}
        >
          <div className="flex items-start space-x-3 w-full">
            {isCorrect ? (
              <CheckIcon className="w-8 h-8 text-white flex-shrink-0 mt-1" />
            ) : (
              <XIcon className="w-8 h-8 text-white flex-shrink-0 mt-1" />
            )}
            <div className="text-white text-left flex-grow">
              <h3 className="text-xl font-bold">
                {isCorrect ? '¡Correcto!' : '¡Incorrecto!'}
              </h3>
              {!isCorrect && (
                <>
                  <p className="text-md mt-1 font-semibold">
                    Respuesta correcta: <strong>{questionData.answer}</strong>
                  </p>
                  <p className="text-sm mt-2 pt-2 border-t border-white/20">
                    {questionData.explanation}
                  </p>
                </>
              )}
            </div>
          </div>
          {!isCorrect && (
            <button
              onClick={() => onAnswer(selectedOption!)}
              className="mt-2 w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              Siguiente Pregunta
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizCard;