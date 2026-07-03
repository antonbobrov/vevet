import { doc, isBrowser } from '@/internal/env';

export const swipeStyles = isBrowser ? doc.createElement('style') : null;

if (swipeStyles) {
  swipeStyles.innerHTML = '* { cursor: grabbing !important; }';
}
