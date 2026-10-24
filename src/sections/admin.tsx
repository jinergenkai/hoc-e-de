import { useMemo, useState, useEffect, useCallback } from 'react';
import { zipSync } from 'fflate';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { itemById } from 'src/data/record-items';
import { playBlob } from 'src/hooks/use-recorder';
import { setFlags } from 'src/store/flags';
import { RELEASES, FEATURE_LABELS, currentFlags, type FeatureKey } from 'src/config/release';
import { REMOTE_AVAILABLE, adminPassword, fetchEntries, fetchFile, review, saveFlags, type RemoteEntry } from 'src/remote/api';

import { Iconify } from 'src/components/iconify';
import { BrocadeBand } from 'src/components/ornaments';
import { RadeText, PageTitle } from 'src/components/common';

/** /quan-tri — admin: choose which features are visible, review phone recordings, download the pack. */
export function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [entries, setEntries] = useState<RemoteEntry[]>([]);
  const [code, setCode] = useState('');

  const load = useCallback(async () => {
    const data = await fetchEntries();
    setEntries(data.entries);
    setCode(data.recorderCode);
    setAuthed(true);
  }, []);

  if (!REMOTE_AVAILABLE) {
    return <Alert severity="info">Trang quản trị chỉ dùng được khi mở bản chạy trên mạng (Vercel), không dùng trong bản cài trên máy tính.</Alert>;
  }
  if (!authed) return <LoginGate onLogin={load} />;
  return <AdminPanel entries={entries} code={code} reload={load} />;
}

function LoginGate({ onLogin }: { onLogin: () => Promise<void> }) {
  const [pw, setPw] = useState(adminPassword.get());
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError('');
    adminPassword.set(pw);
    try {
      await onLogin();
    } catch (e) {
      adminPassword.set(null);
      setError((e as { status?: number }).status === 401 ? 'Mật khẩu không đúng' : 'Không kết nối được máy chủ. Kiểm tra lại cài đặt Vercel Blob.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Stack alignItems="center" sx={{ pt: 8 }}>
      <Card sx={{ width: 380, maxWidth: 1, overflow: 'hidden' }}>
        <BrocadeBand motif="sleeve" height={14} />
        <Stack spacing={2} alignItems="center" sx={{ p: 4 }}>
          <Iconify icon="solar:lock-keyhole-bold-duotone" width={48} sx={{ color: 'primary.main' }} />
          <Typography variant="h6">Quản trị</Typography>
          <TextField
            autoFocus
            fullWidth
            type="password"
            label="Mật khẩu quản trị"
            value={pw}
            error={Boolean(error)}
            helperText={error || ' '}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
          <Button fullWidth size="large" variant="contained" disabled={!pw || busy} onClick={submit}>
            Đăng nhập
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function AdminPanel({ entries, code, reload }: { entries: RemoteEntry[]; code: string; reload: () => Promise<void> }) {
  const [tab, setTab] = useState<'features' | 'recordings'>('features');
  return (
    <Box sx={{ pt: 3, px: { xs: 2, md: 0 } }}>
      <PageTitle title="Quản trị" subtitle="Chọn tính năng hiển thị cho người học và duyệt các bản ghi âm gửi về từ điện thoại." />
      <Card>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 3, borderBottom: (t) => `1px solid ${t.palette.divider}` }}>
          <Tab value="features" label="Tính năng hiển thị" />
          <Tab value="recordings" label={`Bản ghi âm gửi về (${entries.filter((e) => e.status === 'pending').length} chờ duyệt)`} />
        </Tabs>
        {tab === 'features' ? <FeaturesTab /> : <RecordingsTab entries={entries} code={code} reload={reload} />}
      </Card>
    </Box>
  );
}

// ----------------------------------------------------------------------

function FeaturesTab() {
  const initial = useMemo(() => currentFlags(), []);
  const [on, setOn] = useState<Set<FeatureKey>>(new Set(initial.features ?? []));
  const [teasers, setTeasers] = useState(initial.teasers);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const toggle = (f: FeatureKey) =>
    setOn((prev) => {
      const next = new Set(prev);
      if (!next.delete(f)) next.add(f);
      return next;
    });

  const upTo = (n: number) => setOn(new Set(RELEASES.filter((r) => r.n <= n).flatMap((r) => r.features)));

  const save = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const cfg = await saveFlags({ features: [...on], teasers });
      setFlags({ features: cfg.features, teasers: cfg.teasers });
      setMsg({ ok: true, text: 'Đã lưu. Người học sẽ thấy thay đổi khi mở lại hoặc tải lại trang.' });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : 'Không lưu được' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Hiện nhanh theo đợt
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
        {RELEASES.map((r) => (
          <Chip key={r.n} clickable variant="outlined" label={`Đến đợt ${r.n}`} onClick={() => upTo(r.n)} />
        ))}
        <Chip clickable color="primary" label="Hiện tất cả" onClick={() => upTo(RELEASES.length)} />
      </Stack>

      <Stack divider={<Divider sx={{ borderStyle: 'dashed' }} />} spacing={1.5}>
        {RELEASES.map((r) => (
          <Box key={r.n}>
            <Typography variant="subtitle2">
              Đợt {r.n} · {r.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
              {r.pitch}
            </Typography>
            {r.features.map((f) => (
              <FormControlLabel key={f} sx={{ display: 'flex' }} control={<Checkbox checked={on.has(f)} onChange={() => toggle(f)} />} label={FEATURE_LABELS[f]} />
            ))}
          </Box>
        ))}
      </Stack>

      <Divider sx={{ my: 3 }} />
      <FormControlLabel
        control={<Switch checked={teasers} onChange={(e) => setTeasers(e.target.checked)} />}
        label={
          <Box>
            <Typography variant="body2">Hiện mục chưa mở trong menu dưới dạng “Sắp ra mắt” (có ổ khoá)</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Tắt đi thì tab chưa mở bị ẩn hẳn, người học không biết còn tính năng nào khác.
            </Typography>
          </Box>
        }
      />

      {msg && (
        <Alert severity={msg.ok ? 'success' : 'error'} sx={{ mt: 3 }}>
          {msg.text}
        </Alert>
      )}
      <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
        <Button variant="contained" size="large" disabled={busy} onClick={save}>
          Lưu cài đặt
        </Button>
      </Stack>
    </Box>
  );
}

// ----------------------------------------------------------------------

const kb = (n: number) => `${Math.max(1, Math.round(n / 1024))} KB`;

function RecordingsTab({ entries, code, reload }: { entries: RemoteEntry[]; code: string; reload: () => Promise<void> }) {
  const [filter, setFilter] = useState<'pending' | 'approved'>('pending');
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const link = `${window.location.origin}${window.location.pathname}#/thu-am${code ? `?k=${encodeURIComponent(code)}` : ''}`;
  const approved = entries.filter((e) => e.status === 'approved');
  const shown = entries.filter((e) => e.status === filter).sort((a, b) => a.id.localeCompare(b.id, 'vi', { numeric: true }));

  const act = async (label: string, fn: () => Promise<unknown>) => {
    setBusy(label);
    try {
      await fn();
      await reload();
    } catch (e) {
      setNotice(e instanceof Error ? e.message : 'Có lỗi');
    } finally {
      setBusy(null);
    }
  };

  const play = (e: RemoteEntry) => act(`play:${e.pathname}`, async () => void playBlob(await fetchFile(e.pathname)));

  const downloadPack = () =>
    act('zip', async () => {
      const files: Record<string, Uint8Array> = {};
      let next = 0;
      const worker = async () => {
        while (next < approved.length) {
          const e = approved[next++];
          files[`${e.id}.${e.ext}`] = new Uint8Array(await (await fetchFile(e.pathname)).arrayBuffer());
        }
      };
      await Promise.all([worker(), worker(), worker(), worker()]);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([zipSync(files, { level: 0 }) as BlobPart], { type: 'application/zip' }));
      a.download = `ghi-am-da-duyet-${new Date().toISOString().slice(0, 10)}.zip`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      setNotice(`Đã tải ${approved.length} file. Giải nén vào public/audio/ rồi build lại để thẻ có giọng cứng.`);
    });

  useEffect(() => {
    const t = setInterval(() => void reload().catch(() => undefined), 60_000);
    return () => clearInterval(t);
  }, [reload]);

  return (
    <Box sx={{ p: 3 }}>
      <Alert severity={code ? 'info' : 'warning'} sx={{ mb: 3 }} action={code ? <Button color="inherit" size="small" onClick={() => navigator.clipboard?.writeText(link)}>Sao chép</Button> : undefined}>
        {code ? (
          <>
            Link gửi người đọc: <b style={{ wordBreak: 'break-all' }}>{link}</b>
          </>
        ) : (
          'Chưa đặt RECORDER_CODE trên Vercel nên chưa có link mời. Thêm biến môi trường RECORDER_CODE rồi deploy lại.'
        )}
      </Alert>
      {notice && (
        <Alert severity="info" onClose={() => setNotice(null)} sx={{ mb: 3 }}>
          {notice}
        </Alert>
      )}

      <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
        <Chip clickable color={filter === 'pending' ? 'primary' : 'default'} variant={filter === 'pending' ? 'filled' : 'outlined'} label={`Chờ duyệt (${entries.length - approved.length})`} onClick={() => setFilter('pending')} />
        <Chip clickable color={filter === 'approved' ? 'primary' : 'default'} variant={filter === 'approved' ? 'filled' : 'outlined'} label={`Đã duyệt (${approved.length})`} onClick={() => setFilter('approved')} />
        <Box sx={{ flexGrow: 1 }} />
        <Button color="inherit" variant="outlined" onClick={() => act('reload', async () => undefined)} disabled={Boolean(busy)}>
          Làm mới
        </Button>
        <Button variant="contained" disabled={approved.length === 0 || Boolean(busy)} onClick={downloadPack} startIcon={<Iconify icon="solar:download-bold-duotone" />}>
          {busy === 'zip' ? 'Đang gom file…' : `Tải gói đã duyệt (${approved.length})`}
        </Button>
      </Stack>

      {shown.length === 0 && (
        <Typography variant="body2" sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
          {filter === 'pending' ? 'Chưa có bản ghi nào chờ duyệt.' : 'Chưa duyệt bản nào.'}
        </Typography>
      )}
      {shown.map((e, i) => {
        const item = itemById(e.id);
        return (
          <Box key={e.pathname}>
            {i > 0 && <Divider sx={{ borderStyle: 'dashed' }} />}
            <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 1.25 }}>
              <Typography variant="caption" sx={{ color: 'text.disabled', width: 48 }}>
                {e.id}
              </Typography>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <RadeText sx={{ fontSize: 18 }}>{item?.rade ?? e.id}</RadeText>
                <Typography variant="caption" noWrap sx={{ color: 'text.secondary', display: 'block' }}>
                  {item?.vi} · {e.who || 'ẩn danh'} · {new Date(e.at).toLocaleString('vi-VN')} · {kb(e.size)}
                </Typography>
              </Box>
              <IconButton onClick={() => play(e)} disabled={Boolean(busy)} title="Nghe">
                <Iconify icon="solar:play-circle-bold-duotone" width={26} />
              </IconButton>
              {e.status === 'pending' && (
                <Button size="small" variant="contained" disabled={Boolean(busy)} onClick={() => act(`ok:${e.pathname}`, () => review('approve', e.pathname))}>
                  Duyệt
                </Button>
              )}
              <IconButton
                disabled={Boolean(busy)}
                onClick={() => window.confirm(`Xoá bản ghi "${item?.rade ?? e.id}" của ${e.who || 'ẩn danh'}?`) && act(`del:${e.pathname}`, () => review('delete', e.pathname))}
                title="Xoá"
              >
                <Iconify icon="solar:trash-bin-trash-bold-duotone" width={22} />
              </IconButton>
            </Stack>
          </Box>
        );
      })}
      <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.disabled' }}>
        Duyệt một bản sẽ thay bản đã duyệt trước đó của cùng mục. Chỉ bản đã duyệt nằm trong gói tải về.
      </Typography>
    </Box>
  );
}
