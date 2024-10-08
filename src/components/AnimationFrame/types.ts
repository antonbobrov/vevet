import { NComponent } from '@/base/Component/types';

export namespace NAnimationFrame {
  export interface IStaticProps extends NComponent.IStaticProps {}

  export interface IChangeableProps extends NComponent.IChangeableProps {
    /**
     * Frames per second (FPS) for the animation.
     * If set to 'auto', the FPS will be dynamically determined based on the system's performance.
     * @default 'auto'
     */
    fps?: 'auto' | number;

    /**
     * The number of frames to test for detecting the real FPS when 'auto' is selected.
     * This determines how many frames are measured before calculating the average FPS.
     * @default 10
     */
    autoFpsFrames?: number;

    /**
     * Determines whether the AnimationFrame is enabled or not.
     * When set to `true`, the animation loop will run.
     * @default false
     */
    isEnabled?: boolean;
  }

  export interface ICallbacksTypes extends NComponent.ICallbacksTypes {
    /**
     * Triggered when the animation starts playing.
     */
    play: undefined;

    /**
     * Triggered when the animation is paused.
     */
    pause: undefined;

    /**
     * Triggered when the animation toggles between play and pause.
     */
    toggle: undefined;

    /**
     * Triggered on each frame of the animation.
     */
    frame: undefined;
  }
}
