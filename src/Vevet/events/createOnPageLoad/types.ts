import { NCallbacks } from '@/base/Callbacks/types';

export interface ICallbacksTypes extends NCallbacks.ITypes {
  loaded: undefined;
}

export interface IOnPageLoad {
  /**
   * Add a callback on page load
   * If the page is already loaded, the callback will be called immediately and return undefined.
   * Otherwise, a descructable callback will be returned that can be used to remove the callback.
   *
   * @example
   * const callback = vevet.pageLoad.onLoad(() => console.log('Page loaded'));
   *
   * callback?.remove()
   */
  onLoad: (callback: () => void) => NCallbacks.IAddedCallback | undefined;
  /** Get if the page is loaded */
  getIsLoaded: () => boolean;
}
