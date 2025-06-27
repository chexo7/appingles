
import React, { useState, useEffect } from 'react';
import type { QuizQuestion } from '../types';

interface QuizCardProps {
    questionData: QuizQuestion;
    onQuestionAnswered: (isCorrect: boolean) => void;
    questionNumber: number;
    totalQuestions: number;
}

const CorrectIcon = () => (
    <svg className="w-16 h-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

const IncorrectIcon = () => (
    <svg className="w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);


const QuizCard: React.FC<QuizCardProps> = ({ questionData, onQuestionAnswered, questionNumber, totalQuestions }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const isCorrect = selectedAnswer === questionData.correctAnswer;

    useEffect(() => {
        setIsFlipped(false);
        setSelectedAnswer(null);
    }, [questionData]);

    const handleAnswerClick = (option: string) => {
        if (selectedAnswer) return;
        setSelectedAnswer(option);
        setIsFlipped(true);
    };

    return (
        <div className="w-full max-w-2xl min-h-[450px]" style={{ perspective: '1000px' }}>
            <div className={`card relative w-full h-full ${isFlipped ? 'is-flipped' : ''}`}>
                {/* Card Front */}
                <div className="card-face w-full h-full">
                    <div className="p-8 bg-slate-800 rounded-2xl shadow-2xl flex flex-col justify-between h-full">
                        <div>
                            <p className="text-indigo-400 font-semibold mb-4">Pregunta {questionNumber} / {totalQuestions}</p>
                            <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-8 text-slate-100">{questionData.question}</h2>
                        </div>
                        <div className="space-y-4">
                            {questionData.options.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleAnswerClick(option)}
                                    className="w-full text-left p-4 bg-slate-700 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 transition-colors duration-200"
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Card Back */}
                <div className="card-face card-back w-full h-full">
                    <div className={`p-8 rounded-2xl shadow-2xl flex flex-col items-center justify-center h-full ${isCorrect ? 'bg-green-900/50' : 'bg-red-900/50'} border-2 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                        {selectedAnswer && (isCorrect ? <CorrectIcon/> : <IncorrectIcon/>)}
                        <h3 className="text-3xl font-bold mt-4 mb-2">{isCorrect ? '¡Correcto!' : '¡Oops!'}</h3>
                        {!isCorrect && <p className="text-lg text-slate-300 mb-4">La respuesta correcta era: <strong className="text-white">{questionData.correctAnswer}</strong></p>}
                        
                        <div className="bg-slate-900/50 p-4 rounded-lg text-center my-6 w-full">
                            <h4 className="font-bold text-indigo-300 mb-2">Explicación:</h4>
                            <p className="text-slate-300">{questionData.explanation_es}</p>
                        </div>

                        <button
                            onClick={() => onQuestionAnswered(isCorrect)}
                            className="mt-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizCard;
