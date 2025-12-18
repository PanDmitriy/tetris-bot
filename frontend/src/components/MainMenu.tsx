import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export default function MainMenu() {
  const { setScreen, score, distance, time, blocksAvoided, reset } = useGameStore();

  const handlePlay = () => {
    reset();
    setScreen('game');
  };

  const hasGameResult = score > 0 || distance > 0;

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md w-full"
      >
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          🚗 Tetris Racing
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-300 mb-8 text-lg"
        >
          Избегайте падающих блоков и набирайте очки!
        </motion.p>

        {hasGameResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800/50 rounded-lg p-4 mb-6 backdrop-blur-sm"
          >
            <h3 className="text-xl font-semibold mb-3">Последний результат:</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-gray-400">Очки</div>
                <div className="text-2xl font-bold text-blue-400">{score.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-400">Расстояние</div>
                <div className="text-2xl font-bold text-green-400">{Math.floor(distance)}m</div>
              </div>
              <div>
                <div className="text-gray-400">Время</div>
                <div className="text-2xl font-bold text-purple-400">{Math.floor(time / 1000)}s</div>
              </div>
              <div>
                <div className="text-gray-400">Блоков</div>
                <div className="text-2xl font-bold text-yellow-400">{blocksAvoided}</div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: 'spring' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePlay}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-8 rounded-xl text-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          🎮 Играть
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-gray-500 text-sm mt-6"
        >
          Используйте стрелки для управления
        </motion.p>
      </motion.div>
    </div>
  );
}



