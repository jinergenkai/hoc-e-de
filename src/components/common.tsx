import type { ReactNode } from 'react';
import type { TypographyProps } from '@mui/material/Typography';

import { useState } from 'react';
import confetti from 'canvas-confetti';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import audioManifest from 'src/data/audio-manifest.json';
import { SAMPLE_DATA_NOTICE } from 'src/data/vocab';
import { useRecordings, recordingUrl } from 'src/store/recordings';

import { Iconify } from './iconify';
import { BrocadeBand, CornerDiamond } from './ornaments';

// ----------------------------------------------------------------------

export function RadeText({ children, ...other }: TypographyProps) {
  return (
    <Typography variant="rade" lang="rad" data-selectable {...other}>
      {children}
    </Typography>
  );
}

// ----------------------------------------------------------------------

const audioFiles = audioManifest as Record<string, string>;

/** Bundled file (public/audio) or an in-app recording. */
export function useHasAudio(id: string) {
  const recorded = useRecordings((st) => st.ids.has(id));
  return recorded || Boolean(audioFiles[id]);
}

/** Plays the in-app recording if there is one, otherwise the bundled file. */
export async function playAudio(id: string, onEnd?: () => void): Promise<boolean> {
  const url = useRecordings.getState().ids.has(id) ? await recordingUrl(id) : audioFiles[id] ? `./audio/${audioFiles[id]}` : null;
  if (!url) return false;
  const audio = new Audio(url);
  const finish = () => {
    if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    onEnd?.();
  };
  audio.onended = finish;
  try {
    await audio.play();
    return true;
  } catch {
    finish();
    return false;
  }
}

export function AudioButton({ id, size = 44 }: { id: string; size?: number }) {
  const [playing, setPlaying] = useState(false);
  const available = useHasAudio(id);

  if (!available) {
    return (
      <Tooltip title="Âm thanh sẽ được bổ sung" arrow>
        <span>
          <IconButton disabled sx={{ width: size, height: size }}>
            <Iconify icon="solar:volume-cross-bold-duotone" width={size * 0.5} />
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  const play = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaying(true);
    playAudio(id, () => setPlaying(false)).then((ok) => !ok && setPlaying(false));
  };

  return (
    <IconButton
      onClick={play}
      onPointerDown={(e) => e.stopPropagation()}
      color="primary"
      sx={{
        width: size,
        height: size,
        bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
        ...(playing && { animation: 'pulse 0.8s ease-in-out infinite' }),
        '@keyframes pulse': { '50%': { transform: 'scale(1.12)' } },
      }}
    >
      <Iconify icon="solar:volume-loud-bold-duotone" width={size * 0.5} />
    </IconButton>
  );
}

// ----------------------------------------------------------------------

/** Kept for existing call sites: a diamond brocade band without edges. */
export function BrocadeStripe({ height = 14, sx }: { height?: number; sx?: object }) {
  return <BrocadeBand motif="skirt" height={height} sx={sx} />;
}

// ----------------------------------------------------------------------

export function SampleDataChip() {
  return (
    <Tooltip title="Từ vựng, câu mẫu và ghi chú phát âm sẽ được thay bằng dữ liệu đã duyệt" arrow>
      <Chip
        size="small"
        color="warning"
        variant="outlined"
        icon={<Iconify icon="solar:info-circle-bold-duotone" width={16} />}
        label={SAMPLE_DATA_NOTICE}
      />
    </Tooltip>
  );
}

// ----------------------------------------------------------------------

export function PageTitle({ title, subtitle, action }: { title: string; subtitle?: ReactNode; action?: ReactNode }) {
  return (
    <Stack direction="row" alignItems="flex-end" justifyContent="space-between" spacing={2} sx={{ mb: 4 }}>
      <Box sx={{ minWidth: 0 }}>
        <Stack direction="row" alignItems="center" spacing={1.25}>
          <CornerDiamond size={22} />
          <Typography variant="h4">{title}</Typography>
        </Stack>
        {subtitle && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
        <BrocadeBand motif="sleeve" height={9} sx={{ width: 96, mt: 1.5, borderRadius: 0.5, overflow: 'hidden' }} />
      </Box>
      {action && <Box sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}>{action}</Box>}
    </Stack>
  );
}

// ----------------------------------------------------------------------

export function KeyHint({ children }: { children: ReactNode }) {
  return (
    <Box
      component="kbd"
      sx={{
        px: 0.75,
        py: 0.125,
        ml: 1,
        borderRadius: 0.75,
        fontSize: 11,
        fontWeight: 700,
        fontFamily: 'inherit',
        lineHeight: 1.6,
        bgcolor: (t) => alpha(t.palette.common.black, 0.08),
        color: 'inherit',
        opacity: 0.8,
      }}
    >
      {children}
    </Box>
  );
}

// ----------------------------------------------------------------------

export function celebrate() {
  const colors = ['#C8401E', '#E0A100', '#1C252E', '#22C55E'];
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors });
  setTimeout(() => confetti({ particleCount: 60, angle: 60, spread: 60, origin: { x: 0 }, colors }), 200);
  setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 60, origin: { x: 1 }, colors }), 350);
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
