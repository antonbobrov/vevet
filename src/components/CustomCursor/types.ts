import { NComponent } from '@/base/Component/types';

export namespace NCustomCursor {
  export interface IStaticProps extends NComponent.IStaticProps {
    /**
     * Cursor parent element
     * @default window
     */
    container: Window | Element | string;
    /**
     * If need to launch cursor animation after anitialization
     * @default true
     */
    isEnabled?: boolean;
    /**
     * If need to hide the native cursor
     * @default false
     */
    isNativeCursorHidden?: boolean;
  }

  export interface IChangeableProps extends NComponent.IChangeableProps {
    /**
     * @default 50
     */
    width?: number;
    /**
     * @default 50
     */
    height?: number;
    /**
     * Coords linear interpolation
     * @default 0.2
     */
    lerp?: number;
    /**
     * On different screens with different FPS, animation may be slower or faster.
     * This property is to normalize animation speed across different screens.
     * @default true
     */
    isFpsNormalized?: boolean;
    /**
     * Automatically stop rendering after the target and current values are approximated.
     * @default true
     */
    isAutoStop?: boolean;
  }

  export interface ICallbacksTypes extends NComponent.ICallbacksTypes {
    create: {
      outerElement: HTMLElement;
      innerElement: HTMLElement;
    };
    render: IVector2;
  }

  export interface IVector2 {
    x: number;
    y: number;
  }

  export interface ICoords {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  export interface IHoveredElement {
    /** Hovered element */
    element: Element;
    /** Hover ist sticky */
    isSticky?: boolean;
    /**
     * Target cursor width
     * @default 'auto'
     */
    width?: false | number | 'auto';
    /**
     * Target cursor height
     * @default 'auto'
     */
    height?: false | number | 'auto';
    /** Target cursor padding */
    padding?: number;
  }
}
