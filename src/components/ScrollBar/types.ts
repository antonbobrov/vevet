import { NComponent } from '@/base/Component/types';
import type { SmoothScroll } from '../SmoothScroll';
import { IBarProps } from './Bar/types';

type TPickedProps =
  | 'isDraggable'
  | 'shouldAutoSize'
  | 'canAutoHide'
  | 'minSize'
  | 'scrollBehavior';

export namespace NScrollBar {
  export interface IStaticProps
    extends NComponent.IStaticProps,
      Partial<Pick<IBarProps, TPickedProps>> {
    /**
     * The scrollable element
     * @default window
     */
    container?: Window | SmoothScroll | Element | string;
    /**
     * The element that will contain the scrollbar.
     * If false, the property 'container' will be taken.
     * @default false
     */
    domParent?: false | Element;
    /**
     * Timeout of resize event
     * @default 16
     */
    resizeDebounce?: number;
  }

  export interface IChangeableProps extends NComponent.IChangeableProps {}

  export interface ICallbacksTypes extends NComponent.ICallbacksTypes {}
}
