import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { alpha } from '@mui/material/styles';

import audioManifest from 'src/data/audio-manifest.json';
import { alphabet } from 'src/data/alphabet';
import { words, sentences } from 'src/data/vocab';
import { useRecordings } from 'src/store/recordings';
import { playBlob, useRecorder } from 'src/hooks/use-recorder';
import { unlockAdmin, isAdminUnlocked } from 'src/config/admin';

import { Iconify } from 'src/components/iconify';
import { BrocadeBand } from 'src/components/ornaments';
import { MicButton, micErrorText } from 'src/components/recorder-ui';
import { KeyHint, RadeText, PageTitle, playAudio } from 'src/components/common';

type Kind = 'word' | 'sentence' | 'letter';
type Item = { id: string; rade: string; vi: string };

const ITEMS: Record<Kind, Item[]> = {
  word: words.map((w) => ({ id: w.id, rade: w.rade, vi: w.vi.join(', ') })),
  sentence: sentences.map((s) => ({ id: s.id, rade: s.rade, vi: s.vi })),
  letter: alphabet.map((l) => ({ id: `l-${l.lower}`, rade: `${l.upper} ${l.lower}`, vi: l.note })),
};

const TAB_LABEL: Record<Kind, string> = { word: 'Từ vựng', sentence: 'Câu', letter: 'Chữ cái' };
const bundled = audioManifest as Record<string, string>;

export function RecordingStudioPage() {
  const [unlocked, setUnlocked] = useState(isAdminUnlocked);
  if (!unlocked) return <PinGate onUnlock={() => setUnlocked(true)} />;
  return <Studio />;
}

// ----------------------------------------------------------------------

function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const submit = () => (unlockAdmin(pin) ? onUnlock() : setError(true));
  return (
    <Stack alignItems="center" sx={{ pt: 8 }}>
      <Card sx={{ width: 380, overflow: 'hidden' }}>
        <BrocadeBand motif="sawtooth" height={12} />
        <Stack spacing={2} alignItems="center" sx={{ p: 4 }}>
          <Iconify icon="solar:lock-keyhole-bold-duotone" width={48} sx={{ color: 'primary.main' }} />
          <Typography variant="h6">Khu vực người soạn nội dung</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
            Nhập mã PIN để ghi âm từ vựng, câu và chữ cái.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            type="password"
            label="Mã PIN"
            value={pin}
            error={error}
            helperText={error ? 'Mã PIN không đúng' : ' '}
            onChange={(e) => {
              setPin(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 8, style: { letterSpacing: 8, textAlign: 'center', fontSize: 22 } } }}
          />
          <Button fullWidth size="large" variant="contained" onClick={submit}>
            Mở khoá
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function Studio() {
  const ids = useRecordings((s) => s.ids);
  const { remove, exportZip, importZip } = useRecordings.getState();
  const [kind, setKind] = useState<Kind>('word');
  const [onlyMissing, setOnlyMissing] = useState(false);
  const [session, setSession] = useState<{ list: Item[]; index: number } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const status = (id: string) => (ids.has(id) ? 'recorded' : bundled[id] ? 'bundled' : 'none');
  const items = ITEMS[kind];
  const shown = onlyMissing ? items.filter((i) => status(i.id) === 'none') : items;
  const done = items.filter((i) => status(i.id) !== 'none').length;

  const exportAll = async () => {
    const blob = await exportZip();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ghi-am-hriam-ede-${new Date().toISOString().slice(0, 10)}.zip`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };

  const importFile = async (file: File) => {
    try {
      const n = await importZip(file);
      setNotice(`Đã nhập ${n} file ghi âm.`);
    } catch {
      setNotice('Không đọc được file. Hãy chọn file .zip được xuất từ ứng dụng này.');
    }
  };

  const startSession = (fromId?: string) => {
    const list = fromId ? items : items.filter((i) => status(i.id) === 'none');
    const index = fromId ? Math.max(0, list.findIndex((i) => i.id === fromId)) : 0;
    if (list.length) setSession({ list, index });
    else setNotice('Mục này đã ghi âm đủ.');
  };

  return (
    <>
      <PageTitle
        title="Ghi âm nội dung"
        subtitle="Người bản ngữ ghi âm từng từ, câu và chữ cái. Ghi âm lưu ngay trên máy và dùng cho nút nghe trong toàn bộ ứng dụng."
        action={
          <Stack direction="row" spacing={1}>
            <Button color="inherit" variant="outlined" onClick={() => fileRef.current?.click()} startIcon={<Iconify icon="solar:upload-bold-duotone" />}>
              Nhập gói
            </Button>
            <Button color="inherit" variant="outlined" onClick={exportAll} disabled={ids.size === 0} startIcon={<Iconify icon="solar:download-bold-duotone" />}>
              Xuất gói ({ids.size})
            </Button>
            <input
              ref={fileRef}
              hidden
              type="file"
              accept=".zip"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) importFile(f);
                e.target.value = '';
              }}
            />
          </Stack>
        }
      />

      {notice && (
        <Alert severity="info" onClose={() => setNotice(null)} sx={{ mb: 3 }}>
          {notice}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <Tabs value={kind} onChange={(_, v) => setKind(v)} sx={{ px: 3, borderBottom: (t) => `1px solid ${t.palette.divider}` }}>
          {(Object.keys(ITEMS) as Kind[]).map((k) => {
            const n = ITEMS[k].filter((i) => status(i.id) !== 'none').length;
            return <Tab key={k} value={k} label={`${TAB_LABEL[k]} · ${n}/${ITEMS[k].length}`} />;
          })}
        </Tabs>
        <Stack direction="row" alignItems="center" spacing={3} sx={{ p: 3 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="subtitle2">Đã có ghi âm</Typography>
              <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                {done}/{items.length}
              </Typography>
            </Stack>
            <LinearProgress variant="determinate" value={(done / items.length) * 100} />
          </Box>
          <Chip
            clickable
            label="Chỉ hiện mục chưa có"
            color={onlyMissing ? 'primary' : 'default'}
            variant={onlyMissing ? 'filled' : 'outlined'}
            onClick={() => setOnlyMissing((v) => !v)}
          />
          <Button size="large" variant="contained" onClick={() => startSession()} startIcon={<Iconify icon="solar:microphone-3-bold-duotone" />}>
            Ghi liên tục
          </Button>
        </Stack>
      </Card>

      <Card>
        {shown.map((item, i) => {
          const st = status(item.id);
          return (
            <Box key={item.id}>
              {i > 0 && <Divider sx={{ borderStyle: 'dashed' }} />}
              <Stack direction="row" alignItems="center" spacing={2} sx={{ px: 3, py: 1.5 }}>
                <Typography variant="caption" sx={{ color: 'text.disabled', width: 56 }}>
                  {item.id}
                </Typography>
                <RadeText sx={{ fontSize: 20, minWidth: 180 }}>{item.rade}</RadeText>
                <Typography variant="body2" noWrap sx={{ flexGrow: 1, color: 'text.secondary' }}>
                  {item.vi}
                </Typography>
                <Chip
                  size="small"
                  color={st === 'recorded' ? 'success' : st === 'bundled' ? 'info' : 'default'}
                  variant={st === 'none' ? 'outlined' : 'filled'}
                  label={st === 'recorded' ? 'Đã ghi' : st === 'bundled' ? 'Có sẵn' : 'Chưa có'}
                />
                <IconButton disabled={st === 'none'} onClick={() => playAudio(item.id)} title="Nghe">
                  <Iconify icon="solar:play-circle-bold-duotone" width={24} />
                </IconButton>
                <IconButton color="primary" onClick={() => startSession(item.id)} title="Ghi âm">
                  <Iconify icon="solar:microphone-3-bold-duotone" width={24} />
                </IconButton>
                <IconButton
                  disabled={st !== 'recorded'}
                  onClick={() => window.confirm(`Xoá ghi âm "${item.rade}"?`) && remove(item.id)}
                  title="Xoá ghi âm"
                >
                  <Iconify icon="solar:trash-bin-trash-bold-duotone" width={22} />
                </IconButton>
              </Stack>
            </Box>
          );
        })}
        {shown.length === 0 && (
          <Typography variant="body2" sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
            Tất cả đã có ghi âm 🎉
          </Typography>
        )}
      </Card>

      <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.disabled' }}>
        Gói ghi âm (.zip) dùng để chép sang máy khác qua USB, hoặc gửi cho nhóm phát triển đóng gói vào bản cài.
      </Typography>

      <Dialog open={Boolean(session)} onClose={() => setSession(null)} maxWidth="md" fullWidth>
        {session && <StudioSession list={session.list} start={session.index} onClose={() => setSession(null)} />}
      </Dialog>
    </>
  );
}

// ----------------------------------------------------------------------

/** One item at a time: Space = record/stop, Enter = save & next, R = record again, ← → = move. */
function StudioSession({ list, start, onClose }: { list: Item[]; start: number; onClose: () => void }) {
  const [index, setIndex] = useState(start);
  const [take, setTake] = useState<Blob | null>(null);
  const [saved, setSaved] = useState(0);
  const rec = useRecorder({ maxMs: 12_000 });
  const save = useRecordings((s) => s.save);
  const hasExisting = useRecordings((s) => s.ids.has(list[index]?.id ?? ''));
  const item = list[index];
  const err = micErrorText(rec.state);

  const go = useCallback(
    (i: number) => {
      if (i >= list.length) {
        onClose();
        return;
      }
      setIndex(Math.max(0, i));
      setTake(null);
    },
    [list.length, onClose]
  );

  const toggle = useCallback(async () => {
    if (rec.recording) {
      rec.stop();
      return;
    }
    setTake(null);
    const blob = await rec.start();
    if (blob) {
      setTake(blob);
      playBlob(blob);
    }
  }, [rec]);

  const commit = useCallback(async () => {
    if (!take || !item) return;
    await save(item.id, take);
    setSaved((n) => n + 1);
    go(index + 1);
  }, [take, item, save, go, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Keys drive the session; a focused button would otherwise fire a second time
      if (e.key === ' ' || e.key === 'Enter') (document.activeElement as HTMLElement | null)?.blur();
      if (e.key === ' ') {
        e.preventDefault();
        toggle();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        commit();
      } else if (e.key.toLowerCase() === 'r' && !rec.recording) {
        toggle();
      } else if (e.key === 'ArrowRight' && !rec.recording) go(index + 1);
      else if (e.key === 'ArrowLeft' && !rec.recording) go(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle, commit, go, index, rec.recording]);

  if (!item) return null;

  return (
    <Box>
      <BrocadeBand motif="diamond" height={16} edges />
      <Stack direction="row" alignItems="center" sx={{ px: 3, pt: 2 }}>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', flexGrow: 1 }}>
          {index + 1}/{list.length} · đã lưu {saved}
        </Typography>
        <IconButton onClick={onClose}>
          <Iconify icon="solar:close-circle-linear" width={26} />
        </IconButton>
      </Stack>
      <LinearProgress variant="determinate" value={((index + 1) / list.length) * 100} sx={{ mx: 3, height: 6 }} />

      <Stack alignItems="center" spacing={1} sx={{ px: 4, pt: 5, pb: 3, textAlign: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <RadeText sx={{ fontSize: item.rade.length > 16 ? 40 : 64, lineHeight: 1.2 }}>{item.rade}</RadeText>
            <Typography variant="h6" sx={{ color: 'text.secondary', mt: 1 }}>
              {item.vi}
            </Typography>
          </motion.div>
        </AnimatePresence>

        <Box sx={{ py: 4 }}>
          <MicButton recording={rec.recording} level={rec.level} size={96} onClick={toggle} disabled={Boolean(err)} />
        </Box>
        <Typography variant="body2" sx={{ color: err ? 'error.main' : rec.recording ? 'error.main' : 'text.secondary', minHeight: 22 }}>
          {err ||
            (rec.recording
              ? `Đang ghi… ${(rec.elapsed / 1000).toFixed(1)}s (bấm lại hoặc Space để dừng)`
              : take
                ? 'Nghe lại bản vừa ghi. Ưng thì Lưu, chưa ưng thì Ghi lại.'
                : hasExisting
                  ? 'Mục này đã có ghi âm. Ghi mới sẽ thay bản cũ.'
                  : 'Bấm micro hoặc Space để bắt đầu ghi.')}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ px: 3, pb: 4 }}>
        <Button color="inherit" disabled={index === 0 || rec.recording} onClick={() => go(index - 1)} startIcon={<Iconify icon="solar:arrow-left-linear" />}>
          Trước
        </Button>
        <Button variant="outlined" color="inherit" disabled={!take || rec.recording} onClick={() => take && playBlob(take)} startIcon={<Iconify icon="solar:play-circle-bold-duotone" />}>
          Nghe lại
        </Button>
        <Button variant="outlined" color="inherit" disabled={rec.recording} onClick={toggle} startIcon={<Iconify icon="solar:refresh-bold" />}>
          Ghi lại <KeyHint>R</KeyHint>
        </Button>
        <Button variant="contained" disabled={!take || rec.recording} onClick={commit} startIcon={<Iconify icon="solar:check-circle-bold" />}>
          Lưu & tiếp <KeyHint>Enter</KeyHint>
        </Button>
        <Button color="inherit" disabled={rec.recording} onClick={() => go(index + 1)} endIcon={<Iconify icon="solar:arrow-right-linear" />}>
          Bỏ qua
        </Button>
      </Stack>
      <Box sx={{ px: 3, pb: 2, textAlign: 'center', bgcolor: (t) => alpha(t.palette.grey[500], 0.06), py: 1.5 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Mẹo: đặt micro cách miệng một gang tay, đọc rõ một lần, ngắt 1 giây trước và sau.
        </Typography>
      </Box>
    </Box>
  );
}
