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
   * - macos
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
   * vevet.onViewport('width', () => console.log('width changed'));
   *
   * vevet.onViewport('height', () => console.log('height changed'));
   *
   * vevet.onViewport('both', () => console.log('both width and height changed'));
   *
   * vevet.onViewport('width_', () => console.log('only width changed'));
   *
   * vevet.onViewport('height_', () => console.log('only height changed'));
   *
   * const destruct = vevet.onViewport('any', () => console.log('any change'));
   *
   * // cancel the event
   * destruct();
   */
  onViewport: TViewportCallbacksOn;
}
