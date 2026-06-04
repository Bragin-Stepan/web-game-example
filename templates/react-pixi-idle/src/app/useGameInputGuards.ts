import { useEffect } from 'react';
import { installGameInputGuards } from '@core-inc/yandex-game-kit';

export function useGameInputGuards() {
  useEffect(() => installGameInputGuards(), []);
}
