export const isBrowser = typeof window !== 'undefined';

export const doc = (isBrowser ? document : undefined)!;

export const html = (isBrowser ? doc.documentElement : undefined)!;

export const body = (isBrowser ? doc.body : undefined)!;
