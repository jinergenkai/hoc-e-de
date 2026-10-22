import type { ReactNode } from 'react';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import type { Profile } from 'src/store/profiles';
import { levelOf, useProgress, switchProgressTo } from 'src/store/progress';
import { useProfiles, AVATAR_COLORS, AVATAR_EMOJIS, readProfileStats } from 'src/store/profiles';

import { Iconify } from 'src/components/iconify';
import { Fringe, BROCADE, BrocadeBand, brocadeBackdrop } from 'src/components/ornaments';

// The picker shows once per app launch, so each learner on a shared PC picks themself.
const PICKED_FLAG = 'hriam-ede-picked';

export function hasPickedThisSession() {
  try {
    return sessionStorage.getItem(PICKED_FLAG) === '1';
  } catch {
    return true;
  }
}

export function selectProfile(p: Profile) {
  useProfiles.getState().setActive(p.id);
  switchProgressTo(p.storageKey);
  try {
    sessionStorage.setItem(PICKED_FLAG, '1');
  } catch {
    /* storage unavailable */
  }
}

// ----------------------------------------------------------------------

export function ProfileAvatar({ profile, size = 40 }: { profile: Pick<Profile, 'emoji' | 'color'>; size?: number }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        fontSize: size * 0.5,
        bgcolor: profile.color,
        // woven ring around the avatar
        boxShadow: `0 0 0 ${Math.max(2, size / 20)}px ${BROCADE.cream}, 0 0 0 ${Math.max(4, size / 10)}px ${BROCADE.red}`,
      }}
    >
      {profile.emoji}
    </Box>
  );
}

// ----------------------------------------------------------------------

export function ProfilePickerPage({ onDone }: { onDone?: () => void }) {
  const navigate = useNavigate();
  const profiles = useProfiles((s) => s.profiles);
  const remove = useProfiles((s) => s.remove);
  const [adding, setAdding] = useState(profiles.length === 0);
  const [editing, setEditing] = useState(false);

  const pick = (p: Profile) => {
    selectProfile(p);
    if (onDone) onDone();
    else navigate('/');
  };

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100vh', color: BROCADE.white, bgcolor: BROCADE.black, ...brocadeBackdrop('#E0A100', 0.07, 72), position: 'relative' }}
    >
      <BrocadeBand motif="skirt" height={40} sx={{ position: 'absolute', top: 0 }} />
      <Typography variant="overline" sx={{ color: BROCADE.gold, letterSpacing: 3 }}>
        Hriăm Êđê
      </Typography>
      <Typography variant="h2" sx={{ mb: 6 }}>
        Ai đang học hôm nay?
      </Typography>

      <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={4} sx={{ maxWidth: 960, px: 4 }}>
        {profiles.map((p, i) => {
          const stats = readProfileStats(p.storageKey);
          return (
            <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Box sx={{ position: 'relative' }}>
                <ButtonBase
                  onClick={() => (editing ? undefined : pick(p))}
                  sx={{ flexDirection: 'column', gap: 1.5, p: 2, borderRadius: 2, width: 160, '&:hover .avatar': { transform: 'scale(1.08)' } }}
                >
                  <Box className="avatar" sx={{ transition: 'transform .2s' }}>
                    <ProfileAvatar profile={p} size={108} />
                  </Box>
                  <Typography variant="h6" noWrap sx={{ maxWidth: 1 }}>
                    {p.name}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    Cấp {levelOf(stats.xp)} · 🔥 {stats.streak} · {stats.known} từ
                  </Typography>
                </ButtonBase>
                {editing && (
                  <IconButton
                    onClick={() => {
                      if (window.confirm(`Xoá hồ sơ "${p.name}" và toàn bộ tiến độ học?`)) remove(p.id);
                    }}
                    sx={{ position: 'absolute', top: 4, right: 12, bgcolor: 'error.main', color: '#fff', '&:hover': { bgcolor: 'error.dark' } }}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold-duotone" />
                  </IconButton>
                )}
              </Box>
            </motion.div>
          );
        })}

        <ButtonBase onClick={() => setAdding(true)} sx={{ flexDirection: 'column', gap: 1.5, p: 2, borderRadius: 2, width: 160 }}>
          <Box
            sx={{
              width: 108,
              height: 108,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              border: `3px dashed ${alpha(BROCADE.white, 0.4)}`,
              color: alpha(BROCADE.white, 0.8),
            }}
          >
            <Iconify icon="solar:user-plus-bold-duotone" width={44} />
          </Box>
          <Typography variant="h6">Thêm người học</Typography>
        </ButtonBase>
      </Stack>

      {profiles.length > 0 && (
        <Button
          onClick={() => setEditing((e) => !e)}
          startIcon={<Iconify icon={editing ? 'solar:check-circle-bold' : 'solar:pen-bold'} />}
          sx={{ mt: 6, color: alpha(BROCADE.white, 0.8), border: `1px solid ${alpha(BROCADE.white, 0.3)}` }}
        >
          {editing ? 'Xong' : 'Quản lý hồ sơ'}
        </Button>
      )}

      <AddProfileDialog
        key={profiles.length}
        open={adding}
        onClose={() => setAdding(false)}
        onCreated={(p) => {
          setAdding(false);
          pick(p);
        }}
      />
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <BrocadeBand motif="skirt" height={40} />
        <Fringe height={24} />
      </Box>
    </Stack>
  );
}

function AddProfileDialog({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: (p: Profile) => void }) {
  const add = useProfiles((s) => s.add);
  const count = useProfiles((s) => s.profiles.length);
  const [name, setName] = useState('');
  // Each new learner starts with a different avatar so they are easy to tell apart
  const [emoji, setEmoji] = useState(AVATAR_EMOJIS[count % AVATAR_EMOJIS.length]);
  const [color, setColor] = useState(AVATAR_COLORS[count % AVATAR_COLORS.length]);

  const create = () => {
    const p = add({ name: name || `Người học ${count + 1}`, emoji, color });
    setName('');
    onCreated(p);
  };

  return (
    <Dialog open={open} onClose={count ? onClose : undefined} maxWidth="xs" fullWidth>
      <BrocadeBand motif="sleeve" height={14} />
      <Box sx={{ p: 4 }}>
        <Stack alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <ProfileAvatar profile={{ emoji, color }} size={96} />
          <Typography variant="h5">{count === 0 ? 'Tạo hồ sơ đầu tiên' : 'Thêm người học'}</Typography>
        </Stack>
        <TextField
          fullWidth
          autoFocus
          label="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && create()}
          placeholder={`Người học ${count + 1}`}
        />
        <Picker label="Biểu tượng">
          {AVATAR_EMOJIS.map((e) => (
            <ButtonBase
              key={e}
              onClick={() => setEmoji(e)}
              sx={{ width: 44, height: 44, borderRadius: 1, fontSize: 24, bgcolor: e === emoji ? 'primary.lighter' : 'grey.100', outline: e === emoji ? '2px solid' : 'none', outlineColor: 'primary.main' }}
            >
              {e}
            </ButtonBase>
          ))}
        </Picker>
        <Picker label="Màu">
          {AVATAR_COLORS.map((c) => (
            <ButtonBase
              key={c}
              onClick={() => setColor(c)}
              sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: c, outline: c === color ? `3px solid ${BROCADE.gold}` : 'none', outlineOffset: 2 }}
            />
          ))}
        </Picker>
        <Button fullWidth size="large" variant="contained" onClick={create} sx={{ mt: 3 }}>
          Bắt đầu học
        </Button>
      </Box>
    </Dialog>
  );
}

function Picker({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box sx={{ mt: 2.5 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
        {label}
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {children}
      </Stack>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function Leaderboard() {
  const profiles = useProfiles((s) => s.profiles);
  const activeId = useProfiles((s) => s.activeId);
  const liveXp = useProgress((s) => s.xp);
  const liveStreak = useProgress((s) => s.streak);

  const rows = profiles
    .map((p) => {
      const stats = p.id === activeId ? { ...readProfileStats(p.storageKey), xp: liveXp, streak: liveStreak } : readProfileStats(p.storageKey);
      return { p, ...stats };
    })
    .sort((a, b) => b.xp - a.xp);

  const medal = ['🥇', '🥈', '🥉'];

  return (
    <Card sx={{ overflow: 'hidden' }}>
      <BrocadeBand motif="sleeve" height={12} />
      <Box sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2, color: 'secondary.dark' }}>
          <Iconify icon="solar:ranking-bold-duotone" width={22} />
          <Typography variant="subtitle2">Bảng xếp hạng trên máy này</Typography>
        </Stack>
        {rows.length < 2 && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Thêm người học khác để cùng thi đua.
          </Typography>
        )}
        <Stack spacing={1.5}>
          {rows.map((r, i) => (
            <Stack
              key={r.p.id}
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ p: 1, borderRadius: 1.5, bgcolor: r.p.id === activeId ? (t) => alpha(t.palette.primary.main, 0.08) : 'transparent' }}
            >
              <Typography sx={{ width: 28, textAlign: 'center', fontWeight: 700 }}>{medal[i] ?? i + 1}</Typography>
              <ProfileAvatar profile={r.p} size={32} />
              <Typography variant="subtitle2" noWrap sx={{ flexGrow: 1 }}>
                {r.p.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                🔥 {r.streak}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: 'primary.main', minWidth: 56, textAlign: 'right' }}>
                {r.xp} XP
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

export function ExpiredScreen({ date }: { date: string }) {
  return (
    <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ minHeight: '100vh', textAlign: 'center', color: BROCADE.white, bgcolor: BROCADE.black, ...brocadeBackdrop('#E0A100', 0.06, 72), px: 4 }}>
      <Iconify icon="solar:lock-keyhole-bold-duotone" width={72} sx={{ color: BROCADE.gold }} />
      <Typography variant="h3">Bản xem trước đã hết hạn</Typography>
      <Typography sx={{ opacity: 0.8, maxWidth: 520 }}>
        Bản xem trước này dùng được đến hết ngày {new Date(date).toLocaleDateString('vi-VN')}. Vui lòng liên hệ nhóm phát triển để nhận bản chính thức.
      </Typography>
    </Stack>
  );
}
