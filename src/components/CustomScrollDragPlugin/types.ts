import { NPlugin } from '@/base/Plugin/types';

export namespace NCustomScrollDragPlugin {
  export interface IStaticProps extends NPlugin.IStaticProps {}

  export interface IChangeableProps extends NPlugin.IChangeableProps {
    /**
     * Determines if the dragger functionality is enabled.
     * @default true
     */
    isEnabled?: boolean;

    /**
     * Defines the speed of the dragger movement.
     * Higher values make the dragging movement faster.
     * @default 1
     */
    speed?: number;

    /**
     * Custom linear interpolation (lerp) value for smooth scrolling.
     * If set to `false`, the lerp value from the `CustomScroll` instance is used.
     * Values range between 0 and 1, with 1 being an instant scroll.
     * @default false
     */
    lerp?: number | false;

    /**
     * Threshold in pixels to stop the event propagation during a drag.
     * If set to `false`, no threshold is applied.
     * @default false
     */
    stopPropagationThreshold?: false | number;

    /**
     * Defines the direction in which to stop event propagation.
     * Either the X-axis ('x') or the Y-axis ('y').
     * @default 'y'
     */
    stopPropagationDirection?: 'x' | 'y';
  }

  export interface ICallbacksTypes extends NPlugin.ICallbacksTypes {
    /**
     * Fired when dragging starts.
     */
    start: undefined;

    /**
     * Fired while dragging is in progress.
     */
    move: undefined;

    /**
     * Fired when dragging ends.
     */
    end: undefined;
  }
}
