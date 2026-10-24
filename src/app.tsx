import type { ReactNode } from 'react';
import type { FeatureKey } from 'src/config/release';

import { useState } from 'react';
import { Outlet, Navigate, createHashRouter, RouterProvider } from 'react-router-dom';

import Box from '@mui/material/Box';

import { ThemeProvider } from 'src/theme';
import { useProfiles } from 'src/store/profiles';
import { DashboardLayout } from 'src/layouts/dashboard';
import { EXPIRES, RELEASE, RELEASES, isExpired, isEnabled, IS_PREVIEW } from 'src/config/release';

import { HomePage } from 'src/sections/home';
import { AdminPage } from 'src/sections/admin';
import { RemoteRecordPage } from 'src/sections/remote-record';
import { AboutPage } from 'src/sections/about';
import { CulturePage } from 'src/sections/culture';
import { CertificatePage } from 'src/sections/certificate';
import { RecordingStudioPage } from 'src/sections/recording-studio';
import { AlphabetPage } from 'src/sections/alphabet';
import { TranslatePage } from 'src/sections/translate';
import { DictionaryPage } from 'src/sections/dictionary';
import { LearnPickPage, LearnDeckPage } from 'src/sections/learn';
import { PracticePlayPage, PracticeSetupPage } from 'src/sections/practice';
import { ChallengePickPage, ChallengePlayPage } from 'src/sections/challenge';
import { ExpiredScreen, ProfilePickerPage, hasPickedThisSession } from 'src/sections/profiles';

function Gate({ feature, children }: { feature: FeatureKey | FeatureKey[]; children: ReactNode }) {
  const list = Array.isArray(feature) ? feature : [feature];
  return list.some(isEnabled) ? children : <Navigate to="/" replace />;
}

function Root() {
  const hasActive = useProfiles((s) => s.profiles.some((p) => p.id === s.activeId));
  const [picked, setPicked] = useState(hasPickedThisSession);

  if (EXPIRES && isExpired()) return <ExpiredScreen date={EXPIRES} />;
  if (isEnabled('profiles') && (!picked || !hasActive)) return <ProfilePickerPage onDone={() => setPicked(true)} />;

  return (
    <>
      <Outlet />
      {IS_PREVIEW && <PreviewBadge />}
    </>
  );
}

function PreviewBadge() {
  return (
    <Box
      sx={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        zIndex: 2000,
        px: 1.5,
        py: 0.75,
        borderRadius: 1,
        typography: 'caption',
        fontWeight: 700,
        letterSpacing: 1,
        color: '#fff',
        bgcolor: 'rgba(28,37,46,.72)',
        pointerEvents: 'none',
      }}
    >
      BẢN XEM TRƯỚC · ĐỢT {RELEASE}/{RELEASES.length}
      {EXPIRES && ` · HẠN ${new Date(EXPIRES).toLocaleDateString('vi-VN')}`}
    </Box>
  );
}

// Hash routing: the built app is loaded from file:// inside Electron.
const router = createHashRouter([
  // Phone recording page for invited native speakers: standalone, no profile picker or menu
  { path: '/thu-am', element: <RemoteRecordPage /> },
  // Admin sits outside the profile picker / expiry gate: it must stay reachable whatever is hidden
  { element: <DashboardLayout />, children: [{ path: '/quan-tri', element: <AdminPage /> }] },
  {
    element: <Root />,
    children: [
      { path: '/profiles', element: <Gate feature="profiles"><ProfilePickerPage /></Gate> },
      {
        element: <DashboardLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/learn', element: <Gate feature="learn"><LearnPickPage /></Gate> },
          { path: '/learn/:topicId', element: <Gate feature="learn"><LearnDeckPage /></Gate> },
          { path: '/challenge', element: <Gate feature="challenge"><ChallengePickPage /></Gate> },
          { path: '/challenge/:topicId', element: <Gate feature="challenge"><ChallengePlayPage /></Gate> },
          { path: '/practice', element: <Gate feature="practiceWord"><PracticeSetupPage /></Gate> },
          { path: '/practice/:topicId', element: <Gate feature="practiceWord"><PracticePlayPage /></Gate> },
          { path: '/translate', element: <Gate feature="translate"><TranslatePage /></Gate> },
          { path: '/alphabet', element: <Gate feature="alphabet"><AlphabetPage /></Gate> },
          { path: '/dictionary', element: <Gate feature="dictionary"><DictionaryPage /></Gate> },
          { path: '/culture', element: <Gate feature="culture"><CulturePage /></Gate> },
          { path: '/certificate', element: <Gate feature="certificate"><CertificatePage /></Gate> },
          { path: '/recording', element: <Gate feature="recording"><RecordingStudioPage /></Gate> },
          { path: '/about', element: <AboutPage /> },
          { path: '*', element: <Navigate to="/" replace /> },
        ],
      },
    ],
  },
]);

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
