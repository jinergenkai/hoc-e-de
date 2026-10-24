import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { alpha } from '@mui/material/styles';

import type { Lang, WordResult, SentenceResult } from 'src/utils/grader';
import { gradeWord, gradeSentence } from 'src/utils/grader';
import { words, sentences, topicById, wordsByTopic, sentencesByTopic } from 'src/data/vocab';
import { useProgress } from 'src/store/progress';
import { isEnabled, releaseOf } from 'src/config/release';

import { Iconify } from 'src/components/iconify';
import { RadeInput } from 'src/components/rade-input';
import { TopicGrid } from 'src/components/topic-grid';
import { GameShell, ScorePill, ResultCard } from 'src/components/game-shell';
import { KeyHint, RadeText, PageTitle, AudioButton, celebrate, shuffle } from 'src/components/common';

type Dir = 'rade-vi' | 'vi-rade';
type Kind = 'word' | 'sentence';

const ROUND = 10;

export function PracticeSetupPage() {
  const navigate = useNavigate();
  const [dir, setDir] = useState<Dir>('rade-vi');
  const [kind, setKind] = useState<Kind>('word');

  const options: { value: Dir; title: string; desc: string; icon: string }[] = [
    { value: 'rade-vi', title: 'Ê-đê → Việt', desc: 'Đọc tiếng Ê-đê, gõ nghĩa tiếng Việt', icon: 'solar:book-bookmark-bold-duotone' },
    { value: 'vi-rade', title: 'Việt → Ê-đê', desc: 'Gõ tiếng Ê-đê, có bàn phím chữ đặc biệt', icon: 'solar:keyboard-bold-duotone' },
  ];

  return (
    <>
      <PageTitle title="Luyện dịch" subtitle="Gõ bản dịch, máy chấm ngay: Đúng 10đ · Gần đúng 5đ · Sai 0đ." />

      <Typography variant="overline" sx={{ color: 'text.secondary' }}>
        1. Chiều dịch
      </Typography>
      <Grid container spacing={2.5} sx={{ mt: 0.5, mb: 4 }}>
        {options.map((o) => (
          <Grid key={o.value} size={{ xs: 12, sm: 6 }}>
            <Choice active={dir === o.value} onClick={() => setDir(o.value)} icon={o.icon} title={o.title} desc={o.desc} />
          </Grid>
        ))}
      </Grid>

      <Typography variant="overline" sx={{ color: 'text.secondary' }}>
        2. Dạng bài
      </Typography>
      <Grid container spacing={2.5} sx={{ mt: 0.5, mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Choice active={kind === 'word'} onClick={() => setKind('word')} icon="solar:text-bold-duotone" title="Dịch từ" desc={`${ROUND} từ, chấm đúng / gần đúng / sai`} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          {isEnabled('practiceSentence') ? (
            <Choice
              active={kind === 'sentence'}
              onClick={() => setKind('sentence')}
              icon="solar:pen-new-square-bold-duotone"
              title="Dịch câu"
              desc="Chấm theo %, tô màu từng từ đúng / sai / thiếu"
            />
          ) : (
            <Choice
              active={false}
              locked
              onClick={() => undefined}
              icon="solar:lock-keyhole-bold-duotone"
              title="Dịch câu"
              desc={`Sắp ra mắt · Đợt ${releaseOf('practiceSentence')?.n}`}
            />
          )}
        </Grid>
      </Grid>

      <Typography variant="overline" sx={{ color: 'text.secondary' }}>
        3. Chọn chủ đề để bắt đầu
      </Typography>
      <Box sx={{ mt: 1 }}>
        <TopicGrid includeAll onPick={(id) => navigate(`/practice/${id}?dir=${dir}&kind=${kind}`)} />
      </Box>
    </>
  );
}

function Choice({ active, locked, onClick, icon, title, desc }: { active: boolean; locked?: boolean; onClick: () => void; icon: string; title: string; desc: string }) {
  return (
    <Card
      sx={{
        opacity: locked ? 0.6 : 1,
        outline: (t) => (active ? `2px solid ${t.palette.primary.main}` : 'none'),
        bgcolor: (t) => (active ? alpha(t.palette.primary.main, 0.04) : 'background.paper'),
      }}
    >
      <CardActionArea disabled={locked} onClick={onClick} sx={{ p: 3, display: 'flex', justifyContent: 'flex-start', gap: 2 }}>
        <Iconify icon={icon} width={40} sx={{ color: active ? 'primary.main' : 'text.disabled' }} />
        <Box>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {desc}
          </Typography>
        </Box>
        {active && <Iconify icon="solar:check-circle-bold" width={24} sx={{ ml: 'auto', color: 'primary.main' }} />}
      </CardActionArea>
    </Card>
  );
}

// ----------------------------------------------------------------------

type Question = { id: string; prompt: string; promptLang: Lang; accepted: string[]; answerLang: Lang; audioId: string };
type Answered = { q: Question; input: string; result: WordResult | SentenceResult; hinted: boolean };

function buildQuestions(topicId: string, dir: Dir, kind: Kind): Question[] {
  if (kind === 'word') {
    const pool = (topicId === 'all' ? words : wordsByTopic(topicId)).filter((w) => !w.vi[0].startsWith('('));
    return shuffle(pool)
      .slice(0, ROUND)
      .map((w) =>
        dir === 'rade-vi'
          ? { id: w.id, prompt: w.rade, promptLang: 'rade', accepted: w.vi, answerLang: 'vi', audioId: w.id }
          : { id: w.id, prompt: w.vi.join(' / '), promptLang: 'vi', accepted: [w.rade], answerLang: 'rade', audioId: w.id }
      );
  }
  let pool = topicId === 'all' ? sentences : sentencesByTopic(topicId);
  if (pool.length < 3) pool = sentences;
  return shuffle(pool)
    .slice(0, ROUND)
    .map((s) =>
      dir === 'rade-vi'
        ? { id: s.id, prompt: s.rade, promptLang: 'rade', accepted: s.acceptVi, answerLang: 'vi', audioId: s.id }
        : { id: s.id, prompt: s.vi, promptLang: 'vi', accepted: s.acceptRade, answerLang: 'rade', audioId: s.id }
    );
}

export function PracticePlayPage() {
  const { topicId = 'all' } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dir = (params.get('dir') as Dir) || 'rade-vi';
  const kind: Kind = params.get('kind') === 'sentence' && isEnabled('practiceSentence') ? 'sentence' : 'word';
  const { addXp, markCard, recordSession } = useProgress.getState();

  const [seed, setSeed] = useState(0);
  const questions = useMemo(() => buildQuestions(topicId, dir, kind), [topicId, dir, kind, seed]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [hinted, setHinted] = useState(false);
  const [current, setCurrent] = useState<Answered | null>(null);
  const [answers, setAnswers] = useState<Answered[]>([]);
  const [done, setDone] = useState(false);

  const q = questions[idx];
  const score = answers.reduce((s, a) => s + Math.max(0, a.result.points - (a.hinted ? 3 : 0)), 0);
  const maxScore = questions.length * 10;
  const topicName = topicId === 'all' ? 'Tất cả chủ đề' : (topicById.get(topicId)?.name ?? '');

  const check = () => {
    if (!q || current) return;
    const result = kind === 'word' ? gradeWord(input, q.accepted, q.answerLang) : gradeSentence(input, q.accepted, q.answerLang);
    const a = { q, input, result, hinted };
    setCurrent(a);
    setAnswers((list) => [...list, a]);
    if (kind === 'word') markCard(q.id, result.verdict === 'correct');
    addXp(Math.max(0, result.points - (hinted ? 3 : 0)));
  };

  const next = () => {
    if (idx + 1 >= questions.length) {
      setDone(true);
      const final = answers.reduce((s, a) => s + Math.max(0, a.result.points - (a.hinted ? 3 : 0)), 0);
      recordSession({ kind: 'practice', topicId, score: final, total: maxScore });
      if (final >= maxScore * 0.7) celebrate();
      return;
    }
    setIdx((i) => i + 1);
    setInput('');
    setHinted(false);
    setCurrent(null);
  };

  const restart = () => {
    setSeed((s) => s + 1);
    setIdx(0);
    setInput('');
    setHinted(false);
    setCurrent(null);
    setAnswers([]);
    setDone(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/practice');
      if (e.key === 'Enter' && !done) {
        e.preventDefault();
        if (current) next();
        else check();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!q && !done) {
    return (
      <GameShell progress={0} title="Luyện dịch" backTo="/practice">
        <Typography>Chủ đề này chưa có dữ liệu.</Typography>
      </GameShell>
    );
  }

  if (done) {
    const pct = Math.round((score / maxScore) * 100);
    return (
      <GameShell progress={100} title={`Luyện dịch · ${topicName}`} backTo="/practice" right={<ScorePill score={score} />}>
        <ResultCard
          emoji={pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : '📚'}
          title={pct >= 90 ? 'Tuyệt vời!' : pct >= 70 ? 'Làm tốt lắm!' : 'Cố gắng thêm nhé!'}
          score={`${score}/${maxScore}`}
          lines={[
            { label: 'Đúng', value: answers.filter((a) => a.result.verdict === 'correct').length },
            { label: 'Gần đúng', value: answers.filter((a) => a.result.verdict === 'close').length },
            { label: 'Sai', value: answers.filter((a) => a.result.verdict === 'wrong').length },
          ]}
          onAgain={restart}
          onExit={() => navigate('/practice')}
        >
          <Stack spacing={1} sx={{ textAlign: 'left', maxHeight: 240, overflow: 'auto', p: 1.5, borderRadius: 2, bgcolor: 'grey.100' }}>
            {answers
              .filter((a) => a.result.verdict !== 'correct')
              .map((a) => (
                <Box key={a.q.id}>
                  <Typography variant="body2" sx={{ fontFamily: '"Noto Sans"' }}>
                    <b>{a.q.prompt}</b> → {a.result.best}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Bạn gõ: {a.input || '(bỏ trống)'}
                  </Typography>
                </Box>
              ))}
            {answers.every((a) => a.result.verdict === 'correct') && <Typography variant="body2">Không sai câu nào 👏</Typography>}
          </Stack>
        </ResultCard>
      </GameShell>
    );
  }

  const hint = () => {
    setHinted(true);
    const target = q.accepted[0];
    const firstWord = target.split(/\s+/)[0];
    if (!input.trim()) setInput(kind === 'word' ? target.slice(0, 1) : `${firstWord} `);
  };

  return (
    <GameShell
      progress={(idx / questions.length) * 100}
      title={`Luyện dịch · ${topicName} · câu ${idx + 1}/${questions.length}`}
      backTo="/practice"
      right={<ScorePill score={score} />}
    >
      <Card sx={{ width: 760, maxWidth: 1, p: { xs: 2.5, sm: 5 } }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Chip size="small" label={dir === 'rade-vi' ? 'Dịch sang tiếng Việt' : 'Dịch sang tiếng Ê-đê'} color="primary" variant="outlined" />
          <Chip size="small" label={kind === 'word' ? 'Từ' : 'Câu'} />
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2} sx={{ my: 3 }}>
          {q.promptLang === 'rade' ? (
            <RadeText sx={{ fontSize: kind === 'word' ? { xs: 36, sm: 48 } : { xs: 24, sm: 30 }, lineHeight: 1.3 }}>{q.prompt}</RadeText>
          ) : (
            <Typography variant={kind === 'word' ? 'h2' : 'h4'}>{q.prompt}</Typography>
          )}
          {q.promptLang === 'rade' && <AudioButton id={q.audioId} />}
        </Stack>

        <RadeInput
          value={input}
          onChange={setInput}
          showKeys={q.answerLang === 'rade'}
          placeholder={q.answerLang === 'rade' ? 'Gõ tiếng Ê-đê…' : 'Gõ nghĩa tiếng Việt…'}
          autoFocus
          disabled={Boolean(current)}
          multiline={kind === 'sentence'}
        />

        <AnimatePresence>{current && <Feedback key={current.q.id} a={current} kind={kind} />}</AnimatePresence>

        <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 3 }}>
          {!current && (
            <Button color="inherit" onClick={hint} disabled={hinted} startIcon={<Iconify icon="solar:lightbulb-bolt-bold-duotone" />}>
              Gợi ý (−3đ)
            </Button>
          )}
          {current ? (
            <Button size="large" variant="contained" onClick={next} endIcon={<Iconify icon="solar:arrow-right-linear" />}>
              {idx + 1 >= questions.length ? 'Xem kết quả' : 'Câu tiếp'} <KeyHint>Enter</KeyHint>
            </Button>
          ) : (
            <Button size="large" variant="contained" onClick={check} disabled={!input.trim()}>
              Kiểm tra <KeyHint>Enter</KeyHint>
            </Button>
          )}
        </Stack>
      </Card>
    </GameShell>
  );
}

// ----------------------------------------------------------------------

const VERDICT = {
  correct: { label: 'Chính xác!', color: 'success', icon: 'solar:check-circle-bold' },
  close: { label: 'Gần đúng', color: 'warning', icon: 'solar:danger-triangle-bold-duotone' },
  wrong: { label: 'Chưa đúng', color: 'error', icon: 'solar:close-circle-bold' },
} as const;

function Feedback({ a, kind }: { a: Answered; kind: Kind }) {
  const v = VERDICT[a.result.verdict];
  const pts = Math.max(0, a.result.points - (a.hinted ? 3 : 0));
  const sentence = kind === 'sentence' ? (a.result as SentenceResult) : null;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <Box sx={{ mt: 3, p: 2.5, borderRadius: 2, bgcolor: (t) => alpha(t.palette[v.color].main, 0.1), border: (t) => `1px solid ${alpha(t.palette[v.color].main, 0.32)}` }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ color: `${v.color}.dark`, mb: 1 }}>
          <Iconify icon={v.icon} width={26} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {v.label}
            {sentence && ` · ${sentence.percent}%`}
          </Typography>
          <Typography variant="h6">+{pts}đ</Typography>
        </Stack>

        {sentence && sentence.marks.length > 0 && (
          <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mb: 1.5 }}>
            {sentence.marks.map((m, i) => (
              <Box
                key={`${m.text}-${i}`}
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: 0.75,
                  fontFamily: '"Noto Sans"',
                  fontWeight: 600,
                  color: m.mark === 'ok' ? 'success.darker' : m.mark === 'close' ? 'warning.darker' : 'error.dark',
                  bgcolor: (t) => alpha(t.palette[m.mark === 'ok' ? 'success' : m.mark === 'close' ? 'warning' : 'error'].main, 0.2),
                  textDecoration: m.mark === 'wrong' ? 'line-through' : 'none',
                }}
              >
                {m.text}
              </Box>
            ))}
            {sentence.missing.map((m, i) => (
              <Box key={`miss-${m}-${i}`} sx={{ px: 1, py: 0.25, borderRadius: 0.75, fontFamily: '"Noto Sans"', color: 'text.secondary', border: '1px dashed', borderColor: 'grey.400' }}>
                + {m}
              </Box>
            ))}
          </Stack>
        )}

        {a.result.verdict !== 'correct' && (
          <Typography variant="body1">
            Đáp án: <RadeText component="span" sx={{ fontSize: 'inherit' }}>{a.result.best}</RadeText>
          </Typography>
        )}
        {a.q.accepted.length > 1 && a.result.verdict === 'correct' && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Cũng đúng: {a.q.accepted.filter((x) => x !== a.result.best).slice(0, 3).join(' · ')}
          </Typography>
        )}
        {a.result.issues.map((issue) => (
          <Typography key={issue} variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
            • {issue}
          </Typography>
        ))}
      </Box>
    </motion.div>
  );
}
