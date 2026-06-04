import { useEffect, useState } from 'react';
import { bootstrapPlatform } from '../platform/bootstrap';

export type AppBootstrapStatus = 'loading' | 'ready';

let bootstrapPromise: Promise<void> | null = null;

function getBootstrapPromise() {
  bootstrapPromise ??= bootstrapPlatform().catch((error) => {
    console.warn('Platform bootstrap failed, running with browser fallback.', error);
  });

  return bootstrapPromise;
}

export function useAppBootstrap(): AppBootstrapStatus {
  const [status, setStatus] = useState<AppBootstrapStatus>('loading');

  useEffect(() => {
    let mounted = true;

    void getBootstrapPromise().finally(() => {
      if (mounted) {
        setStatus('ready');
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return status;
}
