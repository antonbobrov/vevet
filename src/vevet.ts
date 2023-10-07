import { Application } from '.';

export const vevet =
  typeof window.vevetApp !== 'undefined' ? window.vevetApp : new Application();
