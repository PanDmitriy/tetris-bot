import { Box, Container, Typography, Button, Paper, Grid, Fade, Grow } from '@mui/material';
import { useGameStore } from '../store/gameStore';

export default function MainMenu() {
  const { setScreen, score, distance, time, blocksAvoided, reset } = useGameStore();

  const handlePlay = () => {
    reset();
    setScreen('game');
  };

  const hasGameResult = score > 0 || distance > 0;

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        background: 'linear-gradient(to bottom, #111827, #1f2937, #111827)',
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={500}>
          <Box sx={{ textAlign: 'center' }}>
            <Grow in timeout={700}>
              <Typography
                variant="h1"
                sx={{
                  mb: 2,
                  fontSize: { xs: '3rem', sm: '4rem' },
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #60a5fa 30%, #a78bfa 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                🚗 Tetris Racing
              </Typography>
            </Grow>

            <Fade in timeout={900}>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  mb: 4,
                  fontSize: '1.125rem',
                }}
              >
                Избегайте падающих блоков и набирайте очки!
              </Typography>
            </Fade>

            {hasGameResult && (
              <Fade in timeout={1100}>
                <Paper
                  elevation={8}
                  sx={{
                    p: 3,
                    mb: 3,
                    background: 'rgba(31, 41, 55, 0.5)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Последний результат:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Очки
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#60a5fa', fontWeight: 700 }}>
                        {score.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Расстояние
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#34d399', fontWeight: 700 }}>
                        {Math.floor(distance)}m
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Время
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#a78bfa', fontWeight: 700 }}>
                        {Math.floor(time / 1000)}s
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Блоков
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#fbbf24', fontWeight: 700 }}>
                        {blocksAvoided}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Fade>
            )}

            <Grow in timeout={1300}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handlePlay}
                sx={{
                  py: 2,
                  fontSize: '1.25rem',
                  background: 'linear-gradient(45deg, #3b82f6 30%, #8b5cf6 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2563eb 30%, #7c3aed 90%)',
                    transform: 'scale(1.05)',
                  },
                  transition: 'transform 0.2s',
                }}
              >
                🎮 Играть
              </Button>
            </Grow>

            <Fade in timeout={1500}>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  mt: 3,
                  display: 'block',
                }}
              >
                Используйте стрелки для управления
              </Typography>
            </Fade>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}



