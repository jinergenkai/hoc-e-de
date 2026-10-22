import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { words, topicById } from 'src/data/vocab';
import { dayKey, levelOf, useProgress } from 'src/store/progress';

import { Iconify } from 'src/components/iconify';
import { TopicGrid } from 'src/components/topic-grid';
import { RadeText, AudioButton, BrocadeStripe, SampleDataChip } from 'src/components/common';

export function HomePage() {
  const navigate = useNavigate();
  const xp = useProgress((s) => s.xp);
  const streak = useProgress((s) => s.streak);
  const cards = useProgress((s) => s.cards);
  const best = useProgress((s) => s.bestChallenge);
  const sessions = useProgress((s) => s.sessions);
  const knownCount = Object.values(cards).filter((c) => c.known).length;

  return (
    <Stack spacing={4}>
      <Hero onLearn={() => navigate('/learn')} onChallenge={() => navigate('/challenge/all')} />

      <Grid container spacing={3}>
        <Stat title="Từ đã thuộc" value={`${knownCount}/${words.length}`} icon="solar:card-2-bold-duotone" color="primary" />
        <Stat title="Chuỗi ngày học" value={`${streak} ngày`} icon="solar:fire-bold-duotone" color="error" />
        <Stat title="Kỷ lục thử thách" value={`${best} điểm`} icon="solar:medal-ribbons-star-bold-duotone" color="secondary" />
        <Stat title="Cấp độ" value={`Cấp ${levelOf(xp)}`} icon="solar:star-bold-duotone" color="info" />
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h5">Chủ đề</Typography>
            <SampleDataChip />
          </Stack>
          <TopicGrid onPick={(id) => navigate(`/learn/${id}`)} columns={{ xs: 12, sm: 6, lg: 6 }} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <WordOfDay />
            <Recent sessions={sessions} />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function Hero({ onLearn, onChallenge }: { onLearn: () => void; onChallenge: () => void }) {
  return (
    <Card
      sx={{
        color: 'common.white',
        background: (t) => `linear-gradient(120deg, ${t.palette.primary.darker} 0%, ${t.palette.primary.dark} 45%, ${t.palette.primary.main} 100%)`,
        overflow: 'hidden',
      }}
    >
      <Stack direction="row" alignItems="center" sx={{ p: { xs: 4, md: 5 }, position: 'relative' }}>
        <Box sx={{ maxWidth: 560, position: 'relative', zIndex: 1 }}>
          <Typography variant="overline" sx={{ opacity: 0.72 }}>
            Hriăm klei Êđê
          </Typography>
          <Typography variant="h3" sx={{ mt: 1, mb: 1.5 }}>
            Học tiếng Ê-đê mỗi ngày, mỗi ngày một ít
          </Typography>
          <Typography sx={{ opacity: 0.8, mb: 3 }}>
            Quẹt thẻ để nhớ từ, luyện dịch có chấm điểm ngay, không cần mạng.
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <Button size="large" variant="contained" color="secondary" onClick={onLearn} startIcon={<Iconify icon="solar:card-2-bold-duotone" />}>
              Học thẻ ngay
            </Button>
            <Button
              size="large"
              variant="outlined"
              onClick={onChallenge}
              startIcon={<Iconify icon="solar:stopwatch-bold-duotone" />}
              sx={{ color: 'common.white', borderColor: alpha('#fff', 0.48), '&:hover': { borderColor: '#fff', bgcolor: alpha('#fff', 0.08) } }}
            >
              Thử thách 60 giây
            </Button>
          </Stack>
        </Box>
        <FloatingLetters />
      </Stack>
      <BrocadeStripe height={14} />
    </Card>
  );
}

function FloatingLetters() {
  const letters = [
    { ch: 'ƀ', x: '64%', y: '18%', s: 96, d: 0 },
    { ch: 'ñ', x: '80%', y: '48%', s: 80, d: 0.6 },
    { ch: 'č', x: '70%', y: '62%', s: 64, d: 1.2 },
    { ch: 'ơ̆', x: '88%', y: '10%', s: 56, d: 0.3 },
    { ch: 'ĕ', x: '92%', y: '70%', s: 44, d: 0.9 },
  ];
  return (
    <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: { xs: 'none', md: 'block' } }}>
      {letters.map((l) => (
        <motion.div
          key={l.ch}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: [0, -14, 0], opacity: 1 }}
          transition={{ duration: 4, delay: l.d, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', left: l.x, top: l.y }}
        >
          <Box
            sx={{
              fontFamily: '"Noto Sans"',
              fontWeight: 800,
              fontSize: l.s,
              lineHeight: 1,
              color: alpha('#fff', 0.9),
              textShadow: '0 12px 24px rgba(0,0,0,.24)',
            }}
          >
            {l.ch}
          </Box>
        </motion.div>
      ))}
    </Box>
  );
}

// ----------------------------------------------------------------------

type StatProps = { title: string; value: string; icon: string; color: 'primary' | 'secondary' | 'info' | 'error' };

function Stat({ title, value, icon, color }: StatProps) {
  return (
    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
      <Card sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            color: `${color}.main`,
            bgcolor: (t) => alpha(t.palette[color].main, 0.12),
          }}
        >
          <Iconify icon={icon} width={32} />
        </Box>
        <Box>
          <Typography variant="h5">{value}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {title}
          </Typography>
        </Box>
      </Card>
    </Grid>
  );
}

// ----------------------------------------------------------------------

function WordOfDay() {
  const day = dayKey();
  const seed = Array.from(day).reduce((a, c) => a * 31 + c.charCodeAt(0), 7) >>> 0;
  const word = words[seed % words.length];
  const topic = topicById.get(word.topicId);

  return (
    <Card sx={{ p: 3, overflow: 'hidden' }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2, color: 'secondary.dark' }}>
        <Iconify icon="solar:lightbulb-bolt-bold-duotone" width={22} />
        <Typography variant="subtitle2">Từ của ngày</Typography>
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <RadeText sx={{ fontSize: 44, lineHeight: 1.2 }}>{word.rade}</RadeText>
        <AudioButton id={word.id} />
      </Stack>
      <Typography variant="h6" sx={{ mt: 1 }}>
        {word.vi.join(', ')}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {[word.pos, topic?.name].filter(Boolean).join(' · ')}
      </Typography>
      {word.note && (
        <Typography variant="body2" sx={{ mt: 1.5, p: 1.5, borderRadius: 1, bgcolor: 'grey.100' }}>
          {word.note}
        </Typography>
      )}
    </Card>
  );
}

function Recent({ sessions }: { sessions: ReturnType<typeof useProgress.getState>['sessions'] }) {
  const label = { learn: 'Học thẻ', challenge: 'Thử thách', practice: 'Luyện dịch' } as const;
  const icon = { learn: 'solar:card-2-bold-duotone', challenge: 'solar:bolt-bold-duotone', practice: 'solar:pen-new-square-bold-duotone' } as const;

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Hoạt động gần đây
      </Typography>
      {sessions.length === 0 && (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Chưa có bài nào. Bắt đầu với một chủ đề bên trái nhé!
        </Typography>
      )}
      <Stack spacing={2}>
        {sessions.slice(0, 5).map((s) => (
          <Stack key={s.date} direction="row" alignItems="center" spacing={1.5}>
            <Iconify icon={icon[s.kind]} width={24} sx={{ color: 'text.secondary' }} />
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap>
                {label[s.kind]} · {s.topicId === 'all' ? 'Tất cả' : (topicById.get(s.topicId)?.name ?? '')}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                {new Date(s.date).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
              </Typography>
            </Box>
            <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
              {s.score}
              {s.kind === 'practice' ? `/${s.total}` : ' đ'}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}

