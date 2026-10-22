import { Navigate, createHashRouter, RouterProvider } from 'react-router-dom';

import { ThemeProvider } from 'src/theme';
import { DashboardLayout } from 'src/layouts/dashboard';

import { HomePage } from 'src/sections/home';
import { AlphabetPage } from 'src/sections/alphabet';
import { TranslatePage } from 'src/sections/translate';
import { DictionaryPage } from 'src/sections/dictionary';
import { LearnPickPage, LearnDeckPage } from 'src/sections/learn';
import { PracticePlayPage, PracticeSetupPage } from 'src/sections/practice';
import { ChallengePickPage, ChallengePlayPage } from 'src/sections/challenge';

// Hash routing: the built app is loaded from file:// inside Electron.
const router = createHashRouter([
  {
    element: <DashboardLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/learn', element: <LearnPickPage /> },
      { path: '/learn/:topicId', element: <LearnDeckPage /> },
      { path: '/challenge', element: <ChallengePickPage /> },
      { path: '/challenge/:topicId', element: <ChallengePlayPage /> },
      { path: '/practice', element: <PracticeSetupPage /> },
      { path: '/practice/:topicId', element: <PracticePlayPage /> },
      { path: '/translate', element: <TranslatePage /> },
      { path: '/alphabet', element: <AlphabetPage /> },
      { path: '/dictionary', element: <DictionaryPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
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
