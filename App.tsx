import React, { useState, useCallback, useEffect } from 'react';
import { GameStage, Order, PlayerFractions, IngredientType } from './types';
import { generateOrder, INGREDIENT_ORDER } from './constants';
import Stage1 from './components/Stage1';
import Stage2 from './components/Stage2';

const WelcomeScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => (
    <div className="text-center flex flex-col items-center justify-center p-8">
        <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600 mb-4 drop-shadow-lg">
            햄버거 만들기 🍔
        </h1>
        <p className="text-xl md:text-2xl text-amber-800 mb-10">분수와 함께 맛있는 햄버거를 만들어봐요!</p>
        <button
            onClick={onStart}
            className="px-10 py-5 bg-gradient-to-br from-green-400 to-green-600 text-white text-3xl font-bold rounded-full shadow-xl transform hover:scale-110 hover:shadow-2xl transition-all duration-300 ease-in-out ring-4 ring-green-500/50 hover:ring-8"
        >
            게임 시작!
        </button>
    </div>
);

const CompletionScreen: React.FC<{ onPlayAgain: () => void }> = ({ onPlayAgain }) => (
    <div className="text-center">
        <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500 mb-4 drop-shadow-lg">
            맛있는 햄버거 완성! 🎉
        </h1>
        <p className="text-2xl text-green-800 mb-8">정말 대단해요! 분수 박사님이군요!</p>
        <div className="text-9xl mb-8 animate-bounce">🥳</div>
        <button
            onClick={onPlayAgain}
            className="px-10 py-5 bg-gradient-to-br from-blue-400 to-blue-600 text-white text-3xl font-bold rounded-full shadow-xl transform hover:scale-110 hover:shadow-2xl transition-all duration-300 ease-in-out ring-4 ring-blue-500/50 hover:ring-8"
        >
            다시 만들기
        </button>
    </div>
);


const App: React.FC = () => {
  const [gameStage, setGameStage] = useState<GameStage>('welcome');
  const [order, setOrder] = useState<Order>(generateOrder());
  const [playerFractions, setPlayerFractions] = useState<PlayerFractions | null>(null);

  const startGame = useCallback(() => {
    setOrder(generateOrder());
    setPlayerFractions(null);
    setGameStage('stage1');
  }, []);

  const handleStage1Complete = useCallback((fractions: PlayerFractions) => {
    setPlayerFractions(fractions);
    setGameStage('stage2');
  }, []);

  const handleStage2Complete = useCallback(() => {
    setGameStage('complete');
  }, []);

  const renderContent = () => {
    switch (gameStage) {
      case 'stage1':
        return <Stage1 order={order} onComplete={handleStage1Complete} />;
      case 'stage2':
        if (!playerFractions) {
            startGame(); // Should not happen, but as a fallback
            return null;
        }
        return <Stage2 order={order} playerFractions={playerFractions} onComplete={handleStage2Complete} />;
      case 'complete':
        return <CompletionScreen onPlayAgain={startGame} />;
      case 'welcome':
      default:
        return <WelcomeScreen onStart={startGame} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 bg-amber-100 font-sans">
      <div className="flex-grow flex items-center justify-center">
        <main className="w-full max-w-6xl mx-auto bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-10 border-8 border-white/30">
          {renderContent()}
        </main>
      </div>
      <footer className="flex-shrink-0 text-center py-4">
        <p className="text-sm text-amber-900/70">
          오류 문의: <a href="mailto:nalrary@mensakorea.org" className="underline hover:text-orange-600 transition-colors">nalrary@mensakorea.org</a>
        </p>
      </footer>
    </div>
  );
};

export default App;