import { Box, Paper, Typography, IconButton, Stack } from '@mui/material';
import PauseIcon from '@mui/icons-material/Pause';
import { useGameStore } from '../store/gameStore';

export default function GameUI() {
  const { score, distance, time, blocksAvoided, pause } = useGameStore();

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        p: 2,
        zIndex: 10,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Paper
          elevation={4}
          sx={{
            p: 2,
            background: 'rgba(17, 24, 39, 0.8)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Очки
          </Typography>
          <Typography variant="h4" sx={{ color: '#60a5fa', fontWeight: 700 }}>
            {score.toLocaleString()}
          </Typography>
        </Paper>

        <IconButton
          onClick={pause}
          sx={{
            background: 'rgba(17, 24, 39, 0.8)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              background: 'rgba(31, 41, 55, 0.8)',
            },
          }}
        >
          <PauseIcon sx={{ fontSize: 28, color: 'white' }} />
        </IconButton>
      </Box>

      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <Paper
          elevation={4}
          sx={{
            px: 2,
            py: 1,
            background: 'rgba(17, 24, 39, 0.8)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            📏{' '}
          </Typography>
          <Typography variant="body2" sx={{ color: '#34d399', fontWeight: 600, display: 'inline' }}>
            {Math.floor(distance)}m
          </Typography>
        </Paper>
        <Paper
          elevation={4}
          sx={{
            px: 2,
            py: 1,
            background: 'rgba(17, 24, 39, 0.8)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            ⏱{' '}
          </Typography>
          <Typography variant="body2" sx={{ color: '#a78bfa', fontWeight: 600, display: 'inline' }}>
            {Math.floor(time / 1000)}s
          </Typography>
        </Paper>
        <Paper
          elevation={4}
          sx={{
            px: 2,
            py: 1,
            background: 'rgba(17, 24, 39, 0.8)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            🎯{' '}
          </Typography>
          <Typography variant="body2" sx={{ color: '#fbbf24', fontWeight: 600, display: 'inline' }}>
            {blocksAvoided}
          </Typography>
        </Paper>
      </Stack>
    </Box>
  );
}



