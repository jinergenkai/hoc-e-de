import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { loadFlags } from 'src/store/flags';
import { useRecordings } from 'src/store/recordings';

import App from './app';

// Load the list of in-app recordings so speaker buttons know what can be played
useRecordings.getState().load();

// Which tabs are visible is set by the admin on the server; wait briefly for it (max ~2.5 s)
loadFlags().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
