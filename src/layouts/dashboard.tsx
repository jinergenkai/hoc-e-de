import type { FeatureKey } from 'src/config/release';

import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { alpha } from '@mui/material/styles';

import { useProfiles } from 'src/store/profiles';
import { levelOf, useProgress, useTodayXp } from 'src/store/progress';
import { isEnabled, releaseOf, SHOW_TEASERS } from 'src/config/release';

import { Iconify } from 'src/components/iconify';
import { ProfileAvatar } from 'src/sections/profiles';
import { BROCADE, BrocadeBand, BrocadeColumn, CornerDiamond, brocadeBackdrop } from 'src/components/ornaments';

export const NAV: { path: string; title: string; icon: string; feature?: FeatureKey }[] = [
  { path: '/', title: 'Trang chủ', icon: 'solar:home-smile-bold-duotone' },
  { path: '/learn', title: 'Học thẻ', icon: 'solar:card-2-bold-duotone', feature: 'learn' },
  { path: '/challenge', title: 'Thử thách quẹt', icon: 'solar:bolt-bold-duotone', feature: 'challenge' },
  { path: '/practice', title: 'Luyện dịch', icon: 'solar:pen-new-square-bold-duotone', feature: 'practiceWord' },
  { path: '/translate', title: 'Dịch thông minh', icon: 'solar:magic-stick-3-bold-duotone', feature: 'translate' },
  { path: '/alphabet', title: 'Bảng chữ cái', icon: 'solar:text-bold-duotone', feature: 'alphabet' },
  { path: '/dictionary', title: 'Từ điển', icon: 'solar:book-bookmark-bold-duotone', feature: 'dictionary' },
  { path: '/about', title: 'Giới thiệu', icon: 'solar:info-circle-bold-duotone' },
];

const NAV_WIDTH = 280;

// Game screens (/learn/:topic, /challenge/:topic, /practice/:topic) run full-screen.
const isFocusRoute = (pathname: string) => /^\/(learn|challenge|practice)\/[^/]+/.test(pathname);

export function DashboardLayout() {
  const { pathname } = useLocation();

  if (isFocusRoute(pathname)) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Outlet />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Nav />
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Box sx={{ px: { xs: 3, lg: 5 }, pt: 1, pb: 8, width: 1, maxWidth: 1280, mx: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

function Nav() {
  const todayXp = useTodayXp();
  const dailyGoal = useProgress((s) => s.dailyGoal);
  const pct = Math.min(100, Math.round((todayXp / dailyGoal) * 100));

  const items = NAV.filter((n) => !n.feature || isEnabled(n.feature) || SHOW_TEASERS);

  return (
    <Box component="nav" sx={{ width: NAV_WIDTH, flexShrink: 0, position: 'sticky', top: 0, height: '100vh', display: 'flex', bgcolor: 'background.paper' }}>
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <BrocadeBand motif="diamond" height={14} />
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 3, py: 3 }}>
          <Logo />
          <Box>
            <Typography variant="h6" sx={{ lineHeight: 1.2, fontFamily: '"Noto Sans"', fontWeight: 800 }}>
              Hriăm Êđê
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Học tiếng Ê-đê
            </Typography>
          </Box>
        </Stack>

        <Stack component="ul" spacing={0.5} sx={{ px: 2, m: 0, listStyle: 'none', flexGrow: 1 }}>
          {items.map((item) => {
            const locked = Boolean(item.feature && !isEnabled(item.feature));
            return (
              <li key={item.path}>
                {locked ? (
                  <Tooltip title={`Sắp ra mắt · Đợt ${releaseOf(item.feature!)?.n}`} placement="right" arrow>
                    <Box sx={{ ...navItemSx, color: 'text.disabled', cursor: 'default', '&:hover': {} }}>
                      <Iconify icon={item.icon} width={24} />
                      <Box component="span" sx={{ flexGrow: 1 }}>
                        {item.title}
                      </Box>
                      <Iconify icon="solar:lock-keyhole-bold-duotone" width={18} />
                    </Box>
                  </Tooltip>
                ) : (
                  <ButtonBase component={NavLink} to={item.path} end={item.path === '/'} sx={navItemSx}>
                    <Iconify icon={item.icon} width={24} />
                    {item.title}
                  </ButtonBase>
                )}
              </li>
            );
          })}
        </Stack>

        {isEnabled('gamification') && (
          <Box sx={{ m: 2, p: 2.5, borderRadius: 2, position: 'relative', overflow: 'hidden', color: BROCADE.white, bgcolor: BROCADE.black, ...brocadeBackdrop('#E0A100', 0.1, 40) }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Iconify icon="solar:cup-star-bold-duotone" width={24} sx={{ color: BROCADE.gold }} />
              <Typography variant="subtitle2">Mục tiêu hôm nay</Typography>
            </Stack>
            <Typography variant="caption" sx={{ opacity: 0.72, display: 'block', mb: 1 }}>
              {todayXp} / {dailyGoal} XP
            </Typography>
            <LinearProgress variant="determinate" value={pct} color="secondary" sx={{ bgcolor: alpha(BROCADE.white, 0.16) }} />
          </Box>
        )}
        <BrocadeBand motif="sawtooth" height={12} edges={false} />
      </Box>
      <BrocadeColumn motif="zigzag" width={8} sx={{ opacity: 0.9 }} />
    </Box>
  );
}

const navItemSx = {
  width: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: 2,
  px: 1.5,
  py: 1.25,
  borderRadius: 1,
  typography: 'body2',
  fontWeight: 500,
  color: 'text.secondary',
  '&:hover': { bgcolor: 'action.hover' },
  '&.active': {
    color: 'primary.main',
    fontWeight: 600,
    bgcolor: (t: any) => alpha(t.palette.primary.main, 0.08),
    '&:hover': { bgcolor: (t: any) => alpha(t.palette.primary.main, 0.16) },
  },
};

function Logo() {
  return (
    <Box
      sx={{
        width: 46,
        height: 46,
        borderRadius: 1.5,
        position: 'relative',
        display: 'grid',
        placeItems: 'center',
        color: 'common.white',
        fontFamily: '"Noto Sans"',
        fontWeight: 800,
        fontSize: 22,
        bgcolor: BROCADE.black,
        ...brocadeBackdrop('#C8401E', 0.35, 23),
        boxShadow: (t) => t.customShadows.primary,
        border: `2px solid ${BROCADE.gold}`,
      }}
    >
      Ƀ
      <CornerDiamond size={14} sx={{ position: 'absolute', right: -6, bottom: -6 }} />
    </Box>
  );
}

// ----------------------------------------------------------------------

function Header() {
  const { pathname } = useLocation();
  const xp = useProgress((s) => s.xp);
  const streak = useProgress((s) => s.streak);
  const title = NAV.find((n) => (n.path === '/' ? pathname === '/' : pathname.startsWith(n.path)))?.title ?? '';

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{ position: 'sticky', top: 0, zIndex: 10, px: { xs: 3, lg: 5 }, height: 72, backdropFilter: 'blur(6px)', bgcolor: (t) => alpha(t.palette.background.default, 0.8) }}
    >
      <Typography variant="subtitle1" sx={{ flexGrow: 1, color: 'text.secondary' }}>
        {title}
      </Typography>
      {isEnabled('gamification') && (
        <>
          <Tooltip title="Chuỗi ngày học liên tiếp" arrow>
            <Stack direction="row" alignItems="center" spacing={0.5} sx={pill('#FF5630')}>
              <Iconify icon="solar:fire-bold-duotone" width={20} />
              <span>{streak}</span>
            </Stack>
          </Tooltip>
          <Tooltip title="Tổng điểm kinh nghiệm" arrow>
            <Stack direction="row" alignItems="center" spacing={0.5} sx={pill('#E0A100')}>
              <Iconify icon="solar:star-bold-duotone" width={20} />
              <span>{xp} XP</span>
            </Stack>
          </Tooltip>
        </>
      )}
      {isEnabled('profiles') ? (
        <ProfileMenu />
      ) : (
        isEnabled('gamification') && (
          <Tooltip title={`Cấp ${levelOf(xp)}`} arrow>
            <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.lighter', color: 'primary.dark', fontWeight: 700, fontSize: 15 }}>{levelOf(xp)}</Avatar>
          </Tooltip>
        )
      )}
    </Stack>
  );
}

function ProfileMenu() {
  const navigate = useNavigate();
  const xp = useProgress((s) => s.xp);
  const profile = useProfiles((s) => s.profiles.find((p) => p.id === s.activeId));
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  if (!profile) return null;

  return (
    <>
      <ButtonBase onClick={(e) => setAnchor(e.currentTarget)} sx={{ borderRadius: 5, pl: 0.5, pr: 1.5, py: 0.5, gap: 1.25, '&:hover': { bgcolor: 'action.hover' } }}>
        <ProfileAvatar profile={profile} size={34} />
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="subtitle2" sx={{ lineHeight: 1.2 }}>
            {profile.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Cấp {levelOf(xp)}
          </Typography>
        </Box>
      </ButtonBase>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)} slotProps={{ paper: { sx: { mt: 1, minWidth: 200 } } }}>
        <MenuItem
          onClick={() => {
            setAnchor(null);
            navigate('/profiles');
          }}
          sx={{ gap: 1.5 }}
        >
          <Iconify icon="solar:users-group-two-rounded-bold-duotone" />
          Đổi người học
        </MenuItem>
      </Menu>
    </>
  );
}

const pill = (color: string) => ({
  px: 1.5,
  height: 36,
  borderRadius: 5,
  typography: 'subtitle2',
  color,
  bgcolor: alpha(color, 0.1),
});
