export const shineClass = [
  'before:pointer-events-none before:absolute before:inset-y-0 before:left-[-58%] before:z-0 before:w-[46%]',
  'before:-skew-x-[22deg] before:bg-gradient-to-r before:from-transparent before:via-white/35 before:to-transparent',
  'before:opacity-0 before:transition before:duration-700 hover:before:translate-x-[360%] hover:before:opacity-100',
  'focus-visible:before:translate-x-[360%] focus-visible:before:opacity-100',
].join(' ');

export const buttonBaseClass = [
  'relative isolate inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-lg border-2 px-4',
  'font-black text-sm transition active:translate-y-px active:scale-[0.99]',
  'disabled:cursor-default disabled:border-neutral-300 disabled:bg-neutral-200 disabled:text-neutral-500 disabled:active:scale-100',
].join(' ');

export const buttonVariantClass = {
  primary: 'border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800',
  secondary: 'border-neutral-300 bg-neutral-100 text-neutral-950 hover:border-neutral-950 hover:bg-white',
  ghost: 'border-transparent bg-transparent text-neutral-950 shadow-none hover:bg-black/10',
  danger: 'border-rose-700 bg-rose-700 text-white hover:bg-rose-600',
} as const;

export const iconButtonBaseClass = [
  'relative isolate grid h-10 w-10 place-items-center overflow-hidden rounded-lg text-lg font-black transition',
  'active:translate-y-px active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
].join(' ');

export const iconButtonVariantClass = {
  panel: 'border-2 border-neutral-300 bg-neutral-100 text-neutral-950 shadow-xl shadow-black/25 hover:border-neutral-950 hover:bg-white',
  plain: 'border-0 bg-transparent text-white/95 shadow-none hover:text-white',
} as const;

export const popupPanelClass = [
  'flex max-h-full max-w-full flex-col overflow-hidden rounded-xl border border-black/30',
  'bg-neutral-100 text-neutral-950 shadow-2xl shadow-black/45',
].join(' ');

export const popupHeaderClass = [
  'relative flex min-h-16 shrink-0 items-center justify-center bg-neutral-900 px-14 py-4',
  'text-center text-white shadow-[0_5px_0_rgba(0,0,0,0.25)]',
].join(' ');
