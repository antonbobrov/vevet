import type { SmoothScroll } from '@/components/SmoothScroll';

export interface IBarProps {
  /** Scrollable container */
  container: Window | SmoothScroll | Element;
  /** DOM parent, where the scrollbar will be appended */
  domParent: Element;
  /** Scrollbar type: horizontal or vertical */
  direction: 'x' | 'y';
  /** Hide scrollbars when not active */
  canAutoHide: boolean;
  /** Use auto-size */
  shouldAutoSize: boolean;
  /**
   * Minimum size of the scrollbar thumb.
   * Works when `hasAutoSize` is `true`
   */
  minSize: number;
  /** Prefix */
  prefix: string;
  /** Scrollbars are draggable */
  isDraggable: boolean;
  /** ScrollBehavior when dragging (works only for `SmoothScroll`) */
  scrollBehavior: 'smooth' | 'auto';
}

export interface ICoords {
  scrollLeft: number;
  scrollTop: number;
}
