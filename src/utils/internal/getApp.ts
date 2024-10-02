import { Vevet } from '@/src/Vevet';

export function getApp() {
  if (!window.vevetApp) {
    const appProps = window.VEVET_PROPS ?? {};

    const app = Vevet(appProps);

    window.vevetApp = app;
  }

  return window.vevetApp;
}

if (typeof window !== 'undefined') {
  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  window.__vevetAutoInitialize = getApp();
}
