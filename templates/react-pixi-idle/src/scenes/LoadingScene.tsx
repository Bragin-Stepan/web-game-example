import { FaSpinner } from 'react-icons/fa';

export function LoadingScene() {
  return (
    <main
      id="game-root"
      data-scene="loading"
      className="fixed inset-0 grid h-dvh w-screen place-items-center bg-emerald-950"
      aria-busy="true"
    >
      <FaSpinner className="text-3xl text-white drop-shadow-lg motion-safe:animate-spin" aria-hidden="true" />
    </main>
  );
}
