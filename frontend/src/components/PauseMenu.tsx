import { Box, Paper, Typography, Button, Stack, Fade, Grow, Backdrop } from '@mui/material';
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
    <Backdrop
      open
      sx={{
        position: 'absolute',
        zIndex: 20,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <Fade in>
        <Grow in>
          <Paper
            elevation={24}
            sx={{
              p: 4,
              maxWidth: 400,
              width: '90%',
              mx: 2,
            }}
          >
            <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 700 }}>
              ⏸️ Пауза
            </Typography>

            <Stack spacing={2}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleResume}
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(45deg, #3b82f6 30%, #8b5cf6 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2563eb 30%, #7c3aed 90%)',
                  },
                }}
              >
                Продолжить
              </Button>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleQuit}
                sx={{
                  py: 1.5,
                  bgcolor: 'grey.700',
                  '&:hover': {
                    bgcolor: 'grey.600',
                  },
                }}
              >
                Выйти в меню
              </Button>
            </Stack>
          </Paper>
        </Grow>
      </Fade>
    </Backdrop>
  );
}



