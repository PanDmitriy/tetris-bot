import { create } from 'zustand';

export type Screen = 'menu' | 'game' | 'gameover';

// Telegram WebApp InitData type
type InitData = {
  queryId?: string;
  user?: {
    id: number;
    firstName: string;
    lastName?: string;
    username?: string;
    languageCode?: string;
    isPremium?: boolean;
    photoUrl?: string;
  };
  receiver?: {
    id: number;
    firstName: string;
    lastName?: string;
    username?: string;
    languageCode?: string;
    isPremium?: boolean;
    photoUrl?: string;
  };
  chat?: {
    id: number;
    type: string;
    title?: string;
    username?: string;
    photoUrl?: string;
  };
  chatType?: string;
  chatInstance?: string;
  startParam?: string;
  canSendAfter?: number;
  authDate: number;
  hash: string;
};

interface GameState {
  screen: Screen;
  score: number;
  distance: number;
  time: number;
  blocksAvoided: number;
  isPaused: boolean;
  telegramData: InitData | null;
  
  // Actions
  setScreen: (screen: Screen) => void;
  setScore: (score: number) => void;
  setDistance: (distance: number) => void;
  setTime: (time: number) => void;
  setBlocksAvoided: (blocks: number) => void;
  incrementScore: (points: number) => void;
  incrementDistance: (meters: number) => void;
  incrementTime: (ms: number) => void;
  incrementBlocksAvoided: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  initTelegram: (data: InitData) => void;
  sendGameResult: () => void;
}

const initialState = {
  screen: 'menu' as Screen,
  score: 0,
  distance: 0,
  time: 0,
  blocksAvoided: 0,
  isPaused: false,
  telegramData: null,
};

export const useGameStore = create<GameState>((set, get) => ({
  ...initialState,

  setScreen: (screen: Screen) => set({ screen }),
  
  setScore: (score: number) => set({ score }),
  
  setDistance: (distance: number) => set({ distance }),
  
  setTime: (time: number) => set({ time }),
  
  setBlocksAvoided: (blocks: number) => set({ blocksAvoided: blocks }),
  
  incrementScore: (points: number) => set((state: GameState) => ({ score: state.score + points })),
  
  incrementDistance: (meters: number) => set((state: GameState) => ({ distance: state.distance + meters })),
  
  incrementTime: (ms: number) => set((state: GameState) => ({ time: state.time + ms })),
  
  incrementBlocksAvoided: () => set((state: GameState) => ({ blocksAvoided: state.blocksAvoided + 1 })),
  
  pause: () => set({ isPaused: true }),
  
  resume: () => set({ isPaused: false }),
  
  reset: () => set({
    ...initialState,
    screen: 'menu',
    telegramData: get().telegramData,
  }),
  
  initTelegram: (data: InitData) => set({ telegramData: data }),
  
  sendGameResult: () => {
    const state = get();
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const webApp = (window as any).Telegram.WebApp;
      webApp.sendData(JSON.stringify({
        type: 'game_result',
        score: state.score,
        distance: state.distance,
        time: state.time,
        blocksAvoided: state.blocksAvoided,
      }));
    }
  },
}));

