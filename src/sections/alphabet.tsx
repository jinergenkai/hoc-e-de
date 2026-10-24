import { useState } from 'react';
import { motion } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import type { Letter } from 'src/data/alphabet';
import { words } from 'src/data/vocab';
import { graphemes } from 'src/utils/text';
import { alphabet, ALPHABET_FACTS } from 'src/data/alphabet';

import { Iconify } from 'src/components/iconify';
import { CornerDiamond } from 'src/components/ornaments';
import { RadeText, PageTitle, AudioButton } from 'src/components/common';

const letterId = (l: Letter) => `l-${l.lower}`;

export function AlphabetPage() {
  const [open, setOpen] = useState<Letter | null>(null);
  const [filter, setFilter] = useState<'all' | 'vowel' | 'consonant' | 'special'>('all');

  const list = alphabet.filter((l) => (filter === 'all' ? true : filter === 'special' ? l.special : l.kind === filter));

  return (
    <>
      <PageTitle title="Bảng chữ cái Êđê" subtitle="Bŏh hră Êđê · 38 chữ cái. Bấm vào chữ để xem cách đọc và từ ví dụ." />

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {ALPHABET_FACTS.map((f, i) => (
          <Grid key={f.title} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={{ p: 2.5, height: 1, bgcolor: i % 2 ? 'secondary.lighter' : 'primary.lighter' }}>
              <Typography variant="subtitle1" sx={{ color: i % 2 ? 'secondary.darker' : 'primary.darker' }}>
                {f.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                {f.body}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        {(
          [
            ['all', 'Tất cả (38)'],
            ['vowel', 'Nguyên âm'],
            ['consonant', 'Phụ âm'],
            ['special', 'Chữ riêng Ê-đê'],
          ] as const
        ).map(([v, label]) => (
          <Chip key={v} label={label} clickable color={filter === v ? 'primary' : 'default'} variant={filter === v ? 'filled' : 'outlined'} onClick={() => setFilter(v)} />
        ))}
      </Stack>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(112px, 1fr))' }}>
        {list.map((l, i) => (
          <motion.div key={l.lower} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.015 }}>
            <ButtonBase
              onClick={() => setOpen(l)}
              sx={{
                width: 1,
                position: 'relative',
                aspectRatio: '1',
                borderRadius: 2,
                flexDirection: 'column',
                bgcolor: 'background.paper',
                boxShadow: (t) => t.customShadows.card,
                border: (t) => (l.special ? `2px solid ${alpha(t.palette.primary.main, 0.48)}` : '2px solid transparent'),
                transition: 'transform .15s',
                '&:hover': { transform: 'translateY(-4px) rotate(-2deg)', bgcolor: 'primary.lighter' },
              }}
            >
              <RadeText sx={{ fontSize: 40, lineHeight: 1.1, color: l.special ? 'primary.main' : 'text.primary' }}>
                {l.upper}
                <Box component="span" sx={{ fontSize: 28, ml: 0.5, opacity: 0.6 }}>
                  {l.lower}
                </Box>
              </RadeText>
              {l.special && <CornerDiamond size={16} sx={{ position: 'absolute', top: 8, right: 8 }} />}
              {l.special && (
                <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, mt: 0.5 }}>
                  riêng Ê-đê
                </Typography>
              )}
            </ButtonBase>
          </motion.div>
        ))}
      </Box>

      <Dialog open={Boolean(open)} onClose={() => setOpen(null)} maxWidth="xs" fullWidth>
        {open && <LetterDetail letter={open} />}
      </Dialog>
    </>
  );
}

function LetterDetail({ letter }: { letter: Letter }) {
  // Words containing the letter, the ones starting with it first
  const examples = words
    .filter((w) => graphemes(w.rade.toLowerCase()).includes(letter.lower))
    .sort((a, b) => Number(!graphemes(a.rade.toLowerCase())[0].startsWith(letter.lower)) - Number(!graphemes(b.rade.toLowerCase())[0].startsWith(letter.lower)))
    .slice(0, 5);

  return (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <RadeText sx={{ fontSize: 96, lineHeight: 1, color: 'primary.main' }}>
          {letter.upper}
          {letter.lower}
        </RadeText>
        <AudioButton id={letterId(letter)} size={56} />
      </Stack>
      <Stack direction="row" spacing={1} sx={{ my: 2 }}>
        <Chip size="small" label={letter.kind === 'vowel' ? 'Nguyên âm' : 'Phụ âm'} />
        {letter.special && <Chip size="small" color="primary" label="Không có trong tiếng Việt" />}
      </Stack>
      <Typography variant="body1">{letter.note}</Typography>

      <Typography variant="subtitle2" sx={{ mt: 3, mb: 1.5 }}>
        Từ ví dụ
      </Typography>
      {examples.length === 0 && (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Sẽ bổ sung khi có thêm từ vựng.
        </Typography>
      )}
      <Stack spacing={1}>
        {examples.map((w) => (
          <Stack key={w.id} direction="row" alignItems="center" spacing={1.5} sx={{ p: 1.25, borderRadius: 1, bgcolor: 'grey.100' }}>
            <RadeText sx={{ fontSize: 20, minWidth: 100 }}>{w.rade}</RadeText>
            <Iconify icon="solar:alt-arrow-right-linear" width={16} sx={{ color: 'text.disabled' }} />
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {w.vi.join(', ')}
            </Typography>
            <AudioButton id={w.id} size={32} />
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
