import {
  IViewportData,
  TViewportCallbacks,
  TViewportCallbacksOn,
} from './events/createViewport/types';
import { IVevetProps } from './types';
import { PCancelable } from '@/utils/common/PCancelable';

/** Vevet Application */
export interface IVevet extends IViewportData {
  /** Current Vevet version */
  version: string;
  /** Appliction properties */
  props: IVevetProps;
  /** Prefix used by Vevet for class names. */
  prefix: string;
  /** Is phone device */
  isPhone: boolean;
  /** Is tablet device */
  isTablet: boolean;
  /** Is desktop device */
  isDesktop: boolean;
  /** Is mobile device */
  isMobile: boolean;
  /** OS name */
  osName: string;
  /** Browser name */
  browserName: string;
  /** If WebP is supported in the browser */
  isWebpSupported: boolean;
  /** If the page is loaded */
  isPageLoaded: boolean;
  /** Document */
  doc: Document;
  /** HTML element */
  html: HTMLElement;
  /** Body element */
  body: HTMLElement;
  /**
   * Add an event on page load
   *
   * @example
   * const promise = vevet.onPageLoad();
   *
   * promise
   *   .then(() => console.log('Page loaded'))
   *   .catch(() => console.log('Error'));
   */
  onPageLoad: () => PCancelable<void>;
  /** Viewport callbacks instance */
  viewportCallbacks: TViewportCallbacks;
  /**
   * Viewport callbacks
   *
   * @example
   *
   * vevet.onViewport('width', () => console.log('width changed'));
   *
   * vevet.onViewport('height', () => console.log('height changed'));
   *
   * vevet.onViewport('both', () => console.log('both width and height changed'));
   *
   * vevet.onViewport('widthOnly', () => console.log('only width changed'));
   *
   * vevet.onViewport('heightOnly', () => console.log('only height changed'));
   *
   * vevet.onViewport('any', () => console.log('any change'));
   */
  onViewport: TViewportCallbacksOn;
}
