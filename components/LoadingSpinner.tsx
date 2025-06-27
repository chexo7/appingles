
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-purple-500 rounded-full animate-spin"></div>
      <p className="text-white text-lg">Generando preguntas...</p>
    </div>
  );
};

export default LoadingSpinner;
