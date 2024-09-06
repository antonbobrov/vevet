import { NCallbacks } from '@/base/Callbacks/types';

export namespace NViewport {
  /**
   * Callbacks parameter. Changes in viewport
   */
  export interface IChanges {
    isWidthChanged: boolean;
    isHeightChanged: boolean;
    isOrientationChanged: boolean;
  }

  /**
   * Available callbacks
   */
  export interface ICallbacksTypes extends NCallbacks.ITypes {
    /**
     * When the width is changed regardless of the height
     */
    width: IChanges;
    /**
     * When the height is changed regardless of the width
     */
    height: IChanges;
    /**
     * When both the width and height are changed
     */
    both: IChanges;
    /**
     * When only the width is changed
     */
    widthOnly: IChanges;
    /**
     * When only the height is changed
     */
    heightOnly: IChanges;
    /**
     * Any change
     */
    any: IChanges;
  }
}

/** Viewport size types */
export enum ESizeTypes {
  Desktop = 'desktop',
  Tablet = 'tablet',
  Phone = 'phone',
}

/** Orientation types */
export enum EOrientationTypes {
  Landscape = 'landscape',
  Portrait = 'portrait',
}
