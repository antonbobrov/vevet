import { NComponent } from '@/base/Component/types';

export namespace NDraggerBase {
  export interface IStaticProps extends NComponent.IStaticProps {
    /**
     * The element that will be draggable. This can be a CSS selector, an HTML element, or the window.
     * @default '#v-dragger'
     */
    container?: string | Element | Window;

    /**
     * Whether to use passive event listeners for the drag events. If set to `true`, the events will be passive, which can improve performance but prevents the default behavior from being blocked.
     * @default false
     */
    isPassive?: boolean;
  }

  export interface IChangeableProps extends NComponent.IChangeableProps {
    /**
     * Determines if dragging is enabled for the dragger. When set to `false`, dragging is disabled.
     * @default true
     */
    isEnabled?: boolean;
  }

  export interface ICallbacksTypes extends NComponent.ICallbacksTypes {
    /**
     * Triggered when dragging starts, providing the event and coordinates where dragging began.
     */
    start: IStartParameter;

    /**
     * Triggered when dragging ends.
     */
    end: undefined;
  }

  /**
   * Type representing a drag event, which can be either a `MouseEvent` or a `TouchEvent`.
   */
  export type TEvent = MouseEvent | TouchEvent;

  export interface IStartParameter {
    /**
     * The event that initiated the drag (either `MouseEvent` or `TouchEvent`).
     */
    event: TEvent;

    /**
     * The coordinates where the drag started.
     */
    start: IVector2;

    /**
     * The current coordinates of the pointer during the drag.
     */
    coords: IVector2;
  }

  export interface IVector2 {
    x: number;
    y: number;
  }
}
