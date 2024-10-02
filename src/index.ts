import { getApp } from './utils/internal/getApp';
import { IVevet } from './Vevet/global';
import { IVevetProps } from './Vevet/types';

/**
 * Vevet Application
 *
 * @see {@linkcode IVevet}
 */
export const vevet = (
  typeof window !== 'undefined' ? getApp() : undefined
) as IVevet;

declare global {
  interface Window {
    vevetApp: IVevet;
    VEVET_PROPS: Partial<IVevetProps>;
  }
}

export * from './Vevet/exported';

export * from './utils';

export * from './base';

export * from './components';

export * from './types';
