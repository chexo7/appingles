
import React from 'react';

interface ResultsProps {
    score: number;
    totalQuestions: number;
    onRestart: () => void;
}

const Results: React.FC<ResultsProps> = ({ score, totalQuestions, onRestart }) => {
    const getFeedback = () => {
        const percentage = (score / totalQuestions) * 100;
        if (percentage === 100) return "¡Perfecto! Eres un maestro/a del inglés. 👏";
        if (percentage >= 80) return "¡Excelente trabajo! Sigue así. 👍";
        if (percentage >= 60) return "¡Muy bien! Estás progresando. 😊";
        if (percentage >= 40) return "Buen intento. La práctica hace al maestro. 💪";
        return "¡No te rindas! Cada error es una oportunidad para aprender. 🧠";
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-800 rounded-2xl shadow-lg w-full max-w-md text-center">
            <h2 className="text-4xl font-bold text-indigo-400 mb-4">Quiz Terminado</h2>
            <p className="text-xl text-slate-300 mb-2">Tu puntaje final es:</p>
            <p className="text-6xl font-bold text-white mb-6">
                {score} <span className="text-3xl text-slate-400">/ {totalQuestions}</span>
            </p>
            <p className="text-lg text-slate-300 mb-8 italic">{getFeedback()}</p>
            <button
                onClick={onRestart}
                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
            >
                Jugar de Nuevo
            </button>
        </div>
    );
};

export default Results;
