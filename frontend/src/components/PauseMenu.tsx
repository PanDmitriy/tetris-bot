import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export default function PauseMenu() {
  const { resume, setScreen, sendGameResult } = useGameStore();

  const handleResume = () => {
    resume();
  };

  const handleQuit = () => {
    sendGameResult();
    setScreen('menu');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-gray-800 rounded-2xl p-8 max-w-sm w-full mx-4"
      >
        <h2 className="text-3xl font-bold text-center mb-6">⏸️ Пауза</h2>
        
        <div className="space-y-3">
          <button
            onClick={handleResume}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-shadow"
          >
            Продолжить
          </button>
          
          <button
            onClick={handleQuit}
            className="w-full bg-gray-700 text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-600 transition-colors"
          >
            Выйти в меню
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}



