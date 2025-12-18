import { useGameStore } from '../store/gameStore';

export default function GameUI() {
  const { score, distance, time, blocksAvoided, pause } = useGameStore();

  return (
    <div className="absolute top-0 left-0 right-0 p-4 z-10">
      <div className="flex justify-between items-start">
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-3 space-y-1">
          <div className="text-sm text-gray-400">Очки</div>
          <div className="text-2xl font-bold text-blue-400">{score.toLocaleString()}</div>
        </div>

        <button
          onClick={pause}
          className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-3 hover:bg-gray-800/80 transition-colors"
        >
          <span className="text-2xl">⏸️</span>
        </button>
      </div>

      <div className="mt-2 flex gap-2">
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm">
          <span className="text-gray-400">📏 </span>
          <span className="font-semibold text-green-400">{Math.floor(distance)}m</span>
        </div>
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm">
          <span className="text-gray-400">⏱ </span>
          <span className="font-semibold text-purple-400">{Math.floor(time / 1000)}s</span>
        </div>
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm">
          <span className="text-gray-400">🎯 </span>
          <span className="font-semibold text-yellow-400">{blocksAvoided}</span>
        </div>
      </div>
    </div>
  );
}



