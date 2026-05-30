export type GameInputGuardOptions = {
  allowTextInputs?: boolean;
  preventContextMenu?: boolean;
  preventSelection?: boolean;
  preventDrag?: boolean;
};

const EDITABLE_TARGET_SELECTOR = 'input, textarea, select, [contenteditable="true"]';

export function installGameInputGuards(options: GameInputGuardOptions = {}): () => void {
  const {
    allowTextInputs = true,
    preventContextMenu = true,
    preventSelection = true,
    preventDrag = true,
  } = options;

  const suppressBrowserGameGesture = (event: Event) => {
    const target = event.target as HTMLElement | null;
    if (allowTextInputs && target?.closest(EDITABLE_TARGET_SELECTOR)) return;
    event.preventDefault();
  };

  if (preventContextMenu) {
    window.addEventListener('contextmenu', suppressBrowserGameGesture);
  }
  if (preventDrag) {
    window.addEventListener('dragstart', suppressBrowserGameGesture);
  }
  if (preventSelection) {
    window.addEventListener('selectstart', suppressBrowserGameGesture);
  }

  return () => {
    window.removeEventListener('contextmenu', suppressBrowserGameGesture);
    window.removeEventListener('dragstart', suppressBrowserGameGesture);
    window.removeEventListener('selectstart', suppressBrowserGameGesture);
  };
}
