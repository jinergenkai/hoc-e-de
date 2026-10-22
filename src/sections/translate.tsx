import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { alpha } from '@mui/material/styles';

import type { Direction, Translation } from 'src/utils/translator';
import { createTranslator } from 'src/utils/translator';
import { words, sentences, wordById } from 'src/data/vocab';

import { Iconify } from 'src/components/iconify';
import { RadeInput } from 'src/components/rade-input';
import { KeyHint, RadeText, PageTitle, SampleDataChip } from 'src/components/common';

const translator = createTranslator(words, sentences);

const EXAMPLES: Record<Direction, string[]> = {
  'vi-rade': ['Tôi đi học', 'Mẹ không ăn cơm', 'Bạn đi đâu?', 'Bố uống nước', 'Ai dạy bạn học tiếng Ê-đê?'],
  'rade-vi': ['Kâo amâo nao mă bruă ôh.', 'Amĭ ƀơ̆ng êsei.', 'Ñu hriăm hră', 'Ama mnăm êa'],
};

export function TranslatePage() {
  const [dir, setDir] = useState<Direction>('vi-rade');
  const [text, setText] = useState('');
  const [result, setResult] = useState<Translation | null>(null);
  const [thinking, setThinking] = useState(false);
  const [typed, setTyped] = useState('');

  const run = (value = text, d = dir) => {
    if (!value.trim()) return;
    setThinking(true);
    setResult(null);
    setTyped('');
    // Short "thinking" beat, then type the answer out
    setTimeout(() => {
      setResult(translator.translate(value, d));
      setThinking(false);
    }, 650);
  };

  useEffect(() => {
    if (!result) return undefined;
    const chars = Array.from(result.text);
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setTyped(chars.slice(0, i).join(''));
      if (i >= chars.length) clearInterval(t);
    }, 22);
    return () => clearInterval(t);
  }, [result]);

  const swap = () => {
    const nextDir: Direction = dir === 'vi-rade' ? 'rade-vi' : 'vi-rade';
    setDir(nextDir);
    if (result?.text) {
      const clean = result.text.replace(/[[\]]/g, '');
      setText(clean);
      run(clean, nextDir);
    } else {
      setResult(null);
    }
  };

  const srcLabel = dir === 'vi-rade' ? 'Tiếng Việt' : 'Tiếng Ê-đê';
  const dstLabel = dir === 'vi-rade' ? 'Tiếng Ê-đê' : 'Tiếng Việt';
  const done = result && typed.length >= result.text.length;

  return (
    <>
      <PageTitle
        title="Dịch thông minh"
        subtitle="Dịch Việt ↔ Ê-đê ngay trên máy, không cần mạng. Gõ câu ngắn để có kết quả tốt nhất."
        action={<SampleDataChip />}
      />

      <Card sx={{ overflow: 'visible' }}>
        <Stack direction="row" alignItems="center" sx={{ px: 3, py: 2 }}>
          <Typography variant="subtitle1" sx={{ flex: 1 }}>
            {srcLabel}
          </Typography>
          <Tooltip title="Đổi chiều dịch" arrow>
            <IconButton onClick={swap} sx={{ mx: 2, bgcolor: (t) => alpha(t.palette.primary.main, 0.08), color: 'primary.main' }}>
              <Iconify icon="solar:transfer-horizontal-bold-duotone" width={24} />
            </IconButton>
          </Tooltip>
          <Typography variant="subtitle1" sx={{ flex: 1, textAlign: 'right' }}>
            {dstLabel}
          </Typography>
        </Stack>
        <Divider />
        <Grid container>
          <Grid size={{ xs: 12, md: 6 }} sx={{ p: 3, borderRight: { md: (t) => `1px dashed ${alpha(t.palette.grey[500], 0.24)}` } }}>
            <RadeInput
              value={text}
              onChange={setText}
              showKeys={dir === 'rade-vi'}
              multiline
              minRows={4}
              placeholder={dir === 'vi-rade' ? 'Nhập câu tiếng Việt…' : 'Nhập câu tiếng Ê-đê…'}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  run();
                }
              }}
              sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, '& textarea': { fontSize: 22 } }}
            />
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
              {EXAMPLES[dir].map((ex) => (
                <Chip
                  key={ex}
                  label={ex}
                  variant="outlined"
                  clickable
                  onClick={() => {
                    setText(ex);
                    run(ex);
                  }}
                  sx={{ fontFamily: '"Noto Sans"' }}
                />
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={{ p: 3, minHeight: 220, bgcolor: (t) => alpha(t.palette.grey[500], 0.04) }}>
            <AnimatePresence mode="wait">
              {thinking && (
                <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ color: 'primary.main' }}>
                    <motion.div animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                      <Iconify icon="solar:magic-stick-3-bold-duotone" width={28} />
                    </motion.div>
                    <Typography variant="subtitle1">Đang phân tích câu…</Typography>
                  </Stack>
                  <Stack spacing={1.5} sx={{ mt: 3 }}>
                    {[90, 70, 50].map((w) => (
                      <Box key={w} sx={{ height: 14, width: `${w}%`, borderRadius: 1, ...shimmer }} />
                    ))}
                  </Stack>
                </motion.div>
              )}
              {!thinking && result && (
                <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {dir === 'vi-rade' ? (
                    <RadeText sx={{ fontSize: 28, lineHeight: 1.4, minHeight: 80 }}>{typed}</RadeText>
                  ) : (
                    <Typography sx={{ fontSize: 28, lineHeight: 1.4, fontWeight: 600, minHeight: 80 }}>{typed}</Typography>
                  )}
                  {done && <ResultDetails result={result} />}
                </motion.div>
              )}
              {!thinking && !result && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ height: 180, color: 'text.disabled' }}>
                    <Iconify icon="solar:magic-stick-3-bold-duotone" width={48} />
                    <Typography variant="body2">Bản dịch sẽ hiện ở đây</Typography>
                  </Stack>
                </motion.div>
              )}
            </AnimatePresence>
          </Grid>
        </Grid>
        <Divider />
        <Stack direction="row" justifyContent="flex-end" sx={{ px: 3, py: 2 }}>
          <Button size="large" variant="contained" onClick={() => run()} disabled={!text.trim() || thinking} startIcon={<Iconify icon="solar:magic-stick-3-bold-duotone" />}>
            Dịch <KeyHint>Enter</KeyHint>
          </Button>
        </Stack>
      </Card>
    </>
  );
}

const shimmer = {
  background: 'linear-gradient(90deg, rgba(145,158,171,.12) 25%, rgba(145,158,171,.28) 50%, rgba(145,158,171,.12) 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.2s infinite',
  '@keyframes shimmer': { from: { backgroundPosition: '200% 0' }, to: { backgroundPosition: '-200% 0' } },
};

function ResultDetails({ result }: { result: Translation }) {
  const pct = Math.round(result.confidence * 100);
  const color = pct >= 90 ? 'success' : pct >= 60 ? 'warning' : 'error';

  const parts = useMemo(() => result.segments.filter((s) => s.src), [result]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Stack spacing={2.5} sx={{ mt: 3 }}>
        <Box>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Độ tin cậy {result.source === 'sentence' ? '· khớp câu mẫu' : '· dịch theo từ'}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: `${color}.dark` }}>
              {pct}%
            </Typography>
          </Stack>
          <LinearProgress variant="determinate" value={pct} color={color} sx={{ bgcolor: (t) => alpha(t.palette[color].main, 0.16) }} />
        </Box>

        {result.source === 'dictionary' && (
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
              Phân tích từng từ
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {parts.map((s, i) => {
                const w = s.wordId ? wordById.get(s.wordId) : undefined;
                const tip = w ? [w.pos, w.vi.join(', '), w.note].filter(Boolean).join(' · ') : 'Chưa có trong từ điển';
                return (
                  <Tooltip key={`${s.src}-${i}`} title={tip} arrow>
                    <Box
                      sx={{
                        px: 1.25,
                        py: 0.5,
                        borderRadius: 1,
                        textAlign: 'center',
                        bgcolor: (t) => alpha(s.known ? t.palette.primary.main : t.palette.warning.main, 0.1),
                        border: (t) => `1px solid ${alpha(s.known ? t.palette.primary.main : t.palette.warning.main, 0.24)}`,
                      }}
                    >
                      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                        {s.src}
                      </Typography>
                      <RadeText sx={{ fontSize: 15, color: s.known ? 'primary.dark' : 'warning.dark' }}>{s.known ? s.out : '?'}</RadeText>
                    </Box>
                  </Tooltip>
                );
              })}
            </Stack>
          </Box>
        )}

        {result.notes.map((n) => (
          <Stack key={n} direction="row" spacing={1} alignItems="flex-start" sx={{ color: 'text.secondary' }}>
            <Iconify icon="solar:lightbulb-bolt-bold-duotone" width={18} sx={{ mt: 0.25, color: 'secondary.main' }} />
            <Typography variant="body2">{n}</Typography>
          </Stack>
        ))}
      </Stack>
    </motion.div>
  );
}
