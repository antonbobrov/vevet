import { Core } from '@/core';
import { ICore } from '@/core/global';
import { ICoreProps } from '@/core/types';
import { isBrowser } from '@/internal/env';

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
  if (!isBrowser) {
    return undefined as unknown as ICore;
  }

  if (window.vevet5) {
    return window.vevet5;
  }

  const coreProps = window.VEVET_PROPS ?? {};

  const core = Core(coreProps);
  window.vevet5 = core;

  return window.vevet5;
}

// auto initialize
if (isBrowser) {
  window.vevet5 = initVevet();
}
