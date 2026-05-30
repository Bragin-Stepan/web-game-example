import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { bootstrapPlatform } from './platform/bootstrap';
import './index.css';

void bootstrapPlatform()
  .catch((error) => {
    console.warn('Platform bootstrap failed, running with browser fallback.', error);
  })
  .finally(() => {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  });
