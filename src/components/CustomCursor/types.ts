import { NComponent } from '@/base/Component/types';

export namespace NCustomCursor {
  /**
   * Static properties that do not change after initialization.
   */
  export interface IStaticProps extends NComponent.IStaticProps {
    /**
     * The container where the custom cursor will be active.
     * Can be the `window`, a specific DOM element, or a string selector.
     * @default window
     */
    container: Window | Element | string;

    /**
     * Determines whether the native cursor should be hidden.
     * @default false
     */
    isNativeHidden?: boolean;
  }

  /**
   * Changeable properties that can be updated dynamically during the lifecycle of the custom cursor.
   */
  export interface IChangeableProps extends NComponent.IChangeableProps {
    /**
     * Enables or disables the custom cursor.
     * @default true
     */
    isEnabled?: boolean;

    /**
     * The width of the custom cursor.
     * @default 50
     */
    width?: number;

    /**
     * The height of the custom cursor.
     * @default 50
     */
    height?: number;

    /**
     * Linear interpolation factor for smooth cursor movement.
     * A value between `0` and `1` where higher values result in faster movement.
     * @default 0.2
     */
    lerp?: number;

    /**
     * Normalizes the animation speed across different screens with varying FPS.
     * Ensures consistent movement speed across different devices.
     * @default true
     */
    isFpsNormalized?: boolean;

    /**
     * Automatically stops rendering the cursor once the target coordinates and size
     * approximate the current ones closely enough.
     * @default true
     */
    shouldAutoStop?: boolean;
  }

  /**
   * Types of callbacks available for the custom cursor component.
   */
  export interface ICallbacksTypes extends NComponent.ICallbacksTypes {
    /**
     * Triggered when the custom cursor is created.
     * Provides access to the outer and inner HTML elements of the cursor.
     */
    create: {
      outerElement: HTMLElement;
      innerElement: HTMLElement;
    };

    /**
     * Triggered on each render to update the cursor's position.
     * Provides the current x and y coordinates.
     */
    render: IVector2;
  }

  /**
   * Represents 2D vector coordinates for cursor position (x, y).
   */
  export interface IVector2 {
    x: number;
    y: number;
  }

  /**
   * Describes the cursor’s coordinates and size for rendering.
   */
  export interface ICoords {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  /**
   * Information about the hovered element, which can affect cursor behavior.
   */
  export interface IHoveredElement {
    /**
     * The element currently being hovered over.
     */
    element: Element;

    /**
     * Whether the hover state should "stick" to the element,
     * meaning the cursor remains over the element even after moving away.
     */
    isSticky?: boolean;

    /**
     * The target width of the cursor when hovering over this element.
     * Can be set to a specific number, `false` (no change), or `auto`.
     * @default 'auto'
     */
    width?: false | number | 'auto';

    /**
     * The target height of the cursor when hovering over this element.
     * Can be set to a specific number, `false` (no change), or `auto`.
     * @default 'auto'
     */
    height?: false | number | 'auto';

    /**
     * Padding around the cursor when hovering over this element.
     */
    padding?: number;
  }
}
