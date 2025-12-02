import { ICore } from './core/global';
import { initVevet } from './global/initVevet';
import { isBrowser } from './internal/env';

export { initVevet };

/**
 * Vevet Core
 *
 * @group Core
 */
export const vevet = (isBrowser ? initVevet() : undefined) as Readonly<ICore>;

export const app = vevet;

export * from './core/exported';

export * from './utils';

export * from './base';

export * from './components';
