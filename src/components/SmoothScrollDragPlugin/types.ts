import { NPlugin } from '@/base/Plugin/types';

export namespace NSmoothScrollDragPlugin {
  export interface IStaticProps extends NPlugin.IStaticProps {}

  export interface IChangeableProps extends NPlugin.IChangeableProps {
    /**
     * Enable dragger
     * @default true
     */
    isEnabled?: boolean;
    /**
     * Dragger speed
     * @default 1
     */
    speed?: number;
    /**
     * Linear interpolation for `SmoothScroll` (from 0 to 1);
     * If false, the value of `SmoothScroll.props.lerp` will be used.
     * @default false
     */
    lerp?: number | false;
    /**
     * Stop propagation
     * @default false
     */
    stopPropagationThreshold?: false | number;
    /**
     * Stop propagation direction
     * @default 'y'
     */
    stopPropagationDirection?: 'x' | 'y';
  }

  export interface ICallbacksTypes extends NPlugin.ICallbacksTypes {
    start: undefined;
    move: undefined;
    end: undefined;
  }
}
