import { NComponent } from '@/base/Component/types';
import { NTimeline } from '../Timeline';
import { TNormalizeWheel } from '@/utils/scroll/normalizeWheel';
import { NDraggerMove } from '../DraggerMove';

export namespace NSlideProgress {
  export interface IStaticProps extends NComponent.IStaticProps {
    /** HTML Container */
    container: HTMLElement;
  }

  export interface IChangeableProps extends NComponent.IChangeableProps {
    /** Minimum progress value */
    min: number;
    /** Maximum progress value */
    max: number;
    /** Progress step */
    step: number;
    /**
     * Linear interpolation ease
     * @default 0.1
     */
    ease?: number;
    /**
     * Linear interpolation friction
     * @default 0.5
     */
    friction?: number;
    /**
     * Use drag events
     * @default true
     */
    hasDrag?: boolean;
    /**
     * Dragger speed
     * @default 1
     */
    dragSpeed?: number;
    /**
     * Dragger direction
     * @default 'y'
     */
    dragDirection?: 'x' | 'y';
    /**
     * Use wheel events
     * @default true
     */
    hasWheel?: boolean;
    /**
     * Wheel speed
     * @default 1
     */
    wheelSpeed?: number;
    /**
     * Duration of sticky animation to the nearest step. If nullable, the animation is disabled.
     * @default 500
     */
    stickyEndDuration?: TDuration | null;
    /**
     * Drag threshold
     * @default 3
     */
    dragThreshold?: number;
  }

  export interface ICallbacksTypes extends NComponent.ICallbacksTypes {
    render: undefined;
    step: undefined;
    wheel: TNormalizeWheel;
    dragMove: NDraggerMove.IMoveParameter;
  }

  export interface IWithLerp {
    current: number;
    target: number;
  }

  export type TDuration = number | ((multiplier: number) => number);

  export interface IToProps {
    value: number;
    /** @default 500 */
    duration?: TDuration;
    onProgress?: (props: NTimeline.ICallbacksTypes['progress']) => void;
    onEnd?: () => void;
  }
}
