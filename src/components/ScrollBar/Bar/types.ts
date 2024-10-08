import type { CustomScroll } from '@/components/CustomScroll';

/**
 * Properties for configuring the behavior and appearance of a custom scroll bar.
 */
export interface IBarProps {
  /**
   * The scrollable container element.
   * It can be the browser `window`, a custom scroll instance, or an HTML element.
   */
  container: Window | CustomScroll | Element;

  /**
   * The parent element where the scroll bar will be appended.
   * This is the DOM element that will contain the scroll bar.
   */
  domParent: Element;

  /**
   * The scroll bar's orientation or direction.
   * Can be either horizontal ('x') or vertical ('y').
   */
  direction: 'x' | 'y';

  /**
   * If `true`, the scroll bars will be hidden when inactive.
   * The scroll bar will only become visible during scrolling or interactions.
   */
  canAutoHide: boolean;

  /**
   * If `true`, the size of the scroll bar's thumb will adjust automatically
   * based on the content length and the viewport size.
   */
  shouldAutoSize: boolean;

  /**
   * The minimum size of the scroll bar's thumb.
   * This property is only applied when `shouldAutoSize` is `true`.
   */
  minSize: number;

  /**
   * A prefix used for generating class names or other identifiers for the scroll bar elements.
   */
  prefix: string;

  /**
   * If `true`, the scroll bars will be draggable, allowing users to drag the thumb to scroll.
   */
  isDraggable: boolean;

  /**
   * Defines the scroll behavior during dragging for custom scroll instances.
   * This property determines whether the scroll will be smooth or immediate ('auto').
   * This option is only applicable for `CustomScroll` instances.
   */
  scrollBehavior: 'smooth' | 'auto';
}
