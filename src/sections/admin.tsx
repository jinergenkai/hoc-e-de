import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { setFlags } from 'src/store/flags';
import { adminPassword, saveFlags, REMOTE_AVAILABLE } from 'src/remote/api';
import { RELEASES, FEATURE_LABELS, currentFlags, type FeatureKey } from 'src/config/release';

import { PageTitle } from 'src/components/common';

/**
 * /quan-tri — choose which features learners see, to reveal the app to the client step by step.
 * Saved on the server; every device picks it up when the app is (re)opened.
 */
export function AdminPage() {
  const initial = useMemo(() => currentFlags(), []);
  const [on, setOn] = useState<Set<FeatureKey>>(new Set(initial.features ?? []));
  const [teasers, setTeasers] = useState(initial.teasers);
  const [pw, setPw] = useState(adminPassword.get());
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  if (!REMOTE_AVAILABLE) {
    return <Alert severity="info">Cài đặt hiển thị chỉ dùng được ở bản chạy trên mạng (Vercel). Bản cài Windows chọn tính năng lúc build (VITE_RELEASE).</Alert>;
  }

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
    adminPassword.set(pw);
    try {
      const cfg = await saveFlags({ features: [...on], teasers });
      setFlags(cfg);
      setMsg({ ok: true, text: 'Đã lưu. Máy khác sẽ thấy thay đổi khi mở lại hoặc tải lại trang.' });
    } catch (e) {
      setMsg({ ok: false, text: (e as { status?: number }).status === 401 ? 'Mật khẩu không đúng.' : e instanceof Error ? e.message : 'Không lưu được' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageTitle title="Cài đặt hiển thị" subtitle="Chọn tính năng người học nhìn thấy. Mở dần từng đợt để khách làm quen, không bị ngợp." />
      <Card sx={{ p: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Chọn nhanh theo đợt
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
              <Typography variant="body2">Hiện tab chưa mở dưới dạng “Sắp ra mắt” (có ổ khoá)</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Tắt đi thì tab chưa mở bị ẩn hẳn khỏi menu.
              </Typography>
            </Box>
          }
        />

        {msg && (
          <Alert severity={msg.ok ? 'success' : 'error'} sx={{ mt: 3 }}>
            {msg.text}
          </Alert>
        )}
        <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mt: 3 }}>
          <TextField size="small" type="password" label="Mật khẩu quản trị" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && save()} />
          <Button variant="contained" size="large" disabled={busy || !pw} onClick={save}>
            Lưu cài đặt
          </Button>
        </Stack>
      </Card>
    </>
  );
}
