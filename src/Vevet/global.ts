import { IOnPageLoad } from './events/createOnPageLoad/types';
import { IViewport } from './events/createViewport/types';
import { IVevetProps } from './types';
import { PCancelable } from '@/utils/common/PCancelable';

/** Vevet Application */
export interface IVevet {
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
  /** Page load handler */
  pageLoad: IOnPageLoad;
  /** If the page is loaded */
  isPageLoaded: boolean;
  /** Viewport handler */
  viewport: IViewport;
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
}
