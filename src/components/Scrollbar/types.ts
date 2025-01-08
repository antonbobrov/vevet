import {
  IModuleCallbacksMap,
  IModuleMutableProps,
  IModuleStaticProps,
} from '@/base';
import { ISwipeCoords } from '../Swipe';

export interface IScrollbarStaticProps extends IModuleStaticProps {
  /**
   * The element to which the scrollbar is applied.
   * Can be either the `window` or a specific HTML element.
   * @default window
   */
  container?: Window | HTMLElement;

  /**
   * The parent element where the scrollbar should be appended.
   * If `false`, the scrollbar is appended directly to the `container`.
   * For proper behavior, use `parent` when applying the scrollbar to an HTML element.
   * @default false
   */
  parent?: false | HTMLElement;

  /**
   * Custom CSS class to be applied to the scrollbar track.
   * If `false`, no additional class is applied.
   * @default false
   */
  class?: string | false;

  /**
   * Defines the scrolling axis for the scrollbar.
   * - `'x'` for horizontal scrolling.
   * - `'y'` for vertical scrolling.
   * @default 'y'
   */
  axis?: 'x' | 'y';

  /**
   * Determines whether the scrollbar thumb is draggable.
   * @default true
   */
  draggable?: boolean;

  /**
   * Automatically hides the scrollbar when inactive.
   * @default true
   */
  autoHide?: boolean;

  /**
   * Debounce time (in milliseconds) for handling resize events.
   * Helps improve performance by limiting the frequency of resize calculations.
   * @default 0
   */
  resizeDebounce?: number;
}

export interface IScrollbarMutableProps extends IModuleMutableProps {
  /**
   * Minimum size of the scrollbar thumb.
   * Accepts numeric values (interpreted as pixels) or CSS units (`px`, `rem`, `vw`, `vh`, `svh`).
   * @default 50
   */
  minSize?: number | string;

  /**
   * Enables automatic adjustment of the scrollbar size.
   * @default true
   */
  autoSize?: boolean;
}

export interface IScrollbarCallbacksMap extends IModuleCallbacksMap {
  /**
   * Triggered when the scrollbar updates its position.
   */
  update: undefined;

  /**
   * Triggered when the scrollbar resizes.
   */
  resize: undefined;

  /** Triggered when the scrollbar is shown */
  show: undefined;

  /** Triggered when the scrollbar is hidden */
  hide: undefined;

  /** Triggered on swipe start */
  swipeStart: ISwipeCoords;

  /** Triggered on swipe move */
  swipe: ISwipeCoords;

  /** Triggered on swipe end */
  swipeEnd: ISwipeCoords;
}
