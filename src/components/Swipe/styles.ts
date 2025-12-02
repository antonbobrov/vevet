import { doc, isBrowser } from '@/internal/env';

export const cursorStyles = isBrowser ? doc.createElement('style') : null;

if (cursorStyles) {
  cursorStyles.innerHTML = '* { cursor: grabbing !important; }';
}
