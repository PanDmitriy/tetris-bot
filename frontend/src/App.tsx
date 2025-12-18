import { useEffect } from 'react';
import { initDataRaw, initData } from '@twa-dev/sdk';
import Game from './components/Game';
import MainMenu from './components/MainMenu';
import { useGameStore } from './store/gameStore';

function App() {
  const { screen, initTelegram } = useGameStore();

  useEffect(() => {
    // Initialize Telegram WebApp
    try {
      if (initDataRaw && initData) {
        initTelegram(initData);
      }
    } catch (error) {
      console.warn('Telegram WebApp not available:', error);
    }
  }, [initTelegram]);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {screen === 'menu' && <MainMenu />}
      {screen === 'game' && <Game />}
      {screen === 'gameover' && <MainMenu />}
    </div>
  );
}

export default App;

