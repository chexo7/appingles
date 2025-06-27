import React, { useState, useEffect, useCallback } from 'react';
import { QuizQuestion, GameState } from './types';
import { generateSingleQuizQuestion } from './services/geminiService';
import QuizCard from './components/QuizCard';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.LOADING);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [nextQuestion, setNextQuestion] = useState<QuizQuestion | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const initialFetch = useCallback(async () => {
    setGameState(GameState.LOADING);
    setError(null);
    try {
      // Fetch the first two questions in parallel for a fast start
      const [firstQ, secondQ] = await Promise.all([
        generateSingleQuizQuestion(),
        generateSingleQuizQuestion(),
      ]);
      setCurrentQuestion(firstQ);
      setNextQuestion(secondQ);
      setGameState(GameState.PLAYING);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
      setGameState(GameState.ERROR);
    }
  }, []);

  useEffect(() => {
    initialFetch();
  }, [initialFetch]);

  const handleAdvance = (selectedAnswer: string) => {
    if (!currentQuestion) return;

    // 1. Update score based on the answered question
    const isCorrect = selectedAnswer === currentQuestion.answer;
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    setQuestionNumber(prevNumber => prevNumber + 1);
    
    // This function runs in the background to fetch the *next* question
    const prefetchNext = () => {
      generateSingleQuizQuestion()
        .then(q => setNextQuestion(q))
        .catch(err => {
          console.error("Background pre-fetch failed:", err);
          // If pre-fetch fails, nextQuestion will be null. 
          // The app will recover on the next transition by showing the loader.
          setNextQuestion(null);
        });
    };

    // 2. Transition to the next question
    if (nextQuestion) {
      // --- SMOOTH PATH ---
      // The next question is ready. Transition is instant.
      setCurrentQuestion(nextQuestion);
      // Immediately start fetching the one after that.
      prefetchNext();
    } else {
      // --- RECOVERY PATH ---
      // The pre-fetched question wasn't ready. We must load it now.
      const fetchRequiredQuestion = async () => {
        setGameState(GameState.LOADING);
        try {
          const newQ = await generateSingleQuizQuestion();
          setCurrentQuestion(newQ);
          setGameState(GameState.PLAYING);
          // Also kick off a pre-fetch to get the cycle started again
          prefetchNext();
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
          setGameState(GameState.ERROR);
        }
      };
      fetchRequiredQuestion();
    }
  };

  const handleRestart = () => {
    setQuestionNumber(1);
    setScore(0);
    initialFetch();
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.LOADING:
        return <LoadingSpinner />;
      case GameState.PLAYING:
        if (!currentQuestion) return <LoadingSpinner />; // Should only flash briefly on recovery
        return (
          <>
            <div className="w-full text-center mb-4">
              <p className="text-xl text-indigo-200">Pregunta {questionNumber}</p>
              <p className="text-2xl font-bold text-white">Puntaje: {score}</p>
            </div>
            <QuizCard
              key={questionNumber}
              questionData={currentQuestion}
              onAnswer={handleAdvance}
            />
          </>
        );
      case GameState.ERROR:
        return (
          <div className="text-center text-white bg-red-500/50 p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">¡Oops! Algo salió mal</h2>
            <p className="mb-6">{error}</p>
            <button
              onClick={handleRestart}
              className="px-6 py-2 bg-white text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-colors"
            >
              Intentar de Nuevo
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 flex flex-col items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
        <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                English Grammar Quiz
            </h1>
            <p className="text-indigo-200 mt-2">¡Pon a prueba tus conocimientos de inglés!</p>
        </header>
        {renderContent()}
      </div>
    </main>
  );
};

export default App;
