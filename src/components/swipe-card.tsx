import type { ReactNode } from 'react';

import { forwardRef, useImperativeHandle } from 'react';
import { motion, animate, useTransform, useMotionValue } from 'framer-motion';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { BrocadeBand, CornerDiamond } from './ornaments';

export type SwipeDir = 'left' | 'right';

export type SwipeCardHandle = { swipe: (dir: SwipeDir) => void };

type Props = {
  children: ReactNode;
  onSwipe: (dir: SwipeDir) => void;
  leftLabel: string;
  rightLabel: string;
  onTap?: () => void;
  disabled?: boolean;
};

const THRESHOLD = 120;

/** Draggable card: drag or call ref.swipe(); tilts and shows a stamp while dragging. */
export const SwipeCard = forwardRef<SwipeCardHandle, Props>(function SwipeCard(
  { children, onSwipe, leftLabel, rightLabel, onTap, disabled },
  ref
) {
  const theme = useTheme();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-18, 18]);
  const rightOpacity = useTransform(x, [20, THRESHOLD], [0, 1]);
  const leftOpacity = useTransform(x, [-THRESHOLD, -20], [1, 0]);
  const border = useTransform(
    x,
    [-THRESHOLD, 0, THRESHOLD],
    [theme.palette.warning.main, alpha(theme.palette.grey[500], 0.16), theme.palette.success.main]
  );

  const flyOut = (dir: SwipeDir) => {
    if (disabled) return;
    const to = dir === 'right' ? 640 : -640;
    animate(x, to, { duration: 0.28, ease: 'easeIn' }).then(() => {
      onSwipe(dir);
      x.set(0);
    });
  };

  useImperativeHandle(ref, () => ({ swipe: flyOut }));

  return (
    <motion.div
      drag={disabled ? false : 'x'}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      style={{ x, rotate, borderColor: border as unknown as string, touchAction: 'none' }}
      onDragEnd={(_, info) => {
        if (info.offset.x > THRESHOLD || info.velocity.x > 800) flyOut('right');
        else if (info.offset.x < -THRESHOLD || info.velocity.x < -800) flyOut('left');
      }}
      onTap={onTap}
      whileTap={{ cursor: 'grabbing' }}
      initial={{ scale: 0.92, opacity: 0, y: 24 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className="swipe-card"
    >
      <Box
        sx={{
          position: 'relative',
          width: 480,
          maxWidth: '86vw',
          height: 340,
          borderRadius: 3,
          border: '3px solid',
          borderColor: 'inherit',
          bgcolor: 'background.paper',
          boxShadow: (t) => t.customShadows.z24,
          cursor: disabled ? 'default' : 'grab',
          overflow: 'hidden',
        }}
      >
        <BrocadeBand motif="sawtooth" height={10} edges={false} sx={{ position: 'absolute', top: 0, left: 0 }} />
        <CornerDiamond size={18} sx={{ position: 'absolute', left: 14, bottom: 14, opacity: 0.85 }} />
        <CornerDiamond size={18} sx={{ position: 'absolute', right: 14, bottom: 14, opacity: 0.85 }} />
        {children}
        <Stamp opacity={rightOpacity} label={rightLabel} color={theme.palette.success.main} side="left" />
        <Stamp opacity={leftOpacity} label={leftLabel} color={theme.palette.warning.dark} side="right" />
      </Box>
    </motion.div>
  );
});

function Stamp({ opacity, label, color, side }: { opacity: ReturnType<typeof useMotionValue<number>>; label: string; color: string; side: 'left' | 'right' }) {
  return (
    <motion.div
      style={{
        opacity,
        position: 'absolute',
        top: 24,
        [side]: 24,
        rotate: side === 'left' ? -14 : 14,
        pointerEvents: 'none',
      }}
    >
      <Typography
        variant="h4"
        sx={{ px: 1.5, border: `4px solid ${color}`, color, borderRadius: 1.5, letterSpacing: 2, textTransform: 'uppercase', bgcolor: alpha('#fff', 0.85) }}
      >
        {label}
      </Typography>
    </motion.div>
  );
}
