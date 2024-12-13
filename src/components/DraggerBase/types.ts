import { NComponent } from '@/base/Component/types';

export namespace NDraggerBase {
  export interface IStaticProps extends NComponent.IStaticProps {
    /**
     * The element that will be draggable. This can be a CSS selector, an HTML element, or the window.
     * @default '#v-dragger'
     */
    container?: string | Element | Window;
    /**
     * If need to prevent default events
     * @default true
     */
    preventDefault?: boolean;
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

  export interface IStartParameter {
    /**
     * The event that initiated the drag.
     */
    event: PointerEvent;

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
