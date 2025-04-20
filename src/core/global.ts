import {
  IViewport,
  TViewportCallbacks,
  TViewportCallbacksOn,
} from './handlers/createViewport/types';
import { ICoreProps } from './types';

/** Vevet Core */
export interface ICore extends IViewport {
  /** Current Vevet version */
  version: string;

  /** Application properties */
  props: ICoreProps;

  /** Prefix used by Vevet for class names. */
  prefix: string;

  /** Is phone device */
  phone: boolean;

  /** Is tablet device */
  tablet: boolean;

  /** Is mobile device */
  mobile: boolean;

  /**
   * OS name in lowercase. Popular results:
   *
   * - windows
   * - mac
   * - android
   * - ios
   */
  osName: string;

  /**
   * Browser name in lowercase. Popular results:
   *
   * - chrome
   * - edge-chromium
   * - opera
   * - firefox
   * - safari
   * - ios (safari & in-app safari)
   * - crios (chrome in ios)
   * - samsung
   * - yandexbrowser
   * - ios-webview
   */
  browserName: string;

  /** Document */
  doc: Document;

  /** HTML element */
  html: HTMLElement;

  /** Body element */
  body: HTMLElement;

  /** If the page is loaded */
  loaded: boolean;

  /** List of viewport callbacks */
  viewportCallbacks: TViewportCallbacks;

  /**
   * Add an event on page load.
   *
   * @example
   * const destruct = vevet.onLoad(() => {
   *   console.log('Page loaded');
   * });
   *
   * // cancel the event
   * destruct();
   */
  onLoad: (callback: () => void) => () => void;

  /**
   * Adds viewport callbacks.
   *
   * @example
   *
   * vevet.onResize('width', () => console.log('when the viewport width changes (ignores height)'));
   * 
   * vevet.onResize('height', () => console.log('when the viewport height changes (ignores width)'));
   * 
   * vevet.onResize('both', () => console.log('when both width and height change'));
   * 
   * vevet.onResize('onlyWidth', () => console.log('only when the width changes (height remains the same)'));
   * 
   * vevet.onResize('onlyHeight', () => console.log('only when the height changes (width remains the same)'));
   * 
   * vevet.onResize('any', () => console.log('when either width or height changes'));

   * const destruct = vevet.onResize('trigger', () => console.log('on any resize event, including width, height, or body size changes'));
   *
   * // cancel the event
   * destruct();
   */
  onResize: TViewportCallbacksOn;
}
