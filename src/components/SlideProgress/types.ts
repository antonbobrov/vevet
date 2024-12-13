import { NComponent } from '@/base/Component/types';
import { NTimeline } from '../Timeline';
import { TNormalizeWheel } from '@/utils/scroll/normalizeWheel';
import { NDraggerMove } from '../DraggerMove';

export namespace NSlideProgress {
  export interface IStaticProps extends NComponent.IStaticProps {
    /** HTML container element where the component is applied */
    container: HTMLElement;
  }

  export interface IChangeableProps extends NComponent.IChangeableProps {
    /** Minimum value of the progress */
    min: number;
    /** Maximum value of the progress */
    max: number;
    /** The step size for progress increments */
    step: number;
    /**
     * Threshold to determine step size changes. Ranges from 0.001 to 0.5.
     * @default 0.1
     */
    stepThreshold?: number;
    /**
     * Linear interpolation easing factor
     * @default 0.1
     */
    ease?: number;
    /**
     * Friction applied during interpolation
     * @default 0.5
     */
    friction?: number;
    /**
     * Enable or disable drag events for progress control
     * @default true
     */
    hasDrag?: boolean;
    /**
     * Speed factor for dragging movements
     * @default 1
     */
    dragSpeed?: number;
    /**
     * Direction of the drag movement (either 'x' or 'y')
     * @default 'y'
     */
    dragDirection?: 'x' | 'y';
    /**
     * Enable or disable mouse wheel events for progress control
     * @default true
     */
    hasWheel?: boolean;
    /**
     * Speed factor for mouse wheel movements
     * @default 1
     */
    wheelSpeed?: number;
    /**
     * Duration for sticky animation to snap to the nearest step. If `null`, sticky animation is disabled.
     * @default 500
     */
    stickyEndDuration?: TDuration | null;
    /**
     * Minimum threshold for drag movements (in pixels).
     * @default 5
     */
    dragThreshold?: number;
  }

  export interface ICallbacksTypes extends NComponent.ICallbacksTypes {
    /** Fired during the rendering process */
    render: undefined;
    /** Fired when a step is completed */
    step: undefined;
    /** Fired when a wheel event is detected */
    wheel: TNormalizeWheel;
    /** Fired when a drag event moves the slider */
    dragMove: NDraggerMove.IMoveParameter;
    /** Fired when dragging ends */
    dragEnd: undefined;
  }

  export interface IWithLerp {
    /** Current progress value */
    current: number;
    /** Target progress value */
    target: number;
  }

  export type TDuration = number | ((multiplier: number) => number);

  export interface IToProps {
    /** Target progress value */
    value: number;
    /** Duration of the animation (in ms or function). Default is `500`. */
    duration?: TDuration;
    /** Callback to be fired during the animation progress */
    onProgress?: (props: NTimeline.ICallbacksTypes['progress']) => void;
    /** Callback to be fired when the animation ends */
    onEnd?: () => void;
  }
}
