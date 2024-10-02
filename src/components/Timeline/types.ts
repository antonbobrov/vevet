import { NComponent } from '@/base/Component';
import { IVevetProps } from '@/src/Vevet/types';

export namespace NTimeline {
  export interface IStaticProps extends NComponent.IStaticProps {
    /**
     * Easing function for the timeline animation.
     */
    easing?: IVevetProps['easing'];

    /**
     * Whether to destroy the timeline when the animation ends.
     * @default false
     */
    isDestroyedOnEnd?: boolean;
  }

  export interface IChangeableProps extends NComponent.IChangeableProps {
    /**
     * Duration of the timeline animation in milliseconds.
     * @default 1000
     */
    duration?: number;
  }

  export interface ICallbacksTypes extends NComponent.ICallbacksTypes {
    /**
     * Triggered when the timeline starts.
     */
    start: undefined;

    /**
     * Triggered during timeline progress updates.
     */
    progress: IProgressParameter;

    /**
     * Triggered when the timeline reaches the end.
     */
    end: undefined;
  }

  export interface IProgressParameter {
    /**
     * Current progress of the timeline, ranging from 0 to 1.
     */
    p: number;

    /**
     * Eased progress value based on the easing function.
     */
    e: number;
  }
}
