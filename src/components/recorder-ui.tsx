import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { playBlob, useRecorder } from 'src/hooks/use-recorder';

import { Iconify } from './iconify';
import { AudioButton } from './common';

type MicProps = { recording: boolean; level: number; size?: number; onClick: () => void; disabled?: boolean };

/** Round microphone button; while recording it pulses with the input level. */
export function MicButton({ recording, level, size = 64, onClick, disabled }: MicProps) {
  return (
    <Box sx={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {recording && (
        <motion.div
          animate={{ scale: 1 + level * 0.6 }}
          transition={{ duration: 0.08 }}
          style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(255,86,48,.24)' }}
        />
      )}
      <ButtonBase
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerDown={(e) => e.stopPropagation()}
        sx={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          color: 'common.white',
          bgcolor: recording ? 'error.main' : 'primary.main',
          boxShadow: (t) => (recording ? t.customShadows.error : t.customShadows.primary),
          '&:hover': { bgcolor: recording ? 'error.dark' : 'primary.dark' },
          '&.Mui-disabled': { bgcolor: 'grey.300' },
        }}
      >
        {recording ? (
          <Box sx={{ width: size * 0.3, height: size * 0.3, borderRadius: 0.5, bgcolor: 'common.white' }} />
        ) : (
          <Iconify icon="solar:microphone-3-bold-duotone" width={size * 0.45} />
        )}
      </ButtonBase>
    </Box>
  );
}

export function micErrorText(state: string) {
  if (state === 'denied') return 'Không truy cập được micro. Hãy cắm micro và cho phép ứng dụng dùng micro.';
  if (state === 'unsupported') return 'Máy này không hỗ trợ ghi âm.';
  return '';
}

// ----------------------------------------------------------------------

/**
 * Learner speaking practice: listen to the native recording, record yourself,
 * play yourself back to compare. Nothing is stored.
 */
export function SpeakPractice({ audioId, compact }: { audioId: string; compact?: boolean }) {
  const rec = useRecorder({ maxMs: 6000 });
  const [mine, setMine] = useState<Blob | null>(null);
  const [playing, setPlaying] = useState(false);
  const stopRef = useRef<(() => void) | undefined>(undefined);

  const toggle = async () => {
    if (rec.recording) {
      rec.stop();
      return;
    }
    stopRef.current?.();
    const blob = await rec.start();
    if (blob) setMine(blob);
  };

  const playMine = () => {
    if (!mine) return;
    setPlaying(true);
    stopRef.current = playBlob(mine, () => setPlaying(false));
  };

  const err = micErrorText(rec.state);

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      sx={{ p: compact ? 1 : 1.5, borderRadius: 2, bgcolor: (t) => alpha(t.palette.grey[500], 0.08) }}
    >
      <Tooltip title="Nghe giọng mẫu" arrow>
        <span>
          <AudioButton id={audioId} size={compact ? 36 : 40} />
        </span>
      </Tooltip>
      <MicButton recording={rec.recording} level={rec.level} size={compact ? 40 : 48} onClick={toggle} disabled={Boolean(err)} />
      <Tooltip title="Nghe lại giọng của bạn" arrow>
        <span>
          <ButtonBase
            disabled={!mine || rec.recording}
            onClick={playMine}
            sx={{
              height: compact ? 36 : 40,
              px: 1.5,
              gap: 0.75,
              borderRadius: 5,
              typography: 'subtitle2',
              color: 'secondary.darker',
              bgcolor: (t) => alpha(t.palette.secondary.main, 0.2),
              '&.Mui-disabled': { opacity: 0.4 },
              ...(playing && { animation: 'pulse 0.8s ease-in-out infinite', '@keyframes pulse': { '50%': { transform: 'scale(1.06)' } } }),
            }}
          >
            <Iconify icon="solar:play-circle-bold-duotone" width={20} />
            Giọng tôi
          </ButtonBase>
        </span>
      </Tooltip>
      {!compact && (
        <Typography variant="caption" sx={{ color: err ? 'error.main' : 'text.secondary', maxWidth: 180 }}>
          {err || (rec.recording ? `Đang ghi… ${(rec.elapsed / 1000).toFixed(1)}s` : mine ? 'So sánh với giọng mẫu' : 'Bấm micro để luyện nói')}
        </Typography>
      )}
    </Stack>
  );
}
