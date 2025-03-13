import { Core } from '@/core';
import { ICore } from '@/core/global';
import { ICoreProps } from '@/core/types';

declare global {
  interface Window {
    vevet5: Readonly<ICore>;
    VEVET_PROPS: Partial<ICoreProps>;
  }
}

/**
 * @group Utils
 */
export function initVevet() {
  if (window.vevet5) {
    return window.vevet5;
  }

  const coreProps = window.VEVET_PROPS ?? {};

  const core = Core(coreProps);
  window.vevet5 = core;

  return window.vevet5;
}

// auto initialize
if (typeof window !== 'undefined') {
  window.vevet5 = initVevet();
}
