import { useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { initDataRaw, initData } from '@twa-dev/sdk';
import Game from './components/Game';
import MainMenu from './components/MainMenu';
import { useGameStore } from './store/gameStore';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#1e40af',
    },
    secondary: {
      main: '#8b5cf6',
      light: '#a78bfa',
      dark: '#6d28d9',
    },
    background: {
      default: '#111827',
      paper: '#1f2937',
    },
    text: {
      primary: '#ffffff',
      secondary: '#d1d5db',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontSize: '1rem',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
        {screen === 'menu' && <MainMenu />}
        {screen === 'game' && <Game />}
        {screen === 'gameover' && <MainMenu />}
      </div>
    </ThemeProvider>
  );
}

export default App;

