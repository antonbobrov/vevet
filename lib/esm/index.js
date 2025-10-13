import { initVevet } from './global/initVevet';
export { initVevet };
/**
 * Vevet Core
 *
 * @group Core
 */
export const vevet = (typeof window !== 'undefined' ? initVevet() : undefined);
export const app = vevet;
export * from './core/exported';
export * from './utils';
export * from './base';
export * from './components';
//# sourceMappingURL=index.js.map