import type { ReactNode } from 'react';

import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { alpha } from '@mui/material/styles';

import { Iconify } from './iconify';
import { Gong, BrocadeBand } from './ornaments';

/** Full-screen frame for learn / challenge / practice: close button, progress bar, score. */
export function GameShell({
  progress,
  title,
  right,
  children,
  backTo,
}: {
  progress: number;
  title: ReactNode;
  right?: ReactNode;
  children: ReactNode;
  backTo: string;
}) {
  const navigate = useNavigate();
  return (
    <Stack sx={{ minHeight: '100vh' }}>
      <BrocadeBand motif="sleeve" height={14} />
      <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 2 }} sx={{ px: { xs: 1.5, sm: 4 }, py: { xs: 1.5, sm: 2.5 }, maxWidth: 1100, width: 1, mx: 'auto' }}>
        <IconButton onClick={() => navigate(backTo)} title="Thoát (Esc)">
          <Iconify icon="solar:close-circle-linear" width={28} />
        </IconButton>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap sx={{ color: 'text.secondary', mb: 0.75 }}>
            {title}
          </Typography>
          <LinearProgress variant="determinate" value={Math.min(100, progress)} sx={{ height: 12, bgcolor: (t) => alpha(t.palette.primary.main, 0.12) }} />
        </Box>
        {right}
      </Stack>
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: { xs: 2, sm: 3 }, pb: 6 }}>
        {children}
      </Box>
    </Stack>
  );
}

export function ScorePill({ score, combo }: { score: number; combo?: number }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <AnimatePresence>
        {combo && combo >= 3 ? (
          <motion.div key={combo} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
            <Box sx={{ px: 1.25, py: 0.5, borderRadius: 1, typography: 'subtitle2', color: 'error.main', bgcolor: (t) => alpha(t.palette.error.main, 0.12) }}>
              🔥 x{combo}
            </Box>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ px: 1.5, height: 40, borderRadius: 5, bgcolor: (t) => alpha(t.palette.secondary.main, 0.16), color: 'secondary.darker' }}>
        <Iconify icon="solar:star-bold-duotone" width={22} />
        <motion.span key={score} initial={{ scale: 1.4 }} animate={{ scale: 1 }} style={{ fontWeight: 800, fontSize: 18 }}>
          {score}
        </motion.span>
      </Stack>
    </Stack>
  );
}

type Line = { label: string; value: ReactNode };

/** End-of-round summary card. */
export function ResultCard({
  emoji,
  title,
  score,
  lines,
  children,
  onAgain,
  onExit,
}: {
  emoji: string;
  title: string;
  score: ReactNode;
  lines: Line[];
  children?: ReactNode;
  onAgain: () => void;
  onExit: () => void;
}) {
  return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
      <Card sx={{ width: 560, maxWidth: '92vw', textAlign: 'center', overflow: 'hidden' }}>
        <BrocadeBand motif="skirt" height={30} />
        <Box sx={{ p: 5, pt: 4 }}>
          <Typography sx={{ fontSize: 44, lineHeight: 1 }}>{emoji}</Typography>
          <Typography variant="h4" sx={{ mt: 1.5, mb: 2 }}>
            {title}
          </Typography>
          <motion.div initial={{ rotate: -8, scale: 0.6 }} animate={{ rotate: [-8, 6, -3, 0], scale: 1 }} transition={{ duration: 0.9 }} style={{ display: 'inline-block' }}>
            <Gong size={176}>
              <Typography variant="h3" sx={{ color: '#5F120B', lineHeight: 1.1, textShadow: '0 1px 0 rgba(255,255,255,.4)' }}>
                {score}
              </Typography>
            </Gong>
          </motion.div>
          <Stack direction="row" justifyContent="center" spacing={4} sx={{ my: 3 }}>
            {lines.map((l) => (
              <Box key={l.label}>
                <Typography variant="h5">{l.value}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {l.label}
                </Typography>
              </Box>
            ))}
          </Stack>
          {children}
          <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mt: 3 }}>
            <Button size="large" variant="outlined" color="inherit" onClick={onExit}>
              Về chọn chủ đề
            </Button>
            <Button size="large" variant="contained" onClick={onAgain} startIcon={<Iconify icon="solar:refresh-bold" />}>
              Chơi lại
            </Button>
          </Stack>
        </Box>
      </Card>
    </motion.div>
  );
}
