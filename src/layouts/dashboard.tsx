import { NavLink, Outlet, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { alpha } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { BrocadeStripe } from 'src/components/common';
import { levelOf, useProgress, useTodayXp } from 'src/store/progress';

export const NAV = [
  { path: '/', title: 'Trang chủ', icon: 'solar:home-smile-bold-duotone' },
  { path: '/learn', title: 'Học thẻ', icon: 'solar:card-2-bold-duotone' },
  { path: '/challenge', title: 'Thử thách quẹt', icon: 'solar:bolt-bold-duotone' },
  { path: '/practice', title: 'Luyện dịch', icon: 'solar:pen-new-square-bold-duotone' },
  { path: '/translate', title: 'Dịch thông minh', icon: 'solar:magic-stick-3-bold-duotone' },
  { path: '/alphabet', title: 'Bảng chữ cái', icon: 'solar:text-bold-duotone' },
  { path: '/dictionary', title: 'Từ điển', icon: 'solar:book-bookmark-bold-duotone' },
];

const NAV_WIDTH = 280;

// Game screens (/learn/:topic, /challenge/:topic, /practice/:topic) run full-screen.
const isFocusRoute = (pathname: string) => /^\/(learn|challenge|practice)\/[^/]+/.test(pathname);

export function DashboardLayout() {
  const { pathname } = useLocation();
  const focus = isFocusRoute(pathname);

  if (focus) {
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

  return (
    <Box
      component="nav"
      sx={{
        width: NAV_WIDTH,
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        borderRight: (t) => `1px dashed ${alpha(t.palette.grey[500], 0.2)}`,
        bgcolor: 'background.paper',
      }}
    >
      <BrocadeStripe height={10} />
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 3, py: 3 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 1.5,
            display: 'grid',
            placeItems: 'center',
            color: 'common.white',
            fontFamily: '"Noto Sans"',
            fontWeight: 800,
            fontSize: 22,
            background: (t) => `linear-gradient(135deg, ${t.palette.primary.light}, ${t.palette.primary.dark})`,
            boxShadow: (t) => t.customShadows.primary,
          }}
        >
          Ƀ
        </Box>
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
        {NAV.map((item) => (
          <li key={item.path}>
            <ButtonBase
              component={NavLink}
              to={item.path}
              end={item.path === '/'}
              sx={{
                width: 1,
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
                  bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
                  '&:hover': { bgcolor: (t) => alpha(t.palette.primary.main, 0.16) },
                },
              }}
            >
              <Iconify icon={item.icon} width={24} />
              {item.title}
            </ButtonBase>
          </li>
        ))}
      </Stack>

      <Box sx={{ m: 2, p: 2.5, borderRadius: 2, bgcolor: (t) => alpha(t.palette.secondary.main, 0.12) }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Iconify icon="solar:cup-star-bold-duotone" width={24} sx={{ color: 'secondary.dark' }} />
          <Typography variant="subtitle2">Mục tiêu hôm nay</Typography>
        </Stack>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
          {todayXp} / {dailyGoal} XP
        </Typography>
        <LinearProgress
          variant="determinate"
          value={pct}
          color="secondary"
          sx={{ bgcolor: (t) => alpha(t.palette.secondary.main, 0.2) }}
        />
      </Box>
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
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        px: { xs: 3, lg: 5 },
        height: 72,
        backdropFilter: 'blur(6px)',
        bgcolor: (t) => alpha(t.palette.background.default, 0.8),
      }}
    >
      <Typography variant="subtitle1" sx={{ flexGrow: 1, color: 'text.secondary' }}>
        {title}
      </Typography>
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
      <Tooltip title={`Cấp ${levelOf(xp)}`} arrow>
        <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.lighter', color: 'primary.dark', fontWeight: 700, fontSize: 15 }}>
          {levelOf(xp)}
        </Avatar>
      </Tooltip>
    </Stack>
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
