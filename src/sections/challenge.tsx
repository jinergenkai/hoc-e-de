import { useNavigate, useParams } from 'react-router-dom';
import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import type { Word } from 'src/data/vocab';
import { words, topicById, wordsByTopic } from 'src/data/vocab';
import { useProgress } from 'src/store/progress';

import { Iconify } from 'src/components/iconify';
import { TopicGrid } from 'src/components/topic-grid';
import { SwipeCard, type SwipeCardHandle } from 'src/components/swipe-card';
import { GameShell, ScorePill, ResultCard } from 'src/components/game-shell';
import { KeyHint, RadeText, PageTitle, celebrate, shuffle } from 'src/components/common';

const DURATION = 60;

export function ChallengePickPage() {
  const navigate = useNavigate();
  const best = useProgress((s) => s.bestChallenge);
  return (
    <>
      <PageTitle
        title="Thử thách quẹt 60 giây"
        subtitle={`Nghĩa đúng → quẹt phải, nghĩa sai → quẹt trái. Đúng liên tiếp để nhân điểm! Kỷ lục của bạn: ${best} điểm.`}
      />
      <TopicGrid includeAll onPick={(id) => navigate(`/challenge/${id}`)} />
    </>
  );
}

// ----------------------------------------------------------------------

type Round = { word: Word; shown: string; isTrue: boolean };

function makeRound(pool: Word[]): Round {
  const word = pool[Math.floor(Math.random() * pool.length)];
  const isTrue = Math.random() < 0.5;
  if (isTrue) return { word, shown: word.vi[0], isTrue };
  // Distractor: prefer same topic so it is not too easy
  const sameTopic = words.filter((w) => w.topicId === word.topicId && w.id !== word.id);
  const others = sameTopic.length >= 2 ? sameTopic : words.filter((w) => w.id !== word.id);
  const d = others[Math.floor(Math.random() * others.length)];
  return { word, shown: d.vi[0], isTrue: false };
}

const multiplierOf = (combo: number) => (combo >= 8 ? 3 : combo >= 4 ? 2 : 1);

export function ChallengePlayPage() {
  const { topicId = 'all' } = useParams();
  const navigate = useNavigate();
  const { addXp, markCard, recordSession } = useProgress.getState();
  const best = useProgress((s) => s.bestChallenge);

  const pool = topicId === 'all' ? words : wordsByTopic(topicId);
  const topicName = topicId === 'all' ? 'Tất cả chủ đề' : (topicById.get(topicId)?.name ?? '');

  const [phase, setPhase] = useState<'count' | 'play' | 'done'>('count');
  const [count, setCount] = useState(3);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [round, setRound] = useState<Round>(() => makeRound(pool));
  const [n, setN] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [right, setRight] = useState(0);
  const [wrongs, setWrongs] = useState<Round[]>([]);
  const [flash, setFlash] = useState<null | { ok: boolean; text: string }>(null);
  const [isRecord, setIsRecord] = useState(false);
  const cardRef = useRef<SwipeCardHandle>(null);
  const scoreRef = useRef(0);

  const start = useCallback(() => {
    setPhase('count');
    setCount(3);
    setTimeLeft(DURATION);
    setRound(makeRound(pool));
    setN(0);
    setScore(0);
    scoreRef.current = 0;
    setCombo(0);
    setRight(0);
    setWrongs([]);
    setIsRecord(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  // 3-2-1 countdown
  useEffect(() => {
    if (phase !== 'count') return undefined;
    if (count === 0) {
      setPhase('play');
      return undefined;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 700);
    return () => clearTimeout(t);
  }, [phase, count]);

  // Game clock
  useEffect(() => {
    if (phase !== 'play') return undefined;
    if (timeLeft <= 0) {
      setPhase('done');
      const final = scoreRef.current;
      setIsRecord(final > best && final > 0);
      recordSession({ kind: 'challenge', topicId, score: final, total: n });
      addXp(Math.round(final / 5));
      celebrate();
      return undefined;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft]);

  const onSwipe = (dir: 'left' | 'right') => {
    const answeredTrue = dir === 'right';
    const ok = answeredTrue === round.isTrue;
    setN((x) => x + 1);
    if (ok) {
      const nextCombo = combo + 1;
      const gained = 10 * multiplierOf(nextCombo);
      setCombo(nextCombo);
      setScore((s) => s + gained);
      scoreRef.current += gained;
      setRight((r) => r + 1);
      markCard(round.word.id, true);
      setFlash({ ok: true, text: `+${gained}` });
    } else {
      setCombo(0);
      setWrongs((w) => [...w, round]);
      markCard(round.word.id, false);
      setFlash({ ok: false, text: `${round.word.rade} = ${round.word.vi[0]}` });
    }
    setTimeout(() => setFlash(null), 900);
    setRound(makeRound(pool));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/challenge');
      if (phase !== 'play') return;
      if (e.key === 'ArrowRight') cardRef.current?.swipe('right');
      if (e.key === 'ArrowLeft') cardRef.current?.swipe('left');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, navigate]);

  if (phase === 'done') {
    const acc = n ? Math.round((right / n) * 100) : 0;
    return (
      <GameShell progress={100} title={`Thử thách · ${topicName}`} backTo="/challenge" right={<ScorePill score={score} />}>
        <ResultCard
          emoji={isRecord ? '🏆' : acc >= 80 ? '🔥' : '💪'}
          title={isRecord ? 'Kỷ lục mới!' : 'Hết giờ!'}
          score={`${score} điểm`}
          lines={[
            { label: 'Số thẻ', value: n },
            { label: 'Chính xác', value: `${acc}%` },
            { label: 'Kỷ lục', value: Math.max(best, score) },
          ]}
          onAgain={start}
          onExit={() => navigate('/challenge')}
        >
          {wrongs.length > 0 && (
            <Box sx={{ textAlign: 'left', p: 2, borderRadius: 2, bgcolor: 'grey.100' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Ôn lại các thẻ sai
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {Array.from(new Map(wrongs.map((r) => [r.word.id, r.word])).values())
                  .slice(0, 8)
                  .map((w) => (
                    <Chip key={w.id} label={`${w.rade} = ${w.vi[0]}`} sx={{ fontFamily: '"Noto Sans"' }} />
                  ))}
              </Stack>
            </Box>
          )}
        </ResultCard>
      </GameShell>
    );
  }

  const mult = multiplierOf(combo);

  return (
    <GameShell
      progress={((DURATION - timeLeft) / DURATION) * 100}
      title={`Thử thách · ${topicName}`}
      backTo="/challenge"
      right={
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{
              px: 1.5,
              height: 40,
              borderRadius: 5,
              typography: 'subtitle1',
              color: timeLeft <= 10 ? 'error.main' : 'text.primary',
              bgcolor: (t) => alpha(timeLeft <= 10 ? t.palette.error.main : t.palette.grey[500], 0.12),
            }}
          >
            <Iconify icon="solar:stopwatch-bold-duotone" width={22} />
            <span>{timeLeft}s</span>
          </Stack>
          <ScorePill score={score} combo={combo} />
        </Stack>
      }
    >
      {phase === 'count' ? (
        <AnimatePresence mode="wait">
          <motion.div key={count} initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
            <Typography variant="h1" sx={{ fontSize: { xs: 96, sm: 160 }, color: 'primary.main' }}>
              {count || 'Bắt đầu!'}
            </Typography>
          </motion.div>
        </AnimatePresence>
      ) : (
        <>
          <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
            Nghĩa này <b>đúng</b> hay <b>sai</b>?{' '}
            {mult > 1 && (
              <Box component="span" sx={{ color: 'error.main', fontWeight: 800 }}>
                Điểm x{mult}!
              </Box>
            )}
          </Typography>

          <Box sx={{ position: 'relative', height: 360, display: 'grid', placeItems: 'center' }}>
            <AnimatePresence>
              {flash && (
                <motion.div
                  key={flash.text + n}
                  initial={{ y: 0, opacity: 0, scale: 0.8 }}
                  animate={{ y: -60, opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ position: 'absolute', top: -20, zIndex: 5, left: '50%', x: '-50%' }}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 0.75,
                      borderRadius: 1.5,
                      typography: 'h6',
                      whiteSpace: 'nowrap',
                      fontFamily: '"Noto Sans"',
                      color: 'common.white',
                      bgcolor: flash.ok ? 'success.main' : 'error.main',
                      boxShadow: (t) => (flash.ok ? t.customShadows.success : t.customShadows.error),
                    }}
                  >
                    {flash.ok ? flash.text : `Sai rồi: ${flash.text}`}
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
            <Box key={n} sx={{ position: 'absolute' }}>
              <SwipeCard ref={cardRef} onSwipe={onSwipe} leftLabel="Sai" rightLabel="Đúng">
                <Stack sx={{ height: 1, p: 4 }} alignItems="center" justifyContent="center" spacing={2}>
                  <RadeText sx={{ fontSize: { xs: 44, sm: 60 }, lineHeight: 1.2 }}>{round.word.rade}</RadeText>
                  <Iconify icon="solar:transfer-horizontal-bold-duotone" width={32} sx={{ color: 'text.disabled', transform: 'rotate(90deg)' }} />
                  <Typography variant="h3" sx={{ textAlign: 'center' }}>
                    {round.shown}
                  </Typography>
                </Stack>
              </SwipeCard>
            </Box>
          </Box>

          <Stack direction="row" spacing={2} sx={{ mt: 4, width: { xs: 1, sm: 'auto' } }}>
            <Button
              size="large"
              onClick={() => cardRef.current?.swipe('left')}
              startIcon={<Iconify icon="solar:close-circle-bold" />}
              sx={{ flex: { xs: 1, sm: 'none' }, minWidth: { sm: 160 }, color: 'error.dark', bgcolor: (t) => alpha(t.palette.error.main, 0.12), '&:hover': { bgcolor: (t) => alpha(t.palette.error.main, 0.24) } }}
            >
              Sai <KeyHint>←</KeyHint>
            </Button>
            <Button
              size="large"
              onClick={() => cardRef.current?.swipe('right')}
              endIcon={<Iconify icon="solar:check-circle-bold" />}
              sx={{ flex: { xs: 1, sm: 'none' }, minWidth: { sm: 160 }, color: 'success.dark', bgcolor: (t) => alpha(t.palette.success.main, 0.12), '&:hover': { bgcolor: (t) => alpha(t.palette.success.main, 0.24) } }}
            >
              <KeyHint>→</KeyHint> Đúng
            </Button>
          </Stack>
        </>
      )}
    </GameShell>
  );
}
