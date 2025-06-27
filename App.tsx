
import React, { useState, useEffect, useCallback } from 'react';
import { generateQuizQuestions } from './services/geminiService';
import type { QuizQuestion } from './types';
import QuizCard from './components/QuizCard';
import Loader from './components/Loader';
import Results from './components/Results';

enum GameState {
    Start,
    Loading,
    Playing,
    Finished,
    Error,
}

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(GameState.Start);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const loadQuiz = useCallback(async () => {
        setGameState(GameState.Loading);
        setError(null);
        try {
            const newQuestions = await generateQuizQuestions();
            setQuestions(newQuestions);
            setCurrentQuestionIndex(0);
            setScore(0);
            setGameState(GameState.Playing);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Ocurrió un error desconocido.");
            setGameState(GameState.Error);
        }
    }, []);

    const handleStart = () => {
        loadQuiz();
    };
    
    const handleRestart = () => {
        setGameState(GameState.Start);
        // Resetting state for a new game
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setScore(0);
        setError(null);
    };

    const handleQuestionAnswered = (isCorrect: boolean) => {
        if (isCorrect) {
            setScore(prev => prev + 1);
        }
        
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                setGameState(GameState.Finished);
            }
        }, 700); // Delay to allow user to see the feedback
    };

    const renderContent = () => {
        switch (gameState) {
            case GameState.Loading:
                return <Loader />;
            case GameState.Playing:
                return questions.length > 0 && (
                    <QuizCard
                        key={currentQuestionIndex}
                        questionData={questions[currentQuestionIndex]}
                        onQuestionAnswered={handleQuestionAnswered}
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={questions.length}
                    />
                );
            case GameState.Finished:
                return <Results score={score} totalQuestions={questions.length} onRestart={handleRestart} />;
            case GameState.Error:
                 return (
                    <div className="text-center p-8 bg-red-900/50 border-2 border-red-500 rounded-2xl max-w-md">
                        <h2 className="text-2xl font-bold text-red-300 mb-4">Error al crear el quiz</h2>
                        <p className="text-slate-300 mb-6">{error}</p>
                        <p className="text-sm text-slate-400 mb-6">Por favor, asegúrate de que tu variable de entorno API_KEY esté configurada correctamente e inténtalo de nuevo.</p>
                        <button
                            onClick={handleRestart}
                            className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition-colors"
                        >
                            Intentar de Nuevo
                        </button>
                    </div>
                );
            case GameState.Start:
            default:
                return (
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
                                Desafío de Inglés
                            </span>
                        </h1>
                        <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
                            Pon a prueba tus conocimientos de gramática en inglés (nivel B1-B2) con este quiz interactivo. ¡Cada vez que juegas, las preguntas son nuevas!
                        </p>
                        <button
                            onClick={handleStart}
                            className="px-10 py-4 bg-indigo-600 text-white text-xl font-bold rounded-lg shadow-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
                        >
                            Empezar Quiz
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-900 to-gray-900">
            <main className="flex items-center justify-center w-full flex-grow">
                {renderContent()}
            </main>
            <footer className="w-full text-center p-4 text-slate-500 text-sm">
                Powered by Gemini API
            </footer>
        </div>
    );
};

export default App;
