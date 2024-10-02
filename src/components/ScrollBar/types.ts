import { NComponent } from '@/base/Component/types';
import type { CustomScroll } from '../CustomScroll';
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
     * The scrollable element to which the scroll bar will be applied.
     * Can be the window, a custom scroll instance, or an HTML element.
     * @default window
     */
    container?: Window | CustomScroll | Element | string;

    /**
     * The element where the scroll bars will be rendered.
     * If `false`, the scroll bar will be appended to the `container`.
     * @default false
     */
    domParent?: false | Element;

    /**
     * Timeout value (in milliseconds) to debounce the resize event.
     * This helps avoid multiple rapid invocations of resize handling.
     * @default 16
     */
    resizeDebounce?: number;
  }

  export interface IChangeableProps extends NComponent.IChangeableProps {}

  export interface ICallbacksTypes extends NComponent.ICallbacksTypes {}
}
