import { useNavigate, useParams } from 'react-router-dom';
import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import type { Word } from 'src/data/vocab';
import { loose } from 'src/utils/text';
import { words, sentences, topicById, wordsByTopic } from 'src/data/vocab';
import { useProgress } from 'src/store/progress';

import { Iconify } from 'src/components/iconify';
import { isEnabled } from 'src/config/release';
import { TopicGrid } from 'src/components/topic-grid';
import { SpeakPractice } from 'src/components/recorder-ui';
import { BROCADE, brocadeBackdrop } from 'src/components/ornaments';
import { SwipeCard, type SwipeCardHandle } from 'src/components/swipe-card';
import { GameShell, ScorePill, ResultCard } from 'src/components/game-shell';
import { KeyHint, RadeText, PageTitle, AudioButton, celebrate, shuffle } from 'src/components/common';

const DECK_SIZE = 15;

export function LearnPickPage() {
  const navigate = useNavigate();
  return (
    <>
      <PageTitle
        title="Học thẻ"
        subtitle="Thuộc thì quẹt phải, chưa thuộc thì quẹt trái: thẻ sẽ quay lại cho tới khi bạn nhớ."
      />
      <TopicGrid includeAll onPick={(id) => navigate(`/learn/${id}`)} />
    </>
  );
}

// ----------------------------------------------------------------------

type Mode = 'rade' | 'vi'; // which side is shown first

export function exampleFor(word: Word) {
  const key = loose(word.rade);
  return sentences.find((s) => ` ${loose(s.rade)} `.includes(` ${key} `));
}

export function LearnDeckPage() {
  const { topicId = 'all' } = useParams();
  const navigate = useNavigate();
  const { addXp, markCard, recordSession } = useProgress.getState();
  const cardsStat = useProgress((s) => s.cards);

  const pool = topicId === 'all' ? words : wordsByTopic(topicId);
  const topicName = topicId === 'all' ? 'Tất cả chủ đề' : (topicById.get(topicId)?.name ?? '');

  const build = useCallback(() => {
    // Unknown and hard words first, then the rest
    const ranked = shuffle(pool).sort((a, b) => Number(cardsStat[a.id]?.known ?? 0) - Number(cardsStat[b.id]?.known ?? 0));
    return ranked.slice(0, DECK_SIZE).map((w) => w.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  const [mode, setMode] = useState<Mode>('rade');
  const [queue, setQueue] = useState<string[]>(build);
  const [total, setTotal] = useState(queue.length);
  const [misses, setMisses] = useState<Record<string, number>>({});
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [done, setDone] = useState(false);
  const cardRef = useRef<SwipeCardHandle>(null);

  const current = queue[0] ? words.find((w) => w.id === queue[0]) : undefined;

  const restart = () => {
    const q = build();
    setQueue(q);
    setTotal(q.length);
    setMisses({});
    setScore(0);
    setCombo(0);
    setFlipped(false);
    setDone(false);
  };

  const onSwipe = (dir: 'left' | 'right') => {
    if (!current) return;
    const id = current.id;
    setFlipped(false);
    if (dir === 'right') {
      const firstTry = !misses[id];
      const nextCombo = firstTry ? combo + 1 : 0;
      const gained = (firstTry ? 10 : 5) + (nextCombo >= 3 ? 5 : 0);
      setCombo(nextCombo);
      setScore((s) => s + gained);
      addXp(gained);
      markCard(id, true);
      const rest = queue.slice(1);
      setQueue(rest);
      if (rest.length === 0) finish(score + gained);
    } else {
      setCombo(0);
      setMisses((m) => ({ ...m, [id]: (m[id] ?? 0) + 1 }));
      markCard(id, false);
      // Comes back after 3–5 cards (or at the end of a short queue)
      const rest = queue.slice(1);
      const at = Math.min(rest.length, 3 + Math.floor(Math.random() * 3));
      setQueue([...rest.slice(0, at), id, ...rest.slice(at)]);
    }
  };

  const finish = (finalScore: number) => {
    setDone(true);
    recordSession({ kind: 'learn', topicId, score: finalScore, total });
    celebrate();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done) return;
      if (e.key === 'ArrowRight') cardRef.current?.swipe('right');
      else if (e.key === 'ArrowLeft') cardRef.current?.swipe('left');
      else if (e.key === ' ') {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === 'Escape') navigate('/learn');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [done, navigate]);

  const learned = total - queue.length;

  if (done) {
    const missed = Object.entries(misses).sort((a, b) => b[1] - a[1]);
    const firstTry = total - missed.length;
    return (
      <GameShell progress={100} title={`Học thẻ · ${topicName}`} backTo="/learn" right={<ScorePill score={score} />}>
        <ResultCard
          emoji={firstTry === total ? '🏆' : '🎉'}
          title={firstTry === total ? 'Xuất sắc! Thuộc hết ngay lần đầu' : 'Hoàn thành bộ thẻ!'}
          score={`${score} điểm`}
          lines={[
            { label: 'Số thẻ', value: total },
            { label: 'Thuộc ngay', value: firstTry },
            { label: 'Phải học lại', value: missed.length },
          ]}
          onAgain={restart}
          onExit={() => navigate('/learn')}
        >
          {missed.length > 0 && (
            <Box sx={{ textAlign: 'left', p: 2, borderRadius: 2, bgcolor: 'grey.100' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Từ khó nhất
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {missed.slice(0, 6).map(([id, n]) => {
                  const w = words.find((x) => x.id === id)!;
                  return <Chip key={id} label={`${w.rade} · ${w.vi[0]} (${n}×)`} sx={{ fontFamily: '"Noto Sans"' }} />;
                })}
              </Stack>
            </Box>
          )}
        </ResultCard>
      </GameShell>
    );
  }

  return (
    <GameShell
      progress={(learned / Math.max(total, 1)) * 100}
      title={`Học thẻ · ${topicName} · còn ${queue.length} thẻ`}
      backTo="/learn"
      right={<ScorePill score={score} combo={combo} />}
    >
      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        <Chip
          clickable
          color={mode === 'rade' ? 'primary' : 'default'}
          variant={mode === 'rade' ? 'filled' : 'outlined'}
          label="Ê-đê → Việt"
          onClick={() => setMode('rade')}
        />
        <Chip
          clickable
          color={mode === 'vi' ? 'primary' : 'default'}
          variant={mode === 'vi' ? 'filled' : 'outlined'}
          label="Việt → Ê-đê"
          onClick={() => setMode('vi')}
        />
      </Stack>

      <Box sx={{ position: 'relative', height: 360, display: 'grid', placeItems: 'center' }}>
        {/* stacked cards behind for depth */}
        {queue.length > 1 && <Ghost offset={2} />}
        {queue.length > 2 && <Ghost offset={1} />}
        {current && (
          <Box key={`${current.id}-${queue.length}-${misses[current.id] ?? 0}`} sx={{ position: 'absolute' }}>
            <SwipeCard ref={cardRef} onSwipe={onSwipe} onTap={() => setFlipped((f) => !f)} leftLabel="Chưa thuộc" rightLabel="Thuộc rồi">
              <Face word={current} mode={mode} flipped={flipped} misses={misses[current.id] ?? 0} />
            </SwipeCard>
          </Box>
        )}
      </Box>

      {/* Buttons keep one line each and share the width on phones */}
      <Stack direction="row" spacing={{ xs: 1, sm: 2 }} sx={{ mt: 4, '& .MuiButton-root': { whiteSpace: 'nowrap', px: { xs: 1.5, sm: 2.75 } } }}>
        <Button
          size="large"
          variant="text"
          color="warning"
          onClick={() => cardRef.current?.swipe('left')}
          startIcon={<Iconify icon="solar:arrow-left-linear" />}
          sx={softBtn('warning')}
        >
          Chưa thuộc <KeyHint>←</KeyHint>
        </Button>
        <Button size="large" variant="outlined" color="inherit" onClick={() => setFlipped((f) => !f)} startIcon={<Iconify icon="solar:eye-bold-duotone" />}>
          Lật thẻ <KeyHint>Space</KeyHint>
        </Button>
        <Button
          size="large"
          variant="text"
          color="success"
          onClick={() => cardRef.current?.swipe('right')}
          endIcon={<Iconify icon="solar:arrow-right-linear" />}
          sx={softBtn('success')}
        >
          <KeyHint>→</KeyHint> Thuộc rồi
        </Button>
      </Stack>
    </GameShell>
  );
}

const softBtn = (c: 'warning' | 'success') => ({
  color: `${c}.dark`,
  bgcolor: (t: any) => alpha(t.palette[c].main, 0.16),
  '&:hover': { bgcolor: (t: any) => alpha(t.palette[c].main, 0.32) },
});

function Ghost({ offset }: { offset: number }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        width: 480,
        maxWidth: '86vw',
        height: 340,
        borderRadius: 3,
        bgcolor: BROCADE.black,
        ...brocadeBackdrop(BROCADE.gold, 0.16, 40),
        boxShadow: (t) => t.customShadows.z8,
        transform: `translateY(${offset * 12}px) scale(${1 - offset * 0.04})`,
        opacity: 1 - offset * 0.25,
      }}
    />
  );
}

function Face({ word, mode, flipped, misses }: { word: Word; mode: Mode; flipped: boolean; misses: number }) {
  const showRade = mode === 'rade' ? !flipped : flipped;
  const example = exampleFor(word);
  const topic = topicById.get(word.topicId);

  return (
    <motion.div
      key={String(flipped)}
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ duration: 0.22 }}
      style={{ height: '100%' }}
    >
      <Stack sx={{ height: 1, p: 4 }} alignItems="center" justifyContent="center" spacing={1.5}>
        <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 20, left: 24 }}>
          {topic && <Chip size="small" label={topic.name} />}
          {misses > 0 && <Chip size="small" color="warning" label={`Lần ${misses + 1}`} />}
        </Stack>
        <Box sx={{ position: 'absolute', top: 12, right: 16 }}>
          <AudioButton id={word.id} />
        </Box>

        {showRade ? (
          <RadeText sx={{ fontSize: { xs: 48, sm: 64 }, lineHeight: 1.2, textAlign: 'center' }}>{word.rade}</RadeText>
        ) : (
          <Typography variant="h2" sx={{ textAlign: 'center' }}>
            {word.vi.join(', ')}
          </Typography>
        )}

        {flipped ? (
          <>
            {mode === 'rade' ? (
              <RadeText sx={{ fontSize: 22, color: 'text.secondary' }}>{word.rade}</RadeText>
            ) : (
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                {word.vi.join(', ')}
              </Typography>
            )}
            {word.pos && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {word.pos}
              </Typography>
            )}
            {word.note && (
              <Typography variant="body2" sx={{ px: 1.5, py: 0.75, borderRadius: 1, bgcolor: 'secondary.lighter', color: 'secondary.darker' }}>
                {word.note}
              </Typography>
            )}
            {isEnabled('speak') && (
              <Box sx={{ mt: 0.5 }}>
                <SpeakPractice audioId={word.id} compact />
              </Box>
            )}
            {example && (
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <RadeText sx={{ fontSize: 18, fontWeight: 600 }}>{example.rade}</RadeText>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {example.vi}
                </Typography>
              </Box>
            )}
          </>
        ) : (
          <Typography variant="caption" sx={{ color: 'text.disabled', position: 'absolute', bottom: 20 }}>
            Bấm vào thẻ
            <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
              {' '}
              hoặc nhấn Space
            </Box>{' '}
            để lật
          </Typography>
        )}
      </Stack>
    </motion.div>
  );
}
