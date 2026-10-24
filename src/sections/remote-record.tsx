import { useMemo, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { useOutbox } from 'src/store/outbox';
import { playBlob, useRecorder } from 'src/hooks/use-recorder';
import { RECORD_ITEMS, RECORD_TAB_LABEL, type RecordKind, type RecordItem } from 'src/data/record-items';
import { recorderCode, recorderName, fetchSubmittedIds, REMOTE_AVAILABLE } from 'src/remote/api';

import { Iconify } from 'src/components/iconify';
import { RadeText } from 'src/components/common';
import { BrocadeBand } from 'src/components/ornaments';
import { MicButton, micErrorText } from 'src/components/recorder-ui';

/**
 * /thu-am — page for native speakers to record words, sentences and letters on a phone.
 * Opened from an invite link (…/#/thu-am?k=CODE); takes are queued on the phone and
 * uploaded in the background, then reviewed by the admin.
 */
export function RemoteRecordPage() {
  const [params, setParams] = useSearchParams();
  const [code, setCode] = useState(() => params.get('k') || recorderCode.get());
  const [name, setName] = useState(recorderName.get);
  const [ready, setReady] = useState(false); // name + code confirmed
  const [submitted, setSubmitted] = useState<Set<string>>(new Set());
  const [loadError, setLoadError] = useState<string | null>(null);
  const [kind, setKind] = useState<RecordKind>('word');
  const [session, setSession] = useState<{ list: RecordItem[]; index: number } | null>(null);
  const outbox = useOutbox();

  // Keep the code but take it out of the address bar
  useEffect(() => {
    const k = params.get('k');
    if (k) {
      recorderCode.set(k);
      setParams({}, { replace: true });
    }
  }, [params, setParams]);

  useEffect(() => {
    void useOutbox.getState().load();
  }, []);

  const refresh = useCallback(async () => {
    try {
      setSubmitted(new Set(await fetchSubmittedIds()));
      setLoadError(null);
    } catch (e) {
      const status = (e as { status?: number }).status;
      setLoadError(status === 401 ? 'Mã mời không đúng. Hãy hỏi lại người gửi link cho bạn.' : 'Chưa kết nối được. Bạn vẫn ghi được, bản ghi sẽ gửi khi có mạng.');
    }
  }, []);

  useEffect(() => {
    if (ready) void refresh();
  }, [ready, refresh]);

  const done = useMemo(() => new Set([...submitted, ...outbox.sent, ...outbox.queued]), [submitted, outbox.sent, outbox.queued]);
  const items = RECORD_ITEMS[kind];
  const remaining = items.filter((i) => !done.has(i.id));
  const total = Object.values(RECORD_ITEMS).flat().length;
  const doneAll = Object.values(RECORD_ITEMS).flat().filter((i) => done.has(i.id)).length;

  const start = (fromId?: string) => {
    const list = fromId ? items : remaining;
    if (!list.length) return;
    setSession({ list, index: fromId ? Math.max(0, list.findIndex((i) => i.id === fromId)) : 0 });
  };

  if (!REMOTE_AVAILABLE) {
    return (
      <Shell>
        <Alert severity="info">Trang này chỉ dùng được khi mở bằng đường link trên mạng, không dùng trong bản cài trên máy tính.</Alert>
      </Shell>
    );
  }

  if (!ready) {
    const canGo = name.trim().length > 0 && code.trim().length > 0;
    return (
      <Shell>
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          Cảm ơn bạn đã giúp đọc tiếng Ê-đê
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Bạn sẽ đọc to từng từ, từng câu hiện trên màn hình. Mỗi mục chỉ vài giây. Có thể dừng bất cứ lúc nào và quay lại sau.
        </Typography>
        <Stack spacing={2}>
          <TextField label="Tên của bạn" helperText="Để nhóm biết ai đã đọc" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          {!params.get('k') && !recorderCode.get() && <TextField label="Mã mời" value={code} onChange={(e) => setCode(e.target.value)} fullWidth />}
          <Button
            size="large"
            variant="contained"
            disabled={!canGo}
            onClick={() => {
              recorderName.set(name.trim());
              recorderCode.set(code.trim());
              setReady(true);
            }}
          >
            Bắt đầu
          </Button>
        </Stack>
      </Shell>
    );
  }

  return (
    <Shell>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="subtitle1">Xin chào, {name}</Typography>
        <Button size="small" color="inherit" onClick={() => setReady(false)}>
          Đổi tên
        </Button>
      </Stack>

      {loadError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
      )}
      {outbox.queued.length > 0 && (
        <Alert
          severity={outbox.error ? 'warning' : 'info'}
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" disabled={outbox.sending} onClick={() => void outbox.flush()}>
              Gửi lại
            </Button>
          }
        >
          {outbox.sending ? 'Đang gửi…' : `${outbox.queued.length} bản ghi đang chờ gửi.`} {outbox.error && !outbox.sending ? outbox.error : ''}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Đã đọc
          </Typography>
          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700 }}>
            {doneAll}/{total}
          </Typography>
        </Stack>
        <LinearProgress variant="determinate" value={(doneAll / total) * 100} />
      </Box>

      <Tabs value={kind} onChange={(_, v) => setKind(v)} variant="fullWidth" sx={{ mb: 2 }}>
        {(Object.keys(RECORD_ITEMS) as RecordKind[]).map((k) => (
          <Tab key={k} value={k} label={`${RECORD_TAB_LABEL[k]} ${RECORD_ITEMS[k].filter((i) => done.has(i.id)).length}/${RECORD_ITEMS[k].length}`} />
        ))}
      </Tabs>

      <Button
        fullWidth
        size="large"
        variant="contained"
        disabled={remaining.length === 0}
        onClick={() => start()}
        startIcon={<Iconify icon="solar:microphone-3-bold-duotone" />}
        sx={{ mb: 2, py: 1.5 }}
      >
        {remaining.length ? `Đọc tiếp (${remaining.length} mục chưa đọc)` : 'Phần này đã đọc xong 🎉'}
      </Button>

      <Stack divider={<Box sx={{ borderBottom: '1px dashed', borderColor: 'divider' }} />}>
        {items.map((item) => (
          <Stack key={item.id} direction="row" alignItems="center" spacing={1.5} onClick={() => start(item.id)} sx={{ py: 1.25, cursor: 'pointer' }}>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <RadeText sx={{ fontSize: 18, lineHeight: 1.3 }}>{item.rade}</RadeText>
              <Typography variant="caption" noWrap sx={{ color: 'text.secondary', display: 'block' }}>
                {item.vi}
              </Typography>
            </Box>
            {done.has(item.id) ? <Chip size="small" color="success" label="Đã gửi" /> : <Iconify icon="solar:microphone-3-bold-duotone" width={22} sx={{ color: 'text.disabled' }} />}
          </Stack>
        ))}
      </Stack>

      <Dialog fullScreen open={Boolean(session)} onClose={() => setSession(null)}>
        {session && <RecordSession list={session.list} start={session.index} who={name.trim()} onClose={() => setSession(null)} />}
      </Dialog>
    </Shell>
  );
}

// ----------------------------------------------------------------------

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <BrocadeBand motif="skirt" height={22} />
      <Box sx={{ maxWidth: 560, mx: 'auto', px: 2.5, py: 3 }}>{children}</Box>
    </Box>
  );
}

/** One item at a time, thumb-friendly: tap the mic, listen back, send and move on. */
function RecordSession({ list, start, who, onClose }: { list: RecordItem[]; start: number; who: string; onClose: () => void }) {
  const [index, setIndex] = useState(start);
  const [take, setTake] = useState<Blob | null>(null);
  const [sent, setSent] = useState(0);
  const rec = useRecorder({ maxMs: 12_000 });
  const add = useOutbox((s) => s.add);
  const item = list[index];
  const err = micErrorText(rec.state);

  const go = (i: number) => {
    if (i >= list.length) return onClose();
    setIndex(Math.max(0, i));
    setTake(null);
  };

  const toggle = async () => {
    if (rec.recording) return rec.stop();
    setTake(null);
    const blob = await rec.start();
    if (blob) {
      setTake(blob);
      playBlob(blob);
    }
  };

  const send = async () => {
    if (!take || !item) return;
    await add(item.id, who, take);
    setSent((n) => n + 1);
    go(index + 1);
  };

  if (!item) return null;

  return (
    <Box sx={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <BrocadeBand motif="skirt" height={22} />
      <Stack direction="row" alignItems="center" sx={{ px: 2, pt: 1.5 }}>
        <Typography variant="subtitle2" sx={{ flexGrow: 1, color: 'text.secondary' }}>
          {index + 1}/{list.length} · đã gửi {sent}
        </Typography>
        <Button color="inherit" onClick={onClose} disabled={rec.recording}>
          Xong
        </Button>
      </Stack>
      <LinearProgress variant="determinate" value={((index + 1) / list.length) * 100} sx={{ mx: 2, height: 6 }} />

      <Stack alignItems="center" spacing={1} sx={{ px: 3, pt: 5, textAlign: 'center', flexGrow: 1 }}>
        <RadeText sx={{ fontSize: item.rade.length > 16 ? 32 : 52, lineHeight: 1.25 }}>{item.rade}</RadeText>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {item.vi}
        </Typography>

        <Box sx={{ py: 4 }}>
          <MicButton recording={rec.recording} level={rec.level} size={120} onClick={toggle} disabled={Boolean(err)} />
        </Box>
        <Typography variant="body2" sx={{ minHeight: 44, color: err || rec.recording ? 'error.main' : 'text.secondary' }}>
          {err ||
            (rec.recording
              ? `Đang ghi… ${(rec.elapsed / 1000).toFixed(1)}s · chạm lại để dừng`
              : take
                ? 'Nghe lại. Nếu đọc rõ thì bấm Gửi, chưa rõ thì Ghi lại.'
                : 'Chạm vào micro, đọc to rõ một lần rồi chạm để dừng.')}
        </Typography>
      </Stack>

      <Stack spacing={1.25} sx={{ p: 2.5 }}>
        <Button size="large" variant="contained" disabled={!take || rec.recording} onClick={send} startIcon={<Iconify icon="solar:check-circle-bold" />} sx={{ py: 1.5 }}>
          Gửi & đọc tiếp
        </Button>
        <Stack direction="row" spacing={1.25}>
          <Button fullWidth variant="outlined" color="inherit" disabled={!take || rec.recording} onClick={() => take && playBlob(take)}>
            Nghe lại
          </Button>
          <Button fullWidth variant="outlined" color="inherit" disabled={rec.recording || !take} onClick={toggle}>
            Ghi lại
          </Button>
          <Button fullWidth variant="outlined" color="inherit" disabled={rec.recording} onClick={() => go(index + 1)}>
            Bỏ qua
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
