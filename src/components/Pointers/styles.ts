import { doc, isBrowser } from '@/internal';

export const styles = isBrowser ? doc.createElement('style') : null;

if (styles) {
  styles.innerHTML = '* { user-select: none !important; }';
}
