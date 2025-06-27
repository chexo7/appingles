
import React from 'react';

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, totalQuestions, onRestart }) => {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  
  let message = '';
  if (percentage === 100) {
    message = '¡Excelente! ¡Dominas el tema!';
  } else if (percentage >= 70) {
    message = '¡Muy bien! Sigue así.';
  } else if (percentage >= 40) {
    message = '¡Buen intento! Sigue practicando.';
  } else {
    message = 'No te rindas. ¡La práctica hace al maestro!';
  }

  return (
    <div className="w-full max-w-lg bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 text-center border border-white/20 animate-fade-in">
      <h2 className="text-4xl font-bold text-white mb-2">Juego Terminado</h2>
      <p className="text-indigo-200 text-lg mb-6">{message}</p>
      
      <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
        {score} / {totalQuestions}
      </div>
      <p className="text-2xl font-semibold text-white mb-8">({percentage}%)</p>

      <button
        onClick={onRestart}
        className="w-full px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-300"
      >
        Jugar de Nuevo
      </button>
    </div>
  );
};

export default ResultsScreen;
