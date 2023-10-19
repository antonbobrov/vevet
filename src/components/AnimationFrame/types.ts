import { NComponent } from '@/base/Component/types';

export namespace NAnimationFrame {
  export interface IStaticProps extends NComponent.IStaticProps {}

  export interface IChangeableProps extends NComponent.IChangeableProps {
    /**
     * Frames per second
     * @default 'auto'
     */
    fps?: 'auto' | number;
    /**
     * How many frames to be tested to detect real FPS
     * @default 10
     */
    autoFpsFrames?: number;
    /**
     * Enabled animation
     * @default false
     */
    isEnabled?: boolean;
  }

  export interface ICallbacksTypes extends NComponent.ICallbacksTypes {
    play: undefined;
    pause: undefined;
    toggle: undefined;
    frame: undefined;
  }
}
