import { NComponent } from '@/base/Component/types';
import type { SmoothScroll } from '../SmoothScroll';
import { TOnResizeTarget } from '@/utils/listeners/onResize';

export namespace NScrollSectionProgress {
  export interface IStaticProps extends NComponent.IStaticProps {
    /**
     * Section element
     */
    section: string | Element;
    /**
     * Scrollable container
     * @default window
     */
    container?: string | Element | SmoothScroll | Window;
    /**
     * Viewport target
     * @default 'any'
     */
    viewportTarget?: TOnResizeTarget;
    /**
     * Timeout of resize event
     * @default 0
     */
    resizeDebounce?: number;
  }

  export interface IChangeableProps extends NComponent.IChangeableProps {}

  export interface ICallbacksTypes extends NComponent.ICallbacksTypes {
    render: undefined;
    resize: undefined;
  }
}
