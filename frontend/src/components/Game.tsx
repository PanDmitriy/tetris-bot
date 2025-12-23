import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useGameStore } from '../store/gameStore';
import GameEngine from '../engine/GameEngine';
import GameUI from './GameUI';
import PauseMenu from './PauseMenu';

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const { isPaused, setScreen, sendGameResult } = useGameStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize game engine
    const engine = new GameEngine(canvas);
    engineRef.current = engine;

    // Start game loop
    engine.start();

    // Cleanup
    return () => {
      engine.stop();
    };
  }, []);

  useEffect(() => {
    if (engineRef.current) {
      if (isPaused) {
        engineRef.current.pause();
      } else {
        engineRef.current.resume();
      }
    }
  }, [isPaused]);

  const handleGameOver = () => {
    sendGameResult();
    setScreen('gameover');
  };

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.onGameOver = handleGameOver;
    }
  }, [handleGameOver]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        bgcolor: '#111827',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
      <GameUI />
      {isPaused && <PauseMenu />}
    </Box>
  );
}



