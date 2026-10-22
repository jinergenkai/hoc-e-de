import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { useRecordings } from 'src/store/recordings';

import App from './app';

// Load the list of in-app recordings so speaker buttons know what can be played
useRecordings.getState().load();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
