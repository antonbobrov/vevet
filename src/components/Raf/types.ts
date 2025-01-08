import {
  IModuleCallbacksMap,
  IModuleMutableProps,
  IModuleStaticProps,
} from '@/base/Module';

/** Static properties for the Raf module */
export interface IRafStaticProps extends IModuleStaticProps {}

/** Mutable properties for the Raf module */
export interface IRafMutableProps extends IModuleMutableProps {
  /**
   * Frames per second (FPS) for the animation. Set to 'auto' for dynamic adjustment.
   * @default 'auto'
   */
  fps?: 'auto' | number;

  /**
   * Enables or disables the Raf animation loop.
   * @default false
   */
  enabled?: boolean;

  /**
   * The number of frames after which the FPS is recalculated.
   * This value determines how often the FPS calculation is updated based on frame counts.
   * @default 10
   */
  fpsRecalcFrames?: number;
}

/** Callbacks for Raf module events */
export interface IRafCallbacksMap extends IModuleCallbacksMap {
  /** Triggered when the animation starts */
  play: undefined;

  /** Triggered when the animation is paused */
  pause: undefined;

  /** Triggered when play/pause state toggles */
  toggle: undefined;

  /** Triggered on every animation frame */
  frame: {
    /** Current frames per second */
    fps: number;
    /** Scaling coefficient based on a 60 FPS target */
    fpsFactor: number;
    /** Duration of the last frame in ms */
    duration: number;
    /** Calculate linear interpolation factor to make animations run the same regardless of FPS */
    lerpFactor: (factor: number) => number;
  };
}
